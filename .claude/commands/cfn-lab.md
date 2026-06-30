---
description: Sinh CloudFormation template từ file .drawio cho AWS Academy Learner Lab (voclabs role). Tự tránh các giới hạn quyền của Learner Lab — không tạo IAM resources, dùng LabRole/LabInstanceProfile có sẵn, region us-east-1.
argument-hint: "<đường dẫn file .drawio> [đường dẫn file mô tả .docx/.pdf nếu có]"
---

## Nhiệm vụ

Phân tích file .drawio AWS architecture và sinh CloudFormation YAML **tương thích với AWS Academy Learner Lab** — không vi phạm các quyền bị giới hạn của role `voclabs`.

Input: $ARGUMENTS

---

## ⚠️ ĐỌC TRƯỚC — RÀNG BUỘC HỌC THUẬT LEARNER LAB

AWS Academy Learner Lab dùng role `voclabs` (assumed-role) có **quyền bị giới hạn nghiêm ngặt**. Các action sau **KHÔNG được phép** — phải né hết khi sinh template:

### 1. IAM — KHÔNG được tạo / sửa / xóa

| Action bị chặn | Triệu chứng lỗi |
|---|---|
| `iam:CreateRole` | `UnauthorizedTaggingOperation`, `is not authorized to perform: iam:CreateRole` |
| `iam:CreateInstanceProfile` | Stack CREATE_FAILED ở resource type `AWS::IAM::InstanceProfile` |
| `iam:CreatePolicy` | `AccessDenied` |
| `iam:AttachRolePolicy` | `AccessDenied` |
| `iam:TagRole` | `UnauthorizedTaggingOperation` |
| `iam:PassRole` cho role mới | OK với LabRole, fail với custom role |

→ **TUYỆT ĐỐI KHÔNG** sinh các resource sau trong template:
- `AWS::IAM::Role`
- `AWS::IAM::InstanceProfile`
- `AWS::IAM::Policy`
- `AWS::IAM::ManagedPolicy`

### 2. Pre-provisioned resources có sẵn — BẮT BUỘC dùng các tên này

Learner Lab đã tạo sẵn các IAM resource sau, **chỉ cần reference**:

| Tên có sẵn | Dùng cho | Cách reference trong CFN |
|---|---|---|
| **`LabRole`** | IAM Role gắn vào EC2/Lambda/ECS | `RoleName: LabRole` hoặc lấy ARN qua data lookup |
| **`LabInstanceProfile`** | InstanceProfile gắn vào EC2 | `IamInstanceProfile: LabInstanceProfile` |
| **`vockey`** | EC2 KeyPair (Learner Lab cấp sẵn) | `KeyName: vockey` (mặc định nên dùng) |

**LabRole permissions** đã có:
- EC2, S3, RDS, Lambda, DynamoDB full hoặc near-full
- CloudWatch Logs, SSM
- Sagemaker, Comprehend, Rekognition (cho ML labs)
- KHÔNG có: IAM write, Organizations, Cost Explorer, Route53 domain

### 3. Region restriction

Learner Lab chỉ cho phép các region sau (tùy lab — kiểm tra với giáo viên):
- **`us-east-1`** (default, dùng cho hầu hết classroom)
- `us-east-2`, `us-west-2` (vài lab)

→ Trong Mappings chỉ cần `us-east-1` AMI là đủ. Mặc định region: `us-east-1`.

### 4. Service / Resource bị chặn hoàn toàn

KHÔNG sinh các resource sau (Learner Lab không hỗ trợ):
- `AWS::Organizations::*`
- `AWS::Account::*`
- `AWS::IAM::User`, `AWS::IAM::Group`, `AWS::IAM::AccessKey`
- `AWS::Route53::HostedZone` (chỉ RecordSet trên hosted zone có sẵn)
- `AWS::ACM::Certificate` (limited — báo người dùng thay HTTPS bằng HTTP)
- `AWS::KMS::Key` (limited create)
- `AWS::WAFv2::*` (limited)
- `AWS::Macie::*`, `AWS::GuardDuty::*`
- `AWS::CloudFront::*` (vài lab block)

### 5. Quotas / Limits chặt hơn AWS thường

| Resource | Limit Learner Lab |
|---|---|
| EC2 vCPU | Tối đa ~16 vCPU (chọn t3.micro/small) |
| RDS DB Instance | Tối đa 1-2 instance, class **db.t3.micro** hoặc **db.t2.micro** |
| EIP | Tối đa 5 |
| NAT Gateway | OK nhưng phải tự xóa khi hết lab (charge) |
| Session time | Mặc định 4 giờ, kết thúc session sẽ stop EC2 (RDS không bị stop) |

→ Default InstanceType: `t3.micro`. Default DBInstanceClass: `db.t3.micro`.

### 6. DeletionPolicy — cẩn thận với Snapshot

Khi Learner Lab session kết thúc / vượt budget → account bị reset. `DeletionPolicy: Snapshot` trên RDS có thể fail nếu account bị suspend.

→ Default `DeletionPolicy: Delete` cho RDS (an toàn cho lab). Cho người dùng option override qua parameter nếu muốn snapshot.

---

## BƯỚC 1 — ĐỌC VÀ PARSE FILE .DRAWIO

Giống skill `cfn` chuẩn:

1. Đọc file .drawio bằng Read tool. Nếu user cung cấp thêm `.docx` / `.pdf` mô tả bài tập, đọc thêm để hiểu naming convention & spec
2. Parse XML: `mxfile > diagram > mxGraphModel > root > mxCell[]`
3. Phân loại từng `mxCell`:
   - **A. CONTAINER GROUP**: style chứa `group` + `grIcon` (VPC/Subnet/AZ/Region/ECS)
   - **B. AWS SERVICE ICON**: style chứa `resIcon=mxgraph.aws4.` (EC2/RDS/S3/...)
   - **C. SPECIAL SHAPE**: `shape=mxgraph.aws4.user` hoặc `internet_alt2` (không sinh resource)
   - **D. EDGE**: `edge="1"` có source/target (suy ra relationship & port)

---

## BƯỚC 2 — XÂY DỰNG TOPOLOGY MAP

### 2a. Network Hierarchy (dựa vào parent)
```
AWS Cloud → Region → VPC → AZ → Subnet (public/private) → resource icons
```

### 2b. Traffic Flow (dựa vào edges)
External → Edge (IGW/ALB) → App (EC2/ECS) → DB (RDS) → Storage (S3)
Port lấy từ edge label.

### 2c. Nếu có file mô tả (.docx/.pdf)
- Đọc để lấy **naming convention** (vd: `plab_vpc`, `クラス名番号_*`)
- Lấy **CIDR cụ thể** (vd `10.11.0.0/16` chứ không phải default `10.0.0.0/16`)
- Lấy **DB name, password mặc định** trong bài tập
- Match từng resource trên diagram với spec trong docx

---

## BƯỚC 3 — MAPPING SHAPE → CFN RESOURCE

### Compute (KHÔNG tạo IAM Role kèm)

| resIcon | CFN Resource | LabInstanceProfile? |
|---------|-------------|---------------------|
| `aws4.ec2` | `AWS::EC2::Instance` | ✅ **Có** `IamInstanceProfile: LabInstanceProfile` |
| `aws4.lambda` | `AWS::Lambda::Function` | Reference `LabRole` ARN: `Role: !Sub arn:aws:iam::${AWS::AccountId}:role/LabRole` |
| `aws4.ecs` | `AWS::ECS::Cluster` | Task role + execution role đều dùng LabRole ARN |
| `aws4.fargate` | `AWS::ECS::TaskDefinition` | `TaskRoleArn` + `ExecutionRoleArn` → LabRole |

### Networking (giống skill `cfn` chuẩn)

| resIcon | CFN Resource |
|---------|-------------|
| `aws4.internet_gateway` | `AWS::EC2::InternetGateway` + `VPCGatewayAttachment` |
| `aws4.nat_gateway` | `AWS::EC2::NatGateway` + `AWS::EC2::EIP` |
| `aws4.elastic_load_balancing` | `AWS::ElasticLoadBalancingV2::LoadBalancer` + `TargetGroup` + `Listener` |
| `aws4.vpc_endpoints` | `AWS::EC2::VPCEndpoint` |

### Database

| resIcon | CFN Resource | Default cho Lab |
|---------|-------------|-----------------|
| `aws4.rds` | `AWS::RDS::DBInstance` | `db.t3.micro`, 20GB gp2, MultiAZ: false, BackupRetentionPeriod: 0 |
| `aws4.dynamodb` | `AWS::DynamoDB::Table` | `BillingMode: PAY_PER_REQUEST` |
| `aws4.aurora` | `AWS::RDS::DBCluster` + 1 instance | `db.t3.medium` (smallest Aurora) |

### Storage / Integration

| resIcon | CFN Resource |
|---------|-------------|
| `aws4.s3` | `AWS::S3::Bucket` (Versioning optional — tốn dung lượng) |
| `aws4.sqs` | `AWS::SQS::Queue` |
| `aws4.sns` | `AWS::SNS::Topic` |

### Container Groups → Network resources

| grIcon | CFN Resource |
|--------|-------------|
| `group_vpc` | `AWS::EC2::VPC` |
| `group_public_subnet` | `AWS::EC2::Subnet` với `MapPublicIpOnLaunch: true` |
| `group_private_subnet` | `AWS::EC2::Subnet` với `MapPublicIpOnLaunch: false` |
| `group_availability_zone` | (logical — set `AvailabilityZone` trên Subnet) |

---

## BƯỚC 4 — SUY RA IMPLICIT RESOURCES

| Điều kiện | Resource cần thêm |
|-----------|-------------------|
| Có VPC + public subnet | IGW + Attachment + RouteTable + Route + Associations |
| Có private subnet + outbound | NAT Gateway + EIP + private Route |
| Có EC2 | Security Group + **dùng `LabInstanceProfile`** (KHÔNG tạo Role!) |
| Có RDS | DBSubnetGroup + Security Group riêng |
| Có ECS/Fargate | TaskDefinition + Service (Role ARN → **LabRole**) |
| Có ALB | TargetGroup + Listener |
| Có Lambda | (Role → **LabRole** ARN, KHÔNG tạo Role) |

**TUYỆT ĐỐI KHÔNG sinh:**
- `AWS::IAM::Role`
- `AWS::IAM::InstanceProfile`
- `AWS::IAM::Policy`

---

## BƯỚC 5 — DEPENDENCY ORDERING

```
1. VPC
2. Subnets
3. InternetGateway + Attachment
4. RouteTables + Routes + Associations
5. SecurityGroups
6. EIP (DependsOn: IGWAttachment)
7. NatGateway
8. Private Route → NAT
9. DBSubnetGroup
10. RDS (DependsOn: DBSubnetGroup + SG)
11. S3, SQS, DynamoDB
12. EC2 (DependsOn: SG, route, NAT if needed) — IamInstanceProfile: LabInstanceProfile
13. ALB → TargetGroup → Listener (target → EC2 instance IDs)
14. Lambda (Role: LabRole ARN)
```

---

## BƯỚC 6 — SINH CFN TEMPLATE

### Template skeleton cho Learner Lab

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: "[Tên từ diagram] — for AWS Academy Learner Lab (voclabs)"

Parameters:
  ProjectName:
    Type: String
    Default: [tên từ diagram]
  ClassNo:
    Type: String
    Default: classroom
    Description: クラス名番号 prefix (your class+student ID)
    AllowedPattern: "[a-zA-Z][a-zA-Z0-9]*"
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Default: vockey
    Description: Use Learner Lab default keypair 'vockey'
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small]
  DBInstanceClass:
    Type: String
    Default: db.t3.micro
    AllowedValues: [db.t3.micro]
  DBUsername:
    Type: String
    Default: admin
    NoEcho: true
  DBPassword:
    Type: String
    NoEcho: true
    MinLength: 8
  SshAllowCidr:
    Type: String
    Default: 0.0.0.0/0

Mappings:
  RegionAMI:
    # Learner Lab thường chỉ us-east-1; thêm us-east-2/us-west-2 phòng hờ
    us-east-1:
      AL2023: ami-0182f373e66f89c85
    us-east-2:
      AL2023: ami-08970251d20e940b0
    us-west-2:
      AL2023: ami-008fe2fc65df48dac

Resources:
  # ============================================================
  # NOTE: Learner Lab voclabs role CANNOT create IAM resources.
  # Pre-existing 'LabRole' and 'LabInstanceProfile' are used instead.
  # KeyPair 'vockey' is provided by Learner Lab — do not create new keys.
  # ============================================================

  # VPC + Subnets + Network resources here...

  # EC2 example — uses LabInstanceProfile directly (NO custom Role created)
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: !FindInMap [RegionAMI, !Ref 'AWS::Region', AL2023]
      KeyName: !Ref KeyName
      IamInstanceProfile: LabInstanceProfile  # ⚠️ LEARNER LAB: pre-provisioned, do NOT use !Ref
      SubnetId: !Ref PrivateSubnet
      SecurityGroupIds:
        - !Ref WebSG
      Tags:
        - Key: Name
          Value: !Sub ${ProjectName}-web

  # Lambda example — Role ARN points to LabRole
  ProcessorLambda:
    Type: AWS::Lambda::Function
    Properties:
      Runtime: python3.12
      Handler: index.handler
      Role: !Sub arn:aws:iam::${AWS::AccountId}:role/LabRole  # ⚠️ LEARNER LAB
      Code:
        ZipFile: |
          def handler(event, context): return {"statusCode": 200}

  # ECS Fargate example
  TaskDef:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Cpu: '256'
      Memory: '512'
      NetworkMode: awsvpc
      RequiresCompatibilities: [FARGATE]
      TaskRoleArn: !Sub arn:aws:iam::${AWS::AccountId}:role/LabRole       # ⚠️ LEARNER LAB
      ExecutionRoleArn: !Sub arn:aws:iam::${AWS::AccountId}:role/LabRole  # ⚠️ LEARNER LAB
      # ...

Outputs:
  # Mọi URL public, RDS endpoint, EC2 IP quan trọng
```

### Rules đặc biệt cho Learner Lab

**EC2 UserData** — giống skill `cfn` chuẩn (dùng Python heredoc để ghi file, bash vars `${!VAR}`, CFN params `${ParamName}`). Tránh:
- KHÔNG cài SSM Agent custom — Learner Lab AMI đã có sẵn
- KHÔNG attach IAM policy động — LabRole đã đủ quyền

**Security Groups** — giống skill `cfn` chuẩn (suy ra từ edges).

**RDS** — bắt buộc:
- `DBInstanceClass: db.t3.micro` (lab quota)
- `MultiAZ: false` (tốn quota)
- `BackupRetentionPeriod: 0` hoặc `1` (lab không cần backup dài)
- `DeletionPolicy: Delete` (default an toàn cho lab; user có thể override thành Snapshot)
- `MonitoringInterval: 0` (Enhanced Monitoring cần extra IAM role mà ta không tạo được)
- `EngineVersion`: chọn version phổ biến (MySQL 8.0, Postgres 15)

**NAT Gateway** — vẫn dùng, nhưng nhắc người dùng:
- Charge ~$1/day mỗi NAT GW
- Phải xóa NAT khi kết thúc bài tập (theo docx Learner Lab thường yêu cầu)

**ALB** — dùng `LabRole` cho access logs nếu cần (bỏ qua nếu không có S3 bucket cho logs).

---

## BƯỚC 7 — VALIDATION CHECKLIST (Lab-specific)

Trước khi output template, kiểm tra lần cuối:

**Lab compliance:**
- [ ] **KHÔNG có `AWS::IAM::Role` nào** trong Resources
- [ ] **KHÔNG có `AWS::IAM::InstanceProfile` nào** trong Resources
- [ ] **KHÔNG có `AWS::IAM::Policy` nào** trong Resources
- [ ] Mọi EC2 có `IamInstanceProfile: LabInstanceProfile` (không phải `!Ref`)
- [ ] Mọi Lambda/ECS dùng `arn:aws:iam::${AWS::AccountId}:role/LabRole` cho Role/TaskRoleArn
- [ ] Default `KeyName: vockey`
- [ ] Default region trong Mappings có `us-east-1`
- [ ] InstanceType default = `t3.micro`
- [ ] DBInstanceClass default = `db.t3.micro`
- [ ] RDS `MultiAZ: false`, `MonitoringInterval: 0`, `DeletionPolicy: Delete`
- [ ] Description có ghi rõ "for AWS Academy Learner Lab"

**Fn::Sub correctness:**
- [ ] Bash vars trong UserData dùng `${!VAR}` không phải `${VAR}`
- [ ] Chỉ CFN parameter names dùng dạng `${ParamName}`

**Networking:**
- [ ] EIP có `DependsOn: IGWAttachment`
- [ ] NAT Gateway nằm trong PUBLIC subnet
- [ ] Private subnet có route riêng → NAT
- [ ] RDS có DBSubnetGroup với ≥ 2 subnets ở 2 AZ khác nhau

**Security Groups:**
- [ ] DB SG chỉ accept từ app SG hoặc VPC CIDR, không từ 0.0.0.0/0
- [ ] Mọi SG có `VpcId: !Ref VPC`

---

## BƯỚC 8 — OUTPUT

1. **In ra summary**:
   ```
   Mode: AWS Academy Learner Lab (voclabs)
   Parsed: X compute, Y RDS, Z subnets...
   Inferred: IGW, RouteTables, NAT, SGs (no IAM created)
   IAM strategy: LabRole + LabInstanceProfile (pre-provisioned)
   Total CFN resources: ~N
   ```

2. **Ghi file** `docs/cloudformation/<filename>-lab-stack.yml` cùng thư mục với .drawio (suffix `-lab` để phân biệt với version production)

3. **In deploy command (KHÔNG có CAPABILITY_NAMED_IAM)**:
   ```bash
   aws cloudformation create-stack \
     --stack-name <projectname>-lab \
     --region us-east-1 \
     --template-body file://docs/cloudformation/<filename>-lab-stack.yml \
     --parameters \
       ParameterKey=ClassNo,ParameterValue=YOUR_CLASS_NO \
       ParameterKey=DBPassword,ParameterValue=YOUR_PASSWORD \
       ParameterKey=SshAllowCidr,ParameterValue=YOUR_IP/32

   # Theo dõi
   aws cloudformation describe-stack-events --stack-name <projectname>-lab \
     --region us-east-1 --max-items 20

   # Xóa khi xong
   aws cloudformation delete-stack --stack-name <projectname>-lab --region us-east-1
   ```

4. **In LƯU Ý cuối** (BẮT BUỘC nhắc người dùng):
   ```
   ⚠️ Learner Lab notes:
   • Session timeout: ~4 hours. EC2 sẽ tự stop khi hết session — RDS không stop.
   • Trước khi end session: chạy `delete-stack` HOẶC stop RDS thủ công để tránh hết budget.
   • KeyPair 'vockey': download từ Learner Lab console → AWS Details → "Download PEM".
   • Nếu redeploy: phải xóa stack cũ trước (Learner Lab không cho update stack ROLLBACK_COMPLETE).
   ```

5. **Nếu diagram dùng service Learner Lab không hỗ trợ** (Organizations, ACM private CA, Route53 domain register, WAFv2 với nhiều rule...): báo ngay cho người dùng và đề xuất thay thế.

---

## Khác biệt chính so với skill `cfn` chuẩn

| Mục | `cfn` (production) | `cfn-lab` (Learner Lab) |
|---|---|---|
| IAM Roles | Tạo riêng cho mỗi service | Dùng `LabRole` có sẵn |
| InstanceProfile | Tự tạo | Dùng `LabInstanceProfile` có sẵn |
| KeyName default | User-provided (no default) | `vockey` |
| Region default | `ap-northeast-1` (Tokyo) | `us-east-1` (lab default) |
| InstanceType | t3.small / t3.medium | `t3.micro` (quota) |
| DBInstanceClass | `db.t3.small`+ | `db.t3.micro` (quota) |
| RDS Backup | 7 days | 0-1 day |
| RDS MultiAZ | true cho prod | false (quota) |
| DeletionPolicy RDS | Snapshot | Delete (an toàn cho lab) |
| Capability flag | `CAPABILITY_NAMED_IAM` | (không cần) |
| Output suffix | `-stack.yml` | `-lab-stack.yml` |
| Cleanup reminder | optional | BẮT BUỘC (charge & session limit) |
