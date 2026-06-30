---
description: Tạo hoặc cập nhật file .drawio cho kiến trúc cloud, hệ thống, hoặc luồng dữ liệu
---

## Nhiệm vụ

Tạo hoặc cập nhật file `.drawio` dựa trên yêu cầu của người dùng: $ARGUMENTS

## ⚠️ Quy tắc CHỐNG LỖI — ĐỌC TRƯỚC

### A. HTML bắt buộc trong label — và cấm labelBackgroundColor

- **BẮT BUỘC** dùng `html=1;` trong style khi label chứa `<br>` hoặc bất kỳ HTML tag nào
- **BẮT BUỘC** dùng `&lt;br&gt;` (HTML entity) để xuống dòng — **KHÔNG BAO GIỜ** dùng `\n` hay `&#xa;`
- Ký tự `<br>` trong XML phải escape thành: `&lt;br&gt;`
- **TUYỆT ĐỐI KHÔNG** dùng `labelBackgroundColor=#ffffff;` (hoặc bất kỳ màu nào) — gây hình chữ nhật trắng xấu sau text label icon

**Ví dụ SAI (gây background trắng sau label):**
```xml
<!-- ❌ labelBackgroundColor tạo hộp trắng che diagram -->
<mxCell value="EC2" style="...;labelBackgroundColor=#ffffff;..."/>
```

**Ví dụ ĐÚNG (không có labelBackgroundColor):**
```xml
<!-- ✅ Không có labelBackgroundColor — label hiển thị trong suốt -->
<mxCell value="EC2" style="outlineConnect=0;fontColor=#232F3E;gradientColor=none;strokeColor=none;
  fillColor=#E7157B;align=center;html=1;fontSize=11;fontStyle=1;aspect=fixed;
  shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;
  labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;"/>

**Ví dụ đúng:**
```xml
<mxCell value="Web Server&lt;br&gt;(Apache + PHP)&lt;br&gt;EC2: t3.micro"
  style="html=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.ec2;
         fillColor=#E7157B;strokeColor=#ffffff;
         labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;
         fontSize=11;fontStyle=1;"
```

**Ví dụ SAI (sẽ gây chồng chéo text):**
```xml
<!-- ❌ Thiếu html=1 — draw.io không render <br> -->
<mxCell value="Line1&lt;br&gt;Line2" style="shape=mxgraph.aws4.resourceIcon;..."/>

<!-- ❌ Dùng &#xa; — gây newline thô, icon label bị lệch -->
<mxCell value="Line1&#xa;Line2" style="..."/>
```

### B. Shape name chính xác — KHÔNG ĐƯỢC SAI

Các tên sau đã **kiểm chứng hoạt động** trong draw.io. Chỉ dùng đúng các tên này:

| Service | resIcon (dùng với `shape=mxgraph.aws4.resourceIcon`) | fillColor |
|---------|------------------------------------------------------|-----------|
| EC2 | `mxgraph.aws4.ec2` | `#E7157B` |
| Lambda | `mxgraph.aws4.lambda` | `#E7157B` |
| ECS | `mxgraph.aws4.ecs` | `#E7157B` |
| Fargate | `mxgraph.aws4.fargate` | `#E7157B` |
| **EBS** | **`mxgraph.aws4.elastic_block_store`** ⚠️ KHÔNG dùng `ebs` | `#3F8624` |
| S3 | `mxgraph.aws4.s3` | `#3F8624` |
| EFS | `mxgraph.aws4.efs` | `#3F8624` |
| RDS | `mxgraph.aws4.rds` | `#2E73B8` |
| Aurora | `mxgraph.aws4.aurora` | `#2E73B8` |
| DynamoDB | `mxgraph.aws4.dynamodb` | `#2E73B8` |
| ElastiCache | `mxgraph.aws4.elasticache` | `#2E73B8` |
| ELB | `mxgraph.aws4.elastic_load_balancing` | `#8C4FFF` |
| Internet GW | `mxgraph.aws4.internet_gateway` | `#8C4FFF` |
| NAT GW | `mxgraph.aws4.nat_gateway` | `#8C4FFF` |
| CloudFront | `mxgraph.aws4.cloudfront` | `#8C4FFF` |
| Route 53 | `mxgraph.aws4.route_53` | `#8C4FFF` |
| API Gateway | `mxgraph.aws4.api_gateway` | `#8C4FFF` |
| VPC Endpoints | `mxgraph.aws4.vpc_endpoints` | `#8C4FFF` |
| IAM | `mxgraph.aws4.iam` | `#DD344C` |
| WAF | `mxgraph.aws4.waf` | `#DD344C` |
| Cognito | `mxgraph.aws4.cognito` | `#DD344C` |
| Key Mgmt | `mxgraph.aws4.key_management_service` | `#DD344C` |
| CloudWatch | `mxgraph.aws4.cloudwatch` | `#E7157B` |
| Systems Mgr | `mxgraph.aws4.systems_manager` | `#E7157B` |
| CodePipeline | `mxgraph.aws4.codepipeline` | `#C7131F` |
| CodeBuild | `mxgraph.aws4.codebuild` | `#C7131F` |
| ECR | `mxgraph.aws4.ecr` | `#C7131F` |
| SQS | `mxgraph.aws4.sqs` | `#E7157B` |
| SNS | `mxgraph.aws4.sns` | `#E7157B` |

### C. Shape đặc biệt — KHÔNG dùng resourceIcon

Một số shape dùng trực tiếp `shape=mxgraph.aws4.<name>` mà **KHÔNG** dùng `resourceIcon`:

| Đối tượng | Style đúng |
|-----------|------------|
| **User / Admin** | `shape=mxgraph.aws4.user;fillColor=#232F3E;strokeColor=none` |
| **Internet globe** | `shape=mxgraph.aws4.internet_alt2;fillColor=#8C4FFF;strokeColor=none` |

**Ví dụ đúng:**
```xml
<!-- User icon — dùng shape trực tiếp, KHÔNG dùng resourceIcon -->
<mxCell value="ユーザー" style="shape=mxgraph.aws4.user;fillColor=#232F3E;strokeColor=none;
  labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;fontSize=11;fontStyle=1;"
  vertex="1" parent="1">

<!-- Internet globe — dùng shape trực tiếp -->
<mxCell value="Internet" style="shape=mxgraph.aws4.internet_alt2;fillColor=#8C4FFF;strokeColor=none;
  labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;fontSize=11;fontStyle=1;"
  vertex="1" parent="1">
```

### D. Spacing — tránh chồng chéo label

- **Icon 60×60px**, label nằm dưới → tổng chiều cao thực tế: **~130px** (icon 60 + label ~70)
- **Khoảng cách ngang giữa 2 icon KHÔNG có labeled edge**: tối thiểu **200px** (center-to-center)
- **Khoảng cách ngang giữa 2 icon CÓ labeled edge**: tối thiểu **280px** (center-to-center) — để đảm bảo label không đè lên icon
- **Khoảng cách dọc tối thiểu giữa 2 icon**: **200px**
- **Label tối đa 2 dòng** cho icon label để tránh tràn. Thông tin bổ sung → dùng badge/note riêng
- **Padding trong container**: **40px** từ border container đến icon gần nhất
- **Icon nên đặt tại tọa độ chia hết cho 10** (snap to grid)

### E. Edge (mũi tên) — CHỐNG ĐÈ LABEL LÊN ICON

**Vấn đề**: Edge label mặc định nằm ở giữa (midpoint) mũi tên. Nếu icon gần nhau, label sẽ đè lên icon.

**Giải pháp ưu tiên theo thứ tự:**

1. **Ưu tiên #1: Edge KHÔNG có label** — dùng `value=""` và đặt thông tin vào badge/note riêng bên cạnh
2. **Ưu tiên #2: Label rất ngắn** (1-2 từ) + offset geometry để đẩy label ra khỏi icon:

```xml
<!-- Edge CÓ label — BẮT BUỘC dùng mxPoint offset để đẩy label ra khỏi icon -->
<mxCell value="MySQL 3306" style="edgeStyle=orthogonalEdgeStyle;strokeColor=#2E73B8;strokeWidth=2;"
  edge="1" parent="1" source="src" target="tgt">
  <mxGeometry relative="1" as="geometry">
    <mxPoint as="offset" x="0" y="-15"/>
  </mxGeometry>
</mxCell>
```

**Quy tắc offset** (`<mxPoint as="offset">`): 
- Mũi tên ngang (trái→phải): dùng `y="-15"` để đẩy label lên trên đường mũi tên
- Mũi tên dọc (trên→dưới): dùng `x="15"` để đẩy label sang phải
- **KHÔNG BAO GIỜ** dùng `y="0" x="0"` — label sẽ nằm đúng trên đường edge và che icon

3. **Ưu tiên #3: Nếu cần label dài** — dùng edge `value=""` + badge riêng đặt bên cạnh mũi tên

**Ví dụ SAI — label đè lên icon:**
```xml
<!-- ❌ Label nằm giữa edge, không có offset → đè lên target icon -->
<mxCell value="attach" style="edgeStyle=orthogonalEdgeStyle;strokeColor=#3F8624;strokeWidth=2;"
  edge="1" parent="1" source="ec2" target="ebs">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

**Ví dụ ĐÚNG — label offset hoặc không có label:**
```xml
<!-- ✅ Cách 1: Edge không có label -->
<mxCell value="" style="edgeStyle=orthogonalEdgeStyle;strokeColor=#3F8624;strokeWidth=2;"
  edge="1" parent="1" source="ec2" target="ebs">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>

<!-- ✅ Cách 2: Label ngắn + offset -->
<mxCell value="attach" style="edgeStyle=orthogonalEdgeStyle;strokeColor=#3F8624;strokeWidth=2;"
  edge="1" parent="1" source="ec2" target="ebs">
  <mxGeometry relative="1" as="geometry">
    <mxPoint as="offset" x="0" y="-15"/>
  </mxGeometry>
</mxCell>
```

---

## Quy tắc thiết kế

### 1. Canvas & Layout
- **Kích thước canvas**: A2 landscape `pageWidth="2339" pageHeight="1654"` cho diagram phức tạp; A3 `pageWidth="1654" pageHeight="1169"` cho diagram đơn giản
- **Grid**: bật `grid="1" gridSize="10"`
- **Padding**: tối thiểu 40px từ mép canvas đến nội dung

### 2. AWS Icons

**Resource icon template** (copy-paste rồi thay service name + fillColor):
```xml
<mxCell value="Service Name&lt;br&gt;(detail)" 
  style="html=1;shape=mxgraph.aws4.resourceIcon;resIcon=mxgraph.aws4.<SERVICE>;
         fillColor=<COLOR>;strokeColor=#ffffff;
         labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;
         fontSize=11;fontStyle=1;"
  vertex="1" parent="1">
  <mxGeometry x="X" y="Y" width="60" height="60" as="geometry"/>
</mxCell>
```

**Màu fill theo AWS official category** (AWS Architecture Icons 2024):
  - Networking & Content Delivery: `#8C4FFF` tím
  - Security, Identity & Compliance: `#DD344C` đỏ
  - Compute: `#E7157B` hồng đậm
  - Database: `#2E73B8` xanh dương
  - Storage: `#3F8624` xanh lá
  - Application Integration: `#E7157B` hồng
  - Management & Governance: `#E7157B` hồng
  - Developer Tools: `#C7131F` đỏ đậm
  - Analytics: `#8C4FFF` tím

### 3. Group / Container shapes

**Nguyên tắc**: Các vùng lớn (Region, AZ, Cloud boundary) dùng `fillColor=none` + border — **không fill màu nền đặc**. Chỉ các container nhỏ trong cùng (Subnet, Cluster) mới dùng fill rất nhạt với `opacity=30`.

- **AWS Cloud boundary**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_aws_cloud_alt;strokeColor=#232F3E;fillColor=none;strokeWidth=2`
- **Region**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_region;strokeColor=#232F3E;fillColor=none;strokeWidth=2`
- **Availability Zone (AZ)**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_availability_zone;strokeColor=#147EBA;fillColor=none;dashed=1;strokeWidth=1`
- **VPC**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_vpc;strokeColor=#8C4FFF;fillColor=none;strokeWidth=2`
- **Public Subnet**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_public_subnet;strokeColor=#007CBC;fillColor=#E6F3FB;opacity=30`
- **Private Subnet**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_private_subnet;strokeColor=#147EBA;fillColor=#E0F0FA;opacity=30`
- **ECS Cluster**: `shape=mxgraph.aws4.group;grIcon=mxgraph.aws4.group_ecs;strokeColor=#E7157B;fillColor=none;dashed=1`
- Mọi group đều có: `verticalAlign=top;spacingTop=22;fontSize=11;fontStyle=1`

**Khi group lồng nhau** (VPC > AZ > Subnet): cách mỗi cấp **ít nhất 30px padding** từ viền parent đến viền child.

### 4. Connections (Arrows)
- Style chuẩn: `edgeStyle=orthogonalEdgeStyle;strokeWidth=2`
- **Main traffic flow** (user → service): `strokeColor=#6c8ebf;strokeWidth=2`
- **Trong VPC** (ALB → ECS): `strokeColor=#E7157B;strokeWidth=2`
- **DB connections**: `strokeColor=#2E73B8;strokeWidth=2`
- **External API** (Stripe, LINE, OpenAI): `strokeColor` theo màu service;`dashed=1`
- **CI/CD pipeline**: `strokeColor=#b85450;strokeWidth=2`
- **Security/config** (Secrets, SSM): `dashed=1`

**Edge label:** Ưu tiên `value=""` (không label). Nếu cần label thì **BẮT BUỘC** dùng `<mxPoint as="offset"/>` (xem mục E ở trên).

### 5. Hierarchy bố cục (từ trái qua phải, top-down)
```
[External]  →  [Edge Layer]  →  [VPC]          →  [Support Services]
                                  ├─ Public              ├─ ECR, Secrets, IAM
                                  ├─ Private App         ├─ S3, SQS, EventBridge
                                  └─ Private DB          └─ ElastiCache, CloudWatch
                               [CI/CD Pipeline]
```

### 6. Màu sắc nền theo zone

| Loại container | fillColor | opacity | strokeColor |
|---|---|---|---|
| AWS Cloud / Region | none | — | `#232F3E` |
| AZ | none | — | `#147EBA` dashed |
| VPC | none | — | `#8C4FFF` |
| Public Subnet | `#E6F3FB` | 30 | `#007CBC` |
| Private Subnet | `#E0F0FA` | 30 | `#147EBA` |
| ECS Cluster | none | — | `#E7157B` dashed |

### 7. Typography
- Title: `fontSize=22;fontStyle=1`
- Group header: `fontSize=13;fontStyle=1`
- Icon label: `fontSize=11;fontStyle=1`
- Note/badge: `fontSize=10;fontStyle=2` (italic)

### 8. Badge / Annotation
Dùng để ghi protocol, port, cost, hoặc ghi chú ngắn trực tiếp trên diagram.

- **Badge box** (ghi chú bên cạnh icon):
  ```
  rounded=1;whiteSpace=wrap;html=1;fillColor=#fff8ee;strokeColor=#d6b656;
  align=left;spacingLeft=8;fontSize=10;verticalAlign=top;spacingTop=8
  ```
- **Inline info box** (Security Group, Route Table):
  ```
  rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;
  fontSize=10;align=left;spacingLeft=6
  ```

## Format file .drawio

```xml
<mxfile host="65bd71144e">
    <diagram id="<unique-id>" name="<page-name>">
        <mxGraphModel dx="2316" dy="1425" grid="1" gridSize="10" guides="1"
            tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1"
            pageWidth="2339" pageHeight="1654" math="0" shadow="0">
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <!-- cells here -->
            </root>
        </mxGraphModel>
    </diagram>
</mxfile>
```

## Checklist trước khi output

Trước khi viết file .drawio ra, kiểm tra lần cuối:

- [ ] Tất cả `<mxCell>` có label chứa `<br>` đều có `html=1;` trong style
- [ ] Không có `&#xa;` hay `\n` nào trong value — chỉ dùng `&lt;br&gt;`
- [ ] EBS dùng `elastic_block_store` (không phải `ebs`)
- [ ] User dùng `shape=mxgraph.aws4.user` (không phải `resourceIcon`)
- [ ] Internet dùng `shape=mxgraph.aws4.internet_alt2` (không phải `resourceIcon`)
- [ ] Khoảng cách giữa 2 icon KHÔNG có labeled edge ≥ 200px
- [ ] Khoảng cách giữa 2 icon CÓ labeled edge ≥ 280px
- [ ] **Mọi edge có label** đều có `<mxPoint as="offset"/>` để đẩy text khỏi icon
- [ ] Ưu tiên edge `value=""` — ghi chú đặt trong badge/note riêng
- [ ] Label icon tối đa 2 dòng, chi tiết bổ sung nằm trong badge/note riêng
- [ ] Tất cả tọa độ chia hết cho 10
- [ ] **Không có `labelBackgroundColor` trong bất kỳ cell nào** — gây hình chữ nhật trắng sau label

## Yêu cầu output

1. Tạo file `.drawio` đầy đủ vào đường dẫn phù hợp (ưu tiên `docs/`)
2. Nếu diagram phức tạp (>10 services): tạo **2 pages**:
   - Page 1: Architecture diagram với icons
   - Page 2: Notes page giải thích các thành phần
3. Sau khi tạo, liệt kê ngắn gọn: số pages, số services/nodes, đường dẫn file
4. Nhắc người dùng: **mở cả 2 tab trước khi save** trong draw.io để tránh mất page
