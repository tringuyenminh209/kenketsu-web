---
description: Thiết kế nhân vật pixel art chibi cho DevOffice AI — tạo mới, chỉnh sửa, hoặc thêm animation state cho agent characters (32×48px, Phaser.js canvas)
---

# Pixel Character Designer — DevOffice AI

Yêu cầu: $ARGUMENTS

---

## Nhiệm vụ

Thiết kế nhân vật pixel art chibi hoàn chỉnh theo yêu cầu, bao gồm:
1. Đọc spec thiết kế nếu cần
2. Generate code nhân vật (Phaser Graphics hoặc HTML Canvas demo)
3. Output file demo HTML tại `design/character_demo_<name>.html` hoặc update Phaser canvas

---

## ⚠️ Đọc spec trước khi làm

Luôn đọc các file sau trước khi design bất kỳ nhân vật nào:

```
DevOffice_AI/design/Đặc tả Chi tiết Hệ thống Nhân vật Agent.md
DevOffice_AI/design/Thiết kế Tổng thể Dự án DevOffice AI.md
```

Nếu đang sửa code Phaser:
```
DevOffice_AI/Frontend/src/app/components/VirtualOfficeCanvasV2.tsx
```

---

## Quy tắc kỹ thuật bắt buộc

### Kích thước & tỉ lệ sprite

| Tham số | Giá trị | Lý do |
|---|---|---|
| Sprite size | 32 × 48 px | Spec gốc, đủ rộng cho chibi |
| Scale demo | 4× (128×192 px) | Đọc được trong browser |
| Tỉ lệ đầu | ~40% chiều cao | Chibi = đầu to, thân nhỏ |
| FPS animation | 12 FPS (retro style) | Tiết kiệm tài nguyên |
| Flip axis | Scale X = -1 | Khi nhân vật đổi hướng |

### Hệ tọa độ sprite (y=0 ở đỉnh, y=47 ở đáy)

```
y  0- 2  : Khoảng trống / đỉnh tóc / hiệu ứng trên đầu
y  2- 5  : Tóc (phần nổi / spikes)
y  5-13  : Đầu & mặt (chibi: 8-10px cao)
   ├─ y 6-9  : Vùng mắt / kính / visor
   ├─ y 10   : Má hồng / blush
   ├─ y 11   : Mũi
   └─ y 12-13: Miệng & cằm
y 13-14  : Cổ (4px)
y 14-17  : Vùng cổ áo / khăn
y 17-28  : Thân (torso) — 11px
   ├─ x 8-23 : Thân chính (16px rộng)
   ├─ x 4-8  : Cánh tay trái
   └─ x 23-27: Cánh tay phải
y 28-29  : Thắt lưng / belt
y 29-42  : Chân (legs) — 13px
   ├─ x 9-14 : Đùi trái
   └─ x 17-22: Đùi phải
y 42-47  : Giày / feet — 5px
y 47-50  : Bóng đổ (shadow, không tính trong sprite)
```

### Vị trí tay cầm đồ vật

| Tay | X range | Y range | Ghi chú |
|---|---|---|---|
| Tay trái (hold) | x:1-6 | y:29-34 | Phía ngoài cánh tay trái |
| Tay phải (hold) | x:23-30 | y:20-34 | Có thể vượt ra ngoài 32px |
| Đầu nhân vật | x:11-20 | y:(-5)-(-1) | Hiệu ứng trên đầu / phụ kiện cao |

### Palette màu chuẩn (DevOffice AI)

```javascript
// Skin tones (dùng chung)
SKIN      = '#F4C08B'  // base skin
SKIN2     = '#D4956A'  // shadow skin
SKIN_HI   = '#FAD5A5'  // highlight skin
BLUSH     = 'rgba(240,130,130,0.35)'

// UI theme
BG        = '#0C0D12'
SURFACE   = '#15171F'
CARD      = '#1D202B'
PRIMARY   = '#5E55EA'
EMERALD   = '#10B06B'
AMBER     = '#EB9619'
CRIMSON   = '#DA3950'
SAPPHIRE  = '#267ADE'
```

---

## Bảng màu 5 Agent cốt lõi

| ID | Tên | Main | Dark | Light | Hair | Pants | Shoes |
|---|---|---|---|---|---|---|---|
| RS | Researcher | `#1E6BB8` | `#0D4A8A` | `#4A9FE0` | `#141420` | `#1E3A5C` | `#1A1A2E` |
| AN | Analyst | `#D4A020` | `#9B7500` | `#F0C842` | `#D4A020` | `#1A1A30` | `#101020` |
| WR | Writer | `#228B22` | `#0F4A0F` | `#4EA84E` | `#3D2B1F` | `#4A4A5A` | `#2C2C2C` |
| RV | Reviewer | `#5E28A0` | `#3A1060` | `#9B5FD0` | `#101018` | `#252535` | `#101020` |
| DV | Developer | `#364550` | `#1E2D35` | `#506070` | `#1E2C38` | `#1A2428` | `#101015` |

---

## Thiết kế phụ kiện đặc trưng

### RS — Researcher
- **Kính cận**: Frame 4×4px mỗi mắt, bridge 3px, tint lens `rgba(80,160,255,0.22)`
- **Tablet**: x:23-29, y:20-30 — frame silver `#8A8A9A`, screen blue `#48B0E0`, waveform trắng
- **Lab coat**: Trắng `#F2F2F0`, cổ áo xanh `#1E6BB8`, cuff xanh tại y:26-28
- **Pen pocket**: x:9-11, y:19-23 (ngực trái)

### AN — Analyst
- **Visor bar**: x:9-22, y:8-10, gold `#D4A020`, lens glow `rgba(64,192,255,0.7)`
- **Hologram dots**: 3 chấm x:11, x:15, x:19 tại y:-3 đến y:0, animate sin wave
- **Gold tie**: x:14-17, y:17-25
- **Dark navy suit**: Lapels `#242440`, button gold `#C09010`

### WR — Writer
- **Headphones band**: Giả lập bằng rects: top `y:0-1`, L cup `x:6-9,y:5-11`, R cup `x:22-25,y:5-11`
- **Scarf**: x:11-20, y:14-17 (ngang), đuôi x:8-12, y:17-20 (thả xuống)
- **Green shirt**: `#1A5C1A` thân, `#228B22` tay áo
- **Headphone pad color**: `#228B22` matching hair accent

### RV — Reviewer
- **Vest tím**: L panel x:8-14, y:17-28, R panel x:17-23, y:17-28 — `#5E28A0`
- **Cà vạt đỏ**: x:15-16, y:17-26 — `#CC2000`
- **Con dấu**: Handle `#8B5513` tại x:24-27,y:20-23; head `#A06820` x:22-29,y:24-29; ink `#C82020`
- **Sơ mi trắng**: visible ở x:14-16, y:17-28

### DV — Developer
- **Hood**: Phủ đầu y:0-9, bên hông y:7-14, lining tối hơn `dk(hoodCol, 40)`
- **Kangaroo pocket**: x:11-19, y:21-26, divider dọc x:15
- **Coffee cup**: x:23-29, y:23-30, steam animated `rgba(255,255,255,alpha)`
- **Matrix code**: 3×3 grid chớp tắt `#00CC33` tại x:10-19, y:19-28 với opacity 30%

---

## State Animations

### Idle (mọi agent)
```javascript
// Bob lên xuống ±1.5 sprite-px, period ~1.7s, phase offset mỗi agent
const bob = Math.round(Math.sin(t * 0.0032 + agent.bobPhase) * 1.5);
// integer snap để crisp pixels
```

### Thinking (RS)
- Hiệu ứng "thought particles": 3-5 chấm nhỏ trắng orbit đầu theo đường tròn r=12px
- Kính phát sáng nhẹ (fillRect blue tint bằng alpha tăng giảm)

### Tool Call / Action
- Particle halo xanh lá `#00CC33` orbit xung quanh nhân vật
- Badge trên đầu nhấp nháy màu tím `#5E55EA`

### Approval Required (Awaiting)
- Nhân vật dừng bob, đứng thẳng
- Viền vàng hổ phách nhấp nháy quanh sprite `#EB9619`
- Biểu tượng dấu hỏi `?` nổi lên phía trên đầu

### Error
- Glitch effect: mỗi 60 frame, shift sprite ±2px ngang ngẫu nhiên trong 3 frame
- Tia chớp đỏ nhỏ `#DA3950` phát ra từ đầu
- Card border đỏ pulsing

### Reject animation (CEO từ chối)
- RS: head.y += 3 (cúi đầu), smoke cloud `rgba(100,100,100,0.5)` nổi lên, bob chậm lại
- AN: holoDots vỡ ra theo hướng random
- WR: paper crumple (thu nhỏ dần) rồi biến mất
- RV: stamp cất vào túi (y tăng dần), nhún vai (+2px duration 200ms)
- DV: coffee đổ (xoay stamp 90°), hood trùm kín

---

## Cấu trúc code chuẩn (HTML Canvas demo)

```javascript
// ── Hàm vẽ cơ bản ──────────────────────────────
const S = 4; // scale

function px(ctx, x, y, w, h, col) {
  if (!col) return;
  ctx.fillStyle = col;
  ctx.fillRect(x * S, y * S, w * S, h * S);
}

function dk(hex, amt) { /* darken */ }
function lt(hex, amt) { /* lighten */ }

// ── Base body (shared) ──────────────────────────
function drawBase(ctx, bob, { topCol, collarCol, armCol, pantCol, shoeCol, beltCol }) {
  // Floor shadow (bob không ảnh hưởng, shadow luôn ở y=50)
  // Shoes → Pants → Belt → Torso → Arms → Hands → Neck → Head face → Blush
}

// ── Face features ────────────────────────────────
function drawFace(ctx, bob, { irisCol, glasses, visor, tiredEyes }) {
  // Eye whites → Iris → Eyelid → Highlight → Nose → Mouth
  // Glasses: pixel frame, tinted lens
  // Visor: gold band, cyan glow
}

// ── Hair styles (1 function per style) ──────────
function hair_darkSidePart(ctx, bob, col) { ... }
function hair_goldSpiky(ctx, bob, col)    { ... }
function hair_brownWavy(ctx, bob, col)    { ... }
function hair_neatDark(ctx, bob, col)     { ... }
function hair_hoodieFrame(ctx, bob, hoodCol, hairCol) { ... }

// ── Per-character draw ───────────────────────────
function drawRS(ctx, bob, t) {
  drawBase(ctx, bob, { ... });
  hair_darkSidePart(ctx, bob, '#141420');
  drawFace(ctx, bob, { glasses: true, irisCol: '#1A5A9A' });
  acc_tablet(ctx, bob);
}

// ── Animation loop ───────────────────────────────
let t = 0;
function render() {
  t += 16.67;
  const bob = Math.round(Math.sin(t * 0.0032 + phase) * 1.5);
  ctx.clearRect(0, 0, CW, CH);
  ctx.imageSmoothingEnabled = false;  // QUAN TRỌNG — không blur pixel
  agent.draw(ctx, bob, t);
  requestAnimationFrame(render);
}
```

---

## Cấu trúc code Phaser (VirtualOfficeCanvasV2.tsx)

Khi tích hợp vào Phaser, mỗi Agent là một class với dual-container pattern:

```typescript
class Agent {
  public  sprite: Phaser.GameObjects.Container;  // di chuyển theo pathfinding
  private body:   Phaser.GameObjects.Container;  // idle-bob độc lập
  private eyeL!:  Phaser.GameObjects.Ellipse;
  private eyeR!:  Phaser.GameObjects.Ellipse;

  constructor(scene: Phaser.Scene, data: AgentData, pos: {x,y}) {
    this.sprite = scene.add.container(pos.x, pos.y);
    this.body   = scene.add.container(0, 0);
    this.sprite.add(this.body);
    this.sprite.setDepth(50 + pos.y * 0.05);  // Y-depth sort
    this.drawCharacter(scene, data);
    this.startAnimations(scene);
  }

  private startAnimations(scene: Phaser.Scene) {
    // Bob trên body (KHÔNG phải sprite) → tránh conflict với pathfinding
    scene.tweens.add({
      targets: this.body, y: -4,
      duration: 1100 + Math.random() * 600,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
    // Eye blink
    scene.time.addEvent({
      delay: 3000 + Math.random() * 2500,
      callback: () => scene.tweens.add({
        targets: [this.eyeL, this.eyeR],
        scaleY: 0.08, duration: 70, yoyo: true
      }),
      loop: true
    });
  }

  public update(scene: Phaser.Scene, delta: number) {
    // Pathfinding → cập nhật sprite.x, sprite.y
    // Flip body (KHÔNG sprite) để badge không bị mirror
    if (dx < 0 && this.body.scaleX > 0) this.body.setScale(-1, 1);
    if (dx > 0 && this.body.scaleX < 0) this.body.setScale(1, 1);
    // Y-sort depth
    this.sprite.setDepth(50 + this.sprite.y * 0.05);
  }
}
```

**Vẽ body part trong Phaser**:
```typescript
// Dùng Graphics API — pixel art style
const g = scene.add.graphics();
g.fillStyle(0xF4C08B);            // hex number (không phải string)
g.fillRect(x, y, w, h);          // tọa độ tính bằng px thực (không phải sprite-px)
this.body.add(g);

// Ellipse
const eye = scene.add.ellipse(x, y, w, h, 0x1A1A3A);
this.body.add(eye);
this.eyeL = eye;

// Rectangle (dùng setSize thay vì .width = )
const bar = scene.add.rectangle(x, y, w, h, 0xEB9619);
bar.setOrigin(0, 0.5);
bar.setSize(newW, 4);             // ĐÚNG — dùng setSize()
// bar.width = newW;              // SAI — có thể gây lỗi Phaser 4
```

---

## Quy tắc thiết kế nhân vật mới

Khi tạo nhân vật hoàn toàn mới (ngoài 5 agent hiện có), phải xác định:

1. **Role concept**: Nghề nghiệp/vai trò → ảnh hưởng đến phụ kiện
2. **Color identity**: 1 màu chủ đạo + tối + sáng (xem bảng màu agent)
3. **Hair style**: Phản ánh cá tính — spiky=năng động, neat=nghiêm túc, wavy=sáng tạo
4. **Signature accessory**: Vật dụng cầm tay phải, đặt ở x:23-30, y:20-32
5. **Idle personality**: Bob nhanh (energetic) hay chậm (calm) — điều chỉnh `duration`
6. **State responses**: 4 animations: idle / action / approval / reject

**Checklist trước khi output**:
- [ ] Sprite fit trong 32×48
- [ ] Không có phần body nào ra ngoài x:0-31 (trừ accessory tay phải đến x:30 OK)
- [ ] `ctx.imageSmoothingEnabled = false` được set
- [ ] Shadow không bob (luôn ở tọa độ cố định)
- [ ] Bob là integer (Math.round) — không để float gây blur
- [ ] Mỗi state có ít nhất 1 visual indicator khác biệt
- [ ] Demo HTML có animation loop với `requestAnimationFrame`

---

## Output format

### Nếu tạo demo HTML mới:
1. Tạo file `design/character_demo_<name>.html`
2. File tự chứa (standalone), không cần dependencies
3. Dark background `#0C0D12` matching DevOffice AI theme
4. Hiển thị tất cả states: Idle / Thinking / Awaiting / Error
5. Bảng màu palette hiển thị bên dưới mỗi nhân vật

### Nếu thêm vào Phaser canvas:
1. Đọc `VirtualOfficeCanvasV2.tsx` trước
2. Thêm `drawCharacter()` method mới vào Agent class
3. Thêm entry vào `AGENT_DEFS` array
4. Thêm `ZONE_POSITIONS.workstations.<ID>` trong `pathfinding.ts`
5. Chạy `pnpm run build` để verify TypeScript

### Nếu chỉ update animation:
1. Chỉ sửa method `startAnimations()` hoặc `update()` của Agent class
2. Không thay đổi constructor hoặc drawCharacter
3. Test: idle bob không conflict với pathfinding movement

---

## Tham khảo thêm

- LPC (Libre Pixel Cup) assets: opengameart.org/content/lpc-base-assets
- Grid-Engine plugin (A* trong Phaser): github.com/Annoraaq/grid-engine
- Itch.io free office assets: itch.io/game-assets/free/tag-office
- File demo hiện tại: `design/character_demo.html`
