---
description: Đọc file .drawio AWS architecture và sinh ra CloudFormation template hoàn chỉnh, không lỗi. Tự động map mọi AWS icon → CFN resource, suy ra network topology, dependencies, IAM, và UserData.
argument-hint: "<đường dẫn file .drawio> [--env test|prod] [--region ap-northeast-3]"
---

## Nhiệm vụ

Phân tích file .drawio AWS architecture và sinh ra CloudFormation YAML hoàn chỉnh.

Input: $ARGUMENTS

---

## BƯỚC 1 — ĐỌC VÀ PARSE FILE .DRAWIO

1. Đọc file .drawio bằng Read tool
2. Parse XML: file `.drawio` là XML với cấu trúc `mxfile > diagram > mxGraphModel > root > mxCell[]`
3. Phân loại từng `mxCell` thành một trong 4 loại:

```
A. CONTAINER GROUP  — có style chứa "group" và "grIcon"
   → Xác định: VPC, Subnet (public/private), AZ, Region, ECS Cluster
   → Lưu: id, grIcon, label, geometry (x,y,w,h)

B. AWS SERVICE ICON — có style chứa "resIcon=mxgraph.aws4."
   → Xác định: EC2, RDS, S3, Lambda, ELB, v.v.
   → Lưu: id, resIcon, label, parent (để biết nằm trong subnet/group nào)

C. SPECIAL SHAPE   — shape=mxgraph.aws4.user hoặc shape=mxgraph.aws4.internet_alt2
   → Xác định: User, Internet (external traffic source)
   → Không sinh CFN resource, chỉ dùng để hiểu traffic flow

D. EDGE (MŨI TÊN)  — có edge="1", có source và target
   → Xác định: relationship giữa services
   → Lưu: source id, target id, label (nếu có — thường là port/protocol)
```

---

## BƯỚC 2 — XÂY DỰNG TOPOLOGY MAP

Từ dữ liệu parse được, xây dựng mental model:

### 2a. Network Hierarchy (dựa vào parent của mỗi cell)
```
mxGraphModel root
└── AWS Cloud group (grIcon=group_aws_cloud_alt)
    └── Region group (grIcon=group_region)
        └── VPC group (grIcon=group_vpc)
            ├── AZ-1 group
            │   ├── Public Subnet (grIcon=group_public_subnet)
            │   │   └── [icons nằm trong này = public resources]
            │   └── Private Subnet (grIcon=group_private_subnet)
            │       └── [icons nằm trong này = private resources]
            └── AZ-2 group (nếu có)
                └── ...
```

→ Icon nào `parent=<subnetCellId>` thì nằm trong subnet đó.
→ Từ đó suy ra: public subnet → `MapPublicIpOnLaunch: true`, security group rules, NAT gateway cần thiết không.

### 2b. Traffic Flow (dựa vào edges)
- Vẽ đồ thị: `source → target [label]`
- Nhóm theo tầng: External → Edge (IGW/CloudFront) → App (EC2/ECS) → DB (RDS/ElastiCache) → Storage (S3)
- Port/protocol lấy từ edge label (ví dụ: "443", "MySQL 3306", "HTTPS")

### 2c. Cross-Account Indicators
- Nếu có mũi tên từ một service ra ngoài VPC boundary đến service khác → cần `sts:AssumeRole` trong IAM role

---

## BƯỚC 3 — MAPPING SHAPE → CFN RESOURCE

Dùng bảng này để map **resIcon** sang CFN resource type:

### Compute
| resIcon | CFN Resource | Default Properties |
|---------|-------------|-------------------|
| `aws4.ec2` | `AWS::EC2::Instance` | InstanceType: t3.micro, AMI: AL2023 |
| `aws4.lambda` | `AWS::Lambda::Function` | Runtime: nodejs20.x, Timeout: 30 |
| `aws4.ecs` | `AWS::ECS::Cluster` | CapacityProviders: [FARGATE] |
| `aws4.fargate` | `AWS::ECS::TaskDefinition` + `AWS::ECS::Service` | |
| `aws4.eks` | `AWS::EKS::Cluster` | Version: "1.29" |

### Networking
| resIcon | CFN Resource | Ghi chú |
|---------|-------------|---------|
| `aws4.elastic_load_balancing` | `AWS::ElasticLoadBalancingV2::LoadBalancer` | Loại ALB nếu kết nối HTTP/S |
| `aws4.internet_gateway` | `AWS::EC2::InternetGateway` + `VPCGatewayAttachment` | |
| `aws4.nat_gateway` | `AWS::EC2::NatGateway` + `AWS::EC2::EIP` | Luôn cần EIP |
| `aws4.cloudfront` | `AWS::CloudFront::Distribution` | |
| `aws4.route_53` | `AWS::Route53::RecordSet` | |
| `aws4.api_gateway` | `AWS::ApiGateway::RestApi` | |
| `aws4.vpc_endpoints` | `AWS::EC2::VPCEndpoint` | |

### Database & Cache
| resIcon | CFN Resource | Default |
|---------|-------------|---------|
| `aws4.rds` | `AWS::RDS::DBInstance` | Engine: mysql hoặc postgres (từ label) |
| `aws4.aurora` | `AWS::RDS::DBCluster` + `AWS::RDS::DBInstance` | Engine: aurora-postgresql |
| `aws4.dynamodb` | `AWS::DynamoDB::Table` | BillingMode: PAY_PER_REQUEST |
| `aws4.elasticache` | `AWS::ElastiCache::ReplicationGroup` | Engine: redis |

### Storage & Integration
| resIcon | CFN Resource | Default |
|---------|-------------|---------|
| `aws4.s3` | `AWS::S3::Bucket` | VersioningConfiguration: Enabled |
| `aws4.sqs` | `AWS::SQS::Queue` | VisibilityTimeout: 30 |
| `aws4.sns` | `AWS::SNS::Topic` | |
| `aws4.eventbridge` | `AWS::Events::EventBus` | |

### Security & Identity
| resIcon | CFN Resource | Ghi chú |
|---------|-------------|---------|
| `aws4.iam` | `AWS::IAM::Role` + `AWS::IAM::Policy` | Tạo role với least-privilege |
| `aws4.waf` | `AWS::WAFv2::WebACL` | |
| `aws4.cognito` | `AWS::Cognito::UserPool` + `UserPoolClient` | |
| `aws4.key_management_service` | `AWS::KMS::Key` | |
| `aws4.secrets_manager` | `AWS::SecretsManager::Secret` | |

### DevOps
| resIcon | CFN Resource | |
|---------|-------------|--|
| `aws4.ecr` | `AWS::ECR::Repository` | |
| `aws4.codepipeline` | `AWS::CodePipeline::Pipeline` | |
| `aws4.codebuild` | `AWS::CodeBuild::Project` | |
| `aws4.codecommit` | `AWS::CodeCommit::Repository` | |

### Container Groups → VPC/Subnet resources
| grIcon | CFN Resource | Properties |
|--------|-------------|-----------|
| `group_vpc` | `AWS::EC2::VPC` | CidrBlock: 10.0.0.0/16 |
| `group_public_subnet` | `AWS::EC2::Subnet` | MapPublicIpOnLaunch: true |
| `group_private_subnet` | `AWS::EC2::Subnet` | MapPublicIpOnLaunch: false |
| `group_availability_zone` | (logical only, set AvailabilityZone trên Subnet) | |
| `group_aws_cloud_alt` | (không sinh resource) | |
| `group_region` | (không sinh resource, lấy region) | |
| `group_ecs` | ECS cluster boundary, không sinh riêng | |

---

## BƯỚC 4 — SUY RA IMPLICIT RESOURCES

Sau khi map icon → resource, suy ra thêm các resource **không có icon trên diagram** nhưng bắt buộc phải có:

| Điều kiện | Resource cần thêm |
|-----------|-------------------|
| Có VPC + public subnet | `AWS::EC2::InternetGateway`, `VPCGatewayAttachment`, `RouteTable`, `Route` (0.0.0.0/0 → IGW), `SubnetRouteTableAssociation` |
| Có private subnet + internet access | `AWS::EC2::NatGateway`, `AWS::EC2::EIP`, Route từ private subnet → NAT |
| Có EC2 | `AWS::EC2::SecurityGroup`, `AWS::IAM::InstanceProfile`, `AWS::IAM::Role`, `AWS::EC2::EIP` (nếu public) |
| Có RDS | `AWS::RDS::DBSubnetGroup`, `AWS::RDS::DBParameterGroup` (optional), Security Group riêng |
| Có ECS/Fargate | `AWS::ECS::TaskDefinition`, `AWS::ECS::Service`, `AWS::IAM::Role` (task execution role) |
| Có ALB | `AWS::ElasticLoadBalancingV2::TargetGroup`, `AWS::ElasticLoadBalancingV2::Listener` |
| Có Lambda | `AWS::IAM::Role` (lambda execution role) |
| Có EC2 cần cross-account | inline policy `sts:AssumeRole` trên EC2 role |
| Có ElastiCache | `AWS::ElastiCache::SubnetGroup` |

---

## BƯỚC 5 — DEPENDENCY ORDERING

Sắp xếp Resources theo thứ tự dependency (từ trên xuống):

```
1. VPC
2. Subnets (DependsOn: VPC — implicit qua ref)
3. InternetGateway
4. VPCGatewayAttachment (DependsOn: IGW)
5. RouteTables
6. Routes (DependsOn: VPCGatewayAttachment cho public route)
7. SubnetRouteTableAssociations
8. SecurityGroups
9. IAM Roles + InstanceProfiles
10. EIP (DependsOn: VPCGatewayAttachment)
11. NatGateway (DependsOn: EIP, public subnet)
12. Private Route → NAT (DependsOn: NatGateway)
13. DBSubnetGroup (DependsOn: private subnets)
14. RDS / ElastiCache (DependsOn: DBSubnetGroup, SG)
15. S3 Buckets, SQS Queues (no deps)
16. ECR, Secrets (no deps)
17. EC2 Instance (DependsOn: EIP, SG, InstanceProfile)
18. EIPAssociation (DependsOn: EC2, EIP)
19. ECS Cluster → TaskDef → Service
20. ALB → TargetGroup → Listener
```

---

## BƯỚC 6 — SINH CFN TEMPLATE

### Template skeleton

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: "[Tên từ diagram] — generated from draw.io"

Parameters:
  ProjectName:
    Type: String
    Default: [tên từ diagram label hoặc filename]
  Environment:
    Type: String
    Default: test
    AllowedValues: [test, prod]
  # Thêm params cho mọi value có thể thay đổi theo env:
  # InstanceType, DBInstanceClass, KeyName, secrets (NoEcho: true)

Mappings:
  RegionAMI:
    ap-northeast-1:
      AL2023: ami-0599b6e53ca798bb2
    ap-northeast-3:
      AL2023: ami-047e4b9e6b2cee9e4
    ap-southeast-1:
      AL2023: ami-0c02fb55956c7d316
    us-east-1:
      AL2023: ami-0182f373e66f89c85

Resources:
  # [resources theo thứ tự BƯỚC 5]

Outputs:
  # Mọi IP public, URL, ARN quan trọng
```

### Rules khi viết resource

**EC2 UserData — LUÔN dùng Python để ghi file:**
```yaml
UserData:
  Fn::Base64:
    Fn::Sub: |
      #!/bin/bash
      set -euo pipefail
      exec > >(tee /var/log/user-data.log | logger -t user-data) 2>&1
      echo "=== START: $(date) ==="

      # Bash vars: ${!VAR}, CFN params: ${ParamName}
      # KHÔNG bao giờ dùng ${VAR} trong comment bên trong Fn::Sub

      # Cài Docker + Compose + Buildx
      dnf update -y && dnf install -y docker git python3
      systemctl enable --now docker
      usermod -aG docker ec2-user

      mkdir -p /usr/local/lib/docker/cli-plugins
      COMPOSE_VER=$(curl -fsSL https://api.github.com/repos/docker/compose/releases/latest \
        | grep -o '"tag_name": *"[^"]*"' | grep -o '"v[^"]*"' | tr -d '"' || echo "v2.27.0")
      curl -fsSL "https://github.com/docker/compose/releases/download/${!COMPOSE_VER}/docker-compose-linux-x86_64" \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
      chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

      BUILDX_VER=$(curl -fsSL https://api.github.com/repos/docker/buildx/releases/latest \
        | grep -o '"tag_name": *"[^"]*"' | grep -o '"v[^"]*"' | tr -d '"' || echo "v0.17.1")
      curl -fsSL "https://github.com/docker/buildx/releases/download/${!BUILDX_VER}/buildx-${!BUILDX_VER}.linux-amd64" \
        -o /usr/local/lib/docker/cli-plugins/docker-buildx
      chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

      # LUÔN dùng Python để ghi config files — tránh CRLF
      python3 << 'PYEOF'
      content = """\
      # nội dung file config ở đây
      """
      with open("/opt/app/config.yml", "w", newline="\n") as f:
          f.write(content)
      PYEOF

      echo "=== DONE: $(date) ==="
```

**Security Group — suy ra rules từ edges:**
- Edge từ Internet → EC2 port 443 → `Ingress: tcp/443 0.0.0.0/0`
- Edge từ EC2 → RDS port 5432 → `Ingress: tcp/5432 SourceSecurityGroupId: !Ref EC2SG`
- Mặc định **không mở** port nào không có edge

**IAM Role — suy ra permissions từ connections:**
- EC2 → S3 icon có edge → thêm `s3:GetObject`, `s3:PutObject`
- EC2 → SQS có edge → thêm `sqs:SendMessage`, `sqs:ReceiveMessage`
- EC2 → CloudWatch → thêm `cloudwatch:PutMetricData`, `logs:*`
- EC2 → service ngoài VPC (cross-account) → thêm `sts:AssumeRole`

**RDS — luôn tạo kèm:**
```yaml
DBSubnetGroup:
  Type: AWS::RDS::DBSubnetGroup
  Properties:
    DBSubnetGroupDescription: !Sub ${ProjectName} DB Subnet Group
    SubnetIds:
      - !Ref PrivateSubnet1
      - !Ref PrivateSubnet2  # RDS cần ít nhất 2 AZ
```

**ALB — luôn tạo kèm TargetGroup + Listener:**
```yaml
ALBTargetGroup:
  Type: AWS::ElasticLoadBalancingV2::TargetGroup
  Properties:
    Port: 80
    Protocol: HTTP
    VpcId: !Ref VPC
    HealthCheckPath: /health

ALBListener:
  Type: AWS::ElasticLoadBalancingV2::Listener
  Properties:
    LoadBalancerArn: !Ref ALB
    Port: 80
    Protocol: HTTP
    DefaultActions:
      - Type: forward
        TargetGroupArn: !Ref ALBTargetGroup
```

**ECS Fargate — luôn tạo kèm execution role:**
```yaml
ECSTaskExecutionRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Statement:
        - Effect: Allow
          Principal:
            Service: ecs-tasks.amazonaws.com
          Action: sts:AssumeRole
    ManagedPolicyArns:
      - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

**NAT Gateway — luôn tạo trong PUBLIC subnet, reference từ PRIVATE route:**
```yaml
NatEIP:
  Type: AWS::EC2::EIP
  DependsOn: IGWAttachment
  Properties:
    Domain: vpc

NatGateway:
  Type: AWS::EC2::NatGateway
  Properties:
    AllocationId: !GetAtt NatEIP.AllocationId
    SubnetId: !Ref PublicSubnet1  # NAT nằm ở PUBLIC subnet

PrivateRoute:
  Type: AWS::EC2::Route
  Properties:
    RouteTableId: !Ref PrivateRouteTable
    DestinationCidrBlock: 0.0.0.0/0
    NatGatewayId: !Ref NatGateway  # private → NAT
```

---

## BƯỚC 7 — VALIDATION CHECKLIST

Trước khi output template, tự kiểm tra:

**Fn::Sub correctness:**
- [ ] Tất cả bash variable trong UserData dùng `${!VAR}` không phải `${VAR}`
- [ ] Không có `${anything}` nào trong comment bên trong `Fn::Sub` block
- [ ] Chỉ CFN parameter names được dùng dạng `${ParamName}`

**File writing:**
- [ ] Không có heredoc `cat << 'EOF'` nào trong UserData — đã thay hết bằng Python `open(..., newline="\n")`

**Docker:**
- [ ] Cài Docker Buildx riêng (không chỉ Docker Compose) nếu dùng `docker compose build`
- [ ] `docker compose` (v2 CLI plugin), không phải `docker-compose` (v1 standalone)

**Networking:**
- [ ] EIP có `DependsOn: IGWAttachment`
- [ ] NAT Gateway nằm trong PUBLIC subnet
- [ ] Private subnet có route riêng → NAT (không share route table với public subnet)
- [ ] `DefaultRoute` có `DependsOn: IGWAttachment`
- [ ] RDS có `DBSubnetGroup` với ≥ 2 subnets ở 2 AZ khác nhau

**Security Groups:**
- [ ] Không có SG nào mở `0.0.0.0/0` trừ port 80/443 (và 22 nếu cần SSH)
- [ ] DB SG chỉ accept từ app SG, không từ 0.0.0.0/0
- [ ] Mọi SG đều có `VpcId: !Ref VPC`

**IAM:**
- [ ] EC2 có InstanceProfile (không gắn Role trực tiếp vào Instance)
- [ ] ECS có `ECSTaskExecutionRole` với `AmazonECSTaskExecutionRolePolicy`
- [ ] Lambda có execution role với `AWSLambdaBasicExecutionRole`
- [ ] Nếu có cross-account access: EC2 role có inline `sts:AssumeRole` policy

**Application:**
- [ ] `NEXT_PUBLIC_API_URL` và mọi public URL dùng `https://` (không phải `http://`)
- [ ] Frontend service trong docker-compose có `PORT: "3000"` override nếu dùng shared `.env`
- [ ] Next.js monorepo standalone: CMD là `node packages/frontend/server.js` (không phải `node server.js`)

**Parameters:**
- [ ] Mọi secret (DB password, JWT secret, API keys) có `NoEcho: true`
- [ ] Mọi value thay đổi theo environment được parameterize
- [ ] `CAPABILITY_NAMED_IAM` required khi có `RoleName` hoặc `InstanceProfileName`

---

## BƯỚC 8 — OUTPUT

1. **In ra summary của diagram đã parse:**
   ```
   Parsed: 3 compute, 1 RDS, 1 S3, 2 subnets (1 public/1 private), 1 ALB
   Inferred: IGW, RouteTable x2, NatGateway, DBSubnetGroup, 4 SecurityGroups, 2 IAM Roles
   Total CFN resources: ~28
   ```

2. **Ghi file** `docs/cloudformation/<filename>-stack.yml` (cùng thư mục với file .drawio hoặc trong `docs/cloudformation/`)

3. **In deploy command:**
   ```bash
   aws cloudformation create-stack \
     --stack-name <projectname>-test \
     --template-body file://docs/cloudformation/<filename>-stack.yml \
     --capabilities CAPABILITY_NAMED_IAM \
     --parameters \
       ParameterKey=KeyName,ParameterValue=YOUR_KEY \
       ParameterKey=DbPassword,ParameterValue=YOUR_PASSWORD
   ```

4. **Nếu diagram thiếu thông tin cần thiết** (ví dụ: không rõ DB engine, không có label trên EC2), hỏi đúng những điểm còn thiếu đó — không tự bịa.
