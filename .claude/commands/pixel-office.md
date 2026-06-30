---
description: Thiết kế cảnh vật pixel art văn phòng cho DevOffice AI — tạo zone, furniture, tileset, ambient animations cho office_demo.html hoặc Phaser canvas. Dùng khi cần vẽ phòng ban, nội thất, hiệu ứng môi trường.
---

# Pixel Office Designer — DevOffice AI

Yêu cầu: Đọc design/Thiết kế Chi tiết Không gian Văn phòng ảo.md và design/Thiết kế Tổng thể Dự án DevOffice AI.md, sau đó tổng hợp spec layout 5 khu vực: Lounge, Workstations, Data Vault, Meeting Room, Hallway. Trả về: tọa độ zone boundaries, danh sách furniture chi tiết per zone, và màu sắc floor/lighting cho từng khu. Không cần generate code.

---

## Nhiệm vụ

Thiết kế cảnh vật / môi trường pixel art cho văn phòng ảo, bao gồm:
1. Đọc spec thiết kế nếu cần
2. Generate code vẽ zone/furniture/animation (HTML Canvas hoặc Phaser Graphics)
3. Output file demo HTML tại `design/office_demo.html` hoặc update Phaser scene

---

## ⚠️ Đọc spec trước khi làm

Luôn đọc các file sau trước khi thiết kế bất kỳ zone nào:

```
DevOffice_AI/design/Thiết kế Chi tiết Không gian Văn phòng ảo.md
DevOffice_AI/design/Thiết kế Tổng thể Dự án DevOffice AI.md
```

Nếu đang sửa Phaser scene:
```
DevOffice_AI/Frontend/src/app/components/VirtualOfficeCanvasV2.tsx
```

---

## Canvas & Grid Specs

| Tham số | Giá trị |
|---|---|
| Canvas | 1280 × 720 px |
| Grid | 16 px/tile → 80 × 45 tiles |
| Coordinate origin | top-left (0,0) |
| Rendering | `ctx.imageSmoothingEnabled = false` |
| Aspect ratio | 16:9 (CSS `aspect-ratio: 16/9`) |

---

## Zone Boundaries (pixel coordinates)

| Zone | x_start | x_end | y_start | y_end | Tiles |
|---|---|---|---|---|---|
| LOUNGE | 16 | 334 | 16 | 704 | 20 × 43 |
| WORKSTATIONS | 334 | 946 | 16 | 704 | 38 × 43 |
| HALLWAY (cuts through WS) | 610 | 718 | 16 | 704 | 7 × 43 |
| DATA VAULT | 946 | 1264 | 16 | 368 | 20 × 22 |
| MEETING ROOM | 946 | 1264 | 384 | 704 | 20 × 20 |

> Hallway runs vertically at x:610–718, splitting Workstations into Left (x:334–610) and Right (x:718–946).

---

## Màu sắc chuẩn (DevOffice AI Theme)

```javascript
// Background & Surfaces
BG        = '#0C0D12'   // main background
SURFACE   = '#15171F'   // zone floor base
CARD      = '#1D202B'   // furniture / desk surface
BORDER    = '#2A2D3A'   // wall / divider lines
GRID_LINE = '#1A1D26'   // tile grid overlay (very subtle)

// Zone accent colors (floor tint)
LOUNGE_FLOOR    = '#0F1218'   // dark cool blue-gray
WS_FLOOR        = '#0E1018'   // neutral dark
VAULT_FLOOR     = '#0A0D16'   // deep navy (tech feel)
MEETING_FLOOR   = '#100E18'   // slight purple tint
HALLWAY_FLOOR   = '#0D0F15'   // neutral, slightly lighter

// Zone border / accent
LOUNGE_ACCENT   = '#267ADE'   // sapphire — Researcher zone
WS_ACCENT       = '#5E55EA'   // primary violet
VAULT_ACCENT    = '#10B06B'   // emerald — data/tech
MEETING_ACCENT  = '#800080'   // purple — Reviewer zone
HALLWAY_ACCENT  = '#EB9619'   // amber — approval gate

// Lighting
AMBIENT_WARM    = 'rgba(255,200,100,0.04)'
AMBIENT_COOL    = 'rgba(100,160,255,0.05)'
FLUORESCENT     = 'rgba(200,220,255,0.08)'
SERVER_GLOW     = 'rgba(16,176,107,0.15)'
```

---

## Helper Functions (HTML Canvas)

```javascript
const S = 1; // no extra scale — canvas IS 1280×720

// 2.5D block: top face + side face (drop shadow effect)
function block(x, y, w, h, col) {
  const TOP_H = Math.max(2, Math.round(h * 0.18));
  // Side face (darker)
  ctx.fillStyle = dk(col, 30);
  ctx.fillRect(x, y + TOP_H, w, h - TOP_H);
  // Top face (lighter)
  ctx.fillStyle = lt(col, 15);
  ctx.fillRect(x, y, w, TOP_H);
  // Left edge highlight
  ctx.fillStyle = lt(col, 25);
  ctx.fillRect(x, y, 2, h);
  // Right edge shadow
  ctx.fillStyle = dk(col, 40);
  ctx.fillRect(x + w - 2, y, 2, h);
}

// Flat rect
function flat(x, y, w, h, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
}

// Rounded rect
function r(x, y, w, h, col, radius = 4) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
}

// Zone floor: clipped checkerboard tiles
function zoneTiles(x, y, w, h, col1, col2, tileSize = 16) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  for (let ty = y; ty < y + h; ty += tileSize) {
    for (let tx = x; tx < x + w; tx += tileSize) {
      const even = ((Math.floor(tx/tileSize) + Math.floor(ty/tileSize)) % 2 === 0);
      ctx.fillStyle = even ? col1 : col2;
      ctx.fillRect(tx, ty, tileSize, tileSize);
    }
  }
  ctx.restore();
}

// Zone label (EN + JA)
function zoneLabel(x, y, enText, jaText, accentCol) {
  // Background pill
  ctx.fillStyle = 'rgba(12,13,18,0.85)';
  ctx.beginPath();
  ctx.roundRect(x - 4, y - 14, 140, 20, 4);
  ctx.fill();
  // Accent left bar
  ctx.fillStyle = accentCol;
  ctx.fillRect(x - 4, y - 14, 3, 20);
  // EN text
  ctx.fillStyle = accentCol;
  ctx.font = 'bold 9px monospace';
  ctx.fillText(enText, x + 4, y - 1);
  // JA text
  ctx.fillStyle = '#6B7280';
  ctx.font = '8px monospace';
  ctx.fillText(jaText, x + 4, y + 10);
}

// Darken / Lighten hex color
function dk(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xFF) - amt);
  const b = Math.max(0, (n & 0xFF) - amt);
  return `rgb(${r},${g},${b})`;
}
function lt(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xFF) + amt);
  const b = Math.min(255, (n & 0xFF) + amt);
  return `rgb(${r},${g},${b})`;
}
```

---

## Zone Design Specs

### LOUNGE (x:16–334, y:16–704) — 休憩室
**Floor**: Warm checkerboard `#0F1218` / `#111520`
**Furniture**:
| Item | Position | Notes |
|---|---|---|
| Sofa (3-seat) | x:30–160, y:580–650 | Dark blue-gray, cushions |
| Coffee table | x:60–130, y:530–580 | Low, dark wood |
| Coffee machine | x:250–300, y:80–160 | Server-like design, steam |
| Bookshelf | x:16–60, y:100–500 | Multi-shelf, books as colored rects |
| Floor lamp | x:270–290, y:460–580 | Pole + cone glow |
| Window (left wall) | x:16, y:200–420 | Light ray animation |
| Potted plant | x:170–210, y:600–680 | Green circles stacked |

**Animations**:
- Dust motes: 6 particles floating in sin path
- Window light ray: `rgba(255,220,100,0.04)` triangle pulsing
- Coffee steam: 3 sinusoidal wisps rising from machine
- Floor lamp: radial gradient glow cone

---

### WORKSTATIONS (x:334–946, y:16–704) — ワークステーション
> Left side: x:334–610 | Right side: x:718–946

**Floor**: Cool checkerboard `#0E1018` / `#0F1120`
**Furniture per desk** (5 agent desks):
| Agent | Desk position | Side | Unique item |
|---|---|---|---|
| RS | x:350–490, y:100–220 | Left | Tablet prop, 2 monitors |
| AN | x:350–490, y:280–400 | Left | Hologram display, visor prop |
| WR | x:350–490, y:460–580 | Left | Large monitor, headphone hook |
| RV | x:718–858, y:200–320 | Right | Stack of documents, stamp |
| DV | x:718–858, y:400–520 | Right | Dual monitors, coffee cup |

**Shared**: Overhead fluorescent light strips (x per desk, y:16–40)
**Animations**:
- Monitor screens: random flicker `rgba(90,80,255,0.1)` → `rgba(60,50,200,0.08)`
- Keyboard blink: cursor on RS screen
- Agent avatar circles at each desk (colored circles with 2-letter initials)

---

### DATA VAULT (x:946–1264, y:16–368) — データVault
**Floor**: Deep navy `#0A0D16` / `#0B0E18`
**Furniture**:
| Item | Position | Notes |
|---|---|---|
| Server rack 1 | x:960–1010, y:30–340 | 3 units, LED strips |
| Server rack 2 | x:1020–1070, y:30–340 | Different LED pattern |
| Server rack 3 | x:1080–1130, y:30–340 | |
| Control panel | x:1140–1260, y:200–340 | Screens, buttons |
| Laser door | x:946, y:100–260 | Entry laser lines |
| Ceiling glow | x:946–1264, y:16–50 | Emerald ambient |

**Animations**:
- Per-rack LED: each slot blinks independently via `sin(f*0.05 + slotIndex*0.7)`
- Matrix cascade: katakana chars `rgba(0,204,51,alpha)` fall down
- Data sparks: 8 particles arcing between racks
- Laser door: alternating line alpha

---

### MEETING ROOM (x:946–1264, y:384–704) — 会議室
**Floor**: Purple-tint `#100E18` / `#110F1A`
**Furniture**:
| Item | Position | Notes |
|---|---|---|
| Conference table | x:980–1230, y:460–620 | Wood grain, oval hint |
| Chairs (6) | around table | Dark charcoal rects |
| Projector screen | x:960–1264, y:390–430 | White with chart |
| Hologram cone | center table | Rotating bar chart viz |
| Whiteboard | x:946, y:420–580 | Markings, ROI label |

**Animations**:
- Hologram bars: 5 bars animate height via `sin(f*0.03 + i*0.8)`
- Cone glow: `rgba(94,85,234,0.12)` pulsing
- Projector beam: faint triangle from ceiling

---

### HALLWAY / APPROVAL GATE (x:610–718, y:16–704) — 承認ゲート
**Floor**: Amber-tinted `#0D0F15` / `#0E1016`
**Furniture**:
| Item | Position | Notes |
|---|---|---|
| Gate arch top | x:610, y:300–380 | Amber neon frame |
| Approve podium | x:620–660, y:560–640 | Green button |
| Reject podium | x:666–706, y:560–640 | Red button |
| Waiting marker | x:645–673, y:430–460 | Dashed amber rect |
| Ceiling strip | x:610–718, y:16–30 | Amber LED strip |

**Animations**:
- Gate pulse: `rgba(235,150,25,alpha)` where alpha = `0.3 + sin(f*0.05)*0.2`
- Agent waiting: pulse ring expanding from waiting marker
- Gate glow reflects on floor: radial gradient amber

---

## Ambient Lighting Patterns

```javascript
// Fluorescent overhead (workstation zone)
function drawFluorescent(x, y, w) {
  ctx.fillStyle = '#CDD5E0';
  ctx.fillRect(x, y, w, 6);
  // Light cone below
  const grad = ctx.createLinearGradient(x + w/2, y + 6, x + w/2, y + 120);
  grad.addColorStop(0, 'rgba(200,220,255,0.08)');
  grad.addColorStop(1, 'rgba(200,220,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x - 30, y + 120);
  ctx.lineTo(x + w + 30, y + 120);
  ctx.lineTo(x + w, y + 6);
  ctx.fill();
}

// Server rack LED strip
function drawServerLED(x, y, h, frame, rackIndex) {
  const NUM_SLOTS = Math.floor(h / 20);
  for (let i = 0; i < NUM_SLOTS; i++) {
    const brightness = Math.sin(frame * 0.05 + rackIndex * 1.2 + i * 0.7);
    const green = brightness > 0.3;
    const amber = brightness > -0.2 && !green;
    ctx.fillStyle = green ? '#10B06B' : amber ? '#EB9619' : '#1D202B';
    ctx.fillRect(x, y + i * 20 + 4, 6, 4);
  }
}

// Dust mote particle
function updateDustMotes(motes, frame) {
  return motes.map(m => ({
    ...m,
    x: m.baseX + Math.sin(frame * m.speedX + m.phase) * 12,
    y: m.baseY + Math.sin(frame * m.speedY + m.phase * 1.3) * 8,
    alpha: 0.25 + Math.sin(frame * 0.02 + m.phase) * 0.15
  }));
}
```

---

## Phaser Scene Integration

```typescript
class OfficeScene extends Phaser.Scene {
  private zones!: Map<string, Phaser.GameObjects.Container>;

  create() {
    this.zones = new Map();
    this.drawLounge();
    this.drawWorkstations();
    this.drawDataVault();
    this.drawMeetingRoom();
    this.drawHallway();
    this.drawWalls();
    this.drawLabels();
  }

  private drawLounge() {
    const g = this.add.graphics();
    // Floor
    g.fillStyle(0x0F1218);
    g.fillRect(16, 16, 318, 688);
    // Checkerboard overlay (every other tile)
    for (let ty = 16; ty < 704; ty += 16) {
      for (let tx = 16; tx < 334; tx += 16) {
        if ((Math.floor(tx/16) + Math.floor(ty/16)) % 2 === 0) {
          g.fillStyle(0x111520, 1);
          g.fillRect(tx, ty, 16, 16);
        }
      }
    }
    // Add furniture graphics...
    this.zones.set('lounge', this.add.container(0, 0, [g]));
  }

  update(time: number, delta: number) {
    const f = time / 16.67; // frame count equivalent
    // Update animated elements...
  }
}
```

---

## Output Format

### Nếu tạo/update office_demo.html:
1. File standalone `design/office_demo.html`, không cần dependencies
2. Canvas 1280×720, CSS wrapper `aspect-ratio: 16/9`
3. `ctx.imageSmoothingEnabled = false` bắt buộc
4. Header bar với live badge + session info + cost counter
5. Bottom legend: zone name → agent state mapping
6. `requestAnimationFrame` loop, `frame` counter tăng mỗi tick

### Nếu update Phaser scene:
1. Đọc `VirtualOfficeCanvasV2.tsx` trước
2. Mỗi zone là 1 function riêng `drawZoneName()`
3. Animated elements dùng `scene.tweens` hoặc `scene.time.addEvent`
4. Depth: floor=0, furniture=10, walls=20, agents=50+, UI=100+

### Nếu chỉ update 1 zone:
1. Chỉ sửa `drawZoneName(f)` function tương ứng
2. Không thay đổi zone boundaries hoặc canvas size
3. Giữ nguyên helper functions (`block`, `flat`, `r`, `zoneTiles`)

---

## Checklist trước khi output

- [ ] `ctx.imageSmoothingEnabled = false` được set
- [ ] Canvas size đúng 1280×720
- [ ] Tất cả zone boundaries khớp spec (không overlap không đúng)
- [ ] Hallway x:610–718 cắt qua Workstations
- [ ] Animation dùng `requestAnimationFrame`, không `setInterval`
- [ ] `frame` counter là integer (tăng 1 mỗi RAF tick)
- [ ] Zone labels hiển thị EN + Japanese
- [ ] Bottom legend có đủ 5 zones
- [ ] Không có emoji trong UI (dùng geometric shapes)

---

## Tham khảo thêm

- File office demo hiện tại: `design/office_demo.html`
- File character demo: `design/character_demo.html`
- Zone spec chi tiết: `design/Thiết kế Chi tiết Không gian Văn phòng ảo.md`
- Tổng thể design: `design/Thiết kế Tổng thể Dự án DevOffice AI.md`
- Grid Engine (A*): github.com/Annoraaq/grid-engine
- Itch.io office assets: itch.io/game-assets/free/tag-office
