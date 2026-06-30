---
description: Thiết kế World Map cho DevOffice AI — vẽ buildings, plaza, roads, message lines trên Canvas 2D flat vector dark style. Dùng khi cần tạo/update world_demo.html hoặc WorldScene Phaser.
---

# World View Designer — DevOffice AI

Yêu cầu: Đọc `design/World Map Design.md` và `CLAUDE.md` §Two-Layer Architecture trước. Sau đó thiết kế/update world canvas theo flat vector dark style. Output: standalone HTML hoặc Phaser WorldScene code.

---

## ⚠️ Đọc spec trước khi làm

```
DevOffice_AI/design/World Map Design.md
DevOffice_AI/CLAUDE.md  (§Two-Layer Architecture, §5 Workflow Templates)
```

File demo hiện tại để tham khảo:
```
DevOffice_AI/design/world_demo.html
```

---

## Visual Style

| Tham số | Giá trị |
|---|---|
| Style | **Flat vector dark UI** — KHÔNG phải pixel art |
| Canvas BG | `#0C0D12` + dot grid 28px spacing `#14161E` |
| Font | `'Courier New', monospace` |
| Rendering | Smooth antialiased — KHÔNG set `imageSmoothingEnabled=false` |
| Shape | `roundRect` / `arc` / `quadraticCurveTo` — smooth Canvas 2D |
| Animation | sin-wave 60fps, không pixel-snap |

> "SimCity for your AI workforce" là metaphor concept, không phải visual style instruction.

---

## Canvas & Grid Specs

| Tham số | Giá trị |
|---|---|
| Canvas reference | 2560 × 1440 px (Phaser), responsive width/height (HTML demo) |
| Grid | 3 col × 2 row (6 slots) |
| Plaza | slot (1,0) — fixed, không đặt building |
| Building slots | MK(0,0) DV(2,0) LG(0,1) RS(1,1) AN(2,1) |
| Coordinate origin | top-left (0,0) |

### Grid → Pixel conversion (responsive)

```javascript
function gridToPixel(gx, gy, canvasW, canvasH) {
  const px = canvasW * 0.10;   // padding X
  const py = canvasH * 0.14;   // padding Y
  const cw = (canvasW - px*2) / 3;  // cell width
  const rh = (canvasH - py*2) / 2;  // row height
  return {
    x: px + gx * cw + cw / 2,
    y: py + gy * rh + rh / 2,
  };
}
```

### Building rect (responsive)

```javascript
function getBuildingRect(c, W, H) {
  const pos = gridToPixel(c.gridX, c.gridY, W, H);
  const bw  = Math.min(W * 0.17, 165);
  const bh  = Math.min(H * 0.32, 175);
  return { x: pos.x-bw/2, y: pos.y-bh/2, w: bw, h: bh, cx: pos.x, cy: pos.y };
}
```

---

## 5 Workflow Templates (màu building)

| ID | Name | Color | gridX | gridY |
|---|---|---|---|---|
| MK | Marketing Crew | `#DA3950` Crimson | 0 | 0 |
| DV | Dev Team | `#5E55EA` Violet | 2 | 0 |
| LG | Legal Review | `#800080` Purple | 0 | 1 |
| RS | Research Lab | `#267ADE` Sapphire | 1 | 1 |
| AN | Analytics HQ | `#10B06B` Emerald | 2 | 1 |

### Status colors

```javascript
const STATUS_COLOR = {
  idle:              '#333640',
  running:           '#10B06B',
  alert:             '#DA3950',
  awaiting_approval: '#F59E0B',
};
```

---

## Color Palette

```javascript
// Global
BG       = '#0C0D12'   // canvas background
SURFACE  = '#15171F'   // panel / overlay
CARD     = '#1D202B'   // card surface
BORDER   = '#1C1E28'   // road, divider
DOT_GRID = '#14161E'   // background dot grid

// Accents
ACCENT       = '#5E55EA'   // primary violet (plaza fountain, active border)
EMERALD      = '#10B06B'   // running / positive
CRIMSON      = '#DA3950'   // alert / negative
AMBER        = '#F59E0B'   // awaiting approval / warning
SAPPHIRE     = '#267ADE'   // info
```

---

## Drawing Functions

### 1. Dot Grid Background

```javascript
function drawDotGrid(ctx, W, H) {
  const sp = 28;
  ctx.fillStyle = '#14161E';
  for (let x = sp/2; x < W; x += sp)
    for (let y = sp/2; y < H; y += sp) {
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI*2); ctx.fill();
    }
}
```

### 2. Roads

```javascript
function drawRoads(ctx, W, H) {
  const px = W*0.10, py = H*0.14;
  const cw = (W-px*2)/3, rh = (H-py*2)/2;

  // Road fill
  ctx.lineWidth = 32; ctx.strokeStyle = '#111319';
  for (let row=0; row<2; row++) {
    const y = py + row*rh + rh/2;
    ctx.beginPath(); ctx.moveTo(px*0.35, y); ctx.lineTo(W-px*0.35, y); ctx.stroke();
  }
  for (let col=0; col<3; col++) {
    const x = px + col*cw + cw/2;
    ctx.beginPath(); ctx.moveTo(x, py*0.35); ctx.lineTo(x, H-py*0.35); ctx.stroke();
  }

  // Center dashes
  ctx.lineWidth = 1; ctx.strokeStyle = '#1C1E28';
  ctx.setLineDash([6, 8]);
  for (let row=0; row<2; row++) {
    const y = py + row*rh + rh/2;
    ctx.beginPath(); ctx.moveTo(px*0.35, y); ctx.lineTo(W-px*0.35, y); ctx.stroke();
  }
  for (let col=0; col<3; col++) {
    const x = px + col*cw + cw/2;
    ctx.beginPath(); ctx.moveTo(x, py*0.35); ctx.lineTo(x, H-py*0.35); ctx.stroke();
  }
  ctx.setLineDash([]);
}
```

### 3. Central Plaza

```javascript
function drawPlaza(ctx, plazaPos, ripplePhase) {
  // bw/bh = ~13–14% of canvas width/height
  const bw = ..., bh = ...;
  const { x, y } = plazaPos;

  // Stone tile base
  ctx.fillStyle = '#101218'; ctx.strokeStyle = '#1A1C26'; ctx.lineWidth = 1;
  roundRect(ctx, x-bw/2, y-bh/2, bw, bh, 6); ctx.fill(); ctx.stroke();

  // Tile grid (clip inside)
  // ... 11px tile grid lines, color '#161820'

  // Fountain rings — animate with ripplePhase (sin wave)
  const r0 = bw * 0.20;
  const rr = r0 + Math.sin(ripplePhase) * 3;
  // 3 rings: opacity 12%, 22%, 66% — accent color #5E55EA
  // Center disc: '#1A1C26' fill + '#5E55EA88' stroke

  // Label: 'CENTRAL PLAZA' — color '#252830'
}
```

### 4. Building

```javascript
function drawBuilding(ctx, c, glowPhase, hoveredId) {
  const r = getBuildingRect(c, W, H);
  const isH    = hoveredId === c.id;
  const running = c.status === 'running';

  // Hover: scale 1.028×
  const scale = isH ? 1.028 : 1.0;
  // rx, ry, rw, rh adjusted by scale around center

  // Running glow: shadowBlur = 10 + sin(glowPhase)*12
  if (running) { ctx.shadowColor = c.color; ctx.shadowBlur = 10 + ...; }

  // Main body: fill '#101218'
  // Stroke: hovered='color+DD', running='color+55', alert='#DA395088',
  //         awaiting='#F59E0B88', idle='#1C1E28'
  // lineWidth: hovered=2, else 1.5

  // Facade gradient: color+'18' → color+'05' (top-left to bottom-right)

  // Sign bar: top 19% of building, fill=color+'BB'
  // Sign text: workflow ID (MK/DV/LG/RS/AN), white, bold, Courier New

  // Windows 2×3 grid:
  //   lit: rgba(255,252,220, 0.60 * flicker)
  //   idle: '#14161E'
  //   flicker: sin-based per-window seed, not Math.random()

  // Entrance columns: 2 columns at bottom, color+'33' fill
  //   positions: rw*0.22 and rw*0.72, height=rh*0.10

  // Status dot: top-left corner, r=rw*0.038 min 4px
  //   ring animation when non-idle: sin(glowPhase*1.6) alpha

  // Agent badge: top-right corner, show c.agents count

  // Company name: below building, color='#30323C' (idle) / '#999' (hovered)
  // Cost bar: 3px, below name, green→amber→crimson based on cost ratio
}
```

### 5. Inter-Company Message Line

```javascript
function drawMessageLine(ctx, msg, companies, msgAnimPhase) {
  const from = companies.find(c => c.id === msg.fromId);
  const to   = companies.find(c => c.id === msg.toId);
  const fp = gridToPixel(from.gridX, from.gridY, W, H);
  const tp = gridToPixel(to.gridX, to.gridY, W, H);
  const pl = gridToPixel(PLAZA_GX, PLAZA_GY, W, H);

  const hex = msg.kind === 'response' ? '#10B06B' : '#5E55EA';

  // Control point: midpoint biased slightly toward plaza center, -18px Y
  const cpx = (fp.x+tp.x)/2 + (pl.x-(fp.x+tp.x)/2)*0.28;
  const cpy = (fp.y+tp.y)/2 + (pl.y-(fp.y+tp.y)/2)*0.28 - 18;

  // Animated dash: setLineDash([7,5]), lineDashOffset = -(msgAnimPhase*10 + msg.offset) % 12
  ctx.strokeStyle = hex + 'AA'; ctx.lineWidth = 1.5;
  ctx.quadraticCurveTo(cpx, cpy, tp.x, tp.y);

  // Arrow tip: compute tangent using t=0.96 on quadratic curve
  // angle = atan2(tp.y-qy, tp.x-qx) where q = point at t=0.96
  // Draw filled triangle, fillStyle = hex+'CC'
}
```

---

## Phaser WorldScene Structure

```typescript
// apps/web/src/features/world/WorldScene.ts
export class WorldScene extends Phaser.Scene {
  private buildings!: Map<string, BuildingSprite>;
  private messageLines!: MessageLine[];
  private plaza!: Phaser.GameObjects.Container;
  private glowPhase = 0;
  private ripplePhase = 0;

  constructor() { super({ key: 'WorldScene' }); }

  create() {
    this.drawDotGrid();
    this.drawRoads();
    this.plaza = this.createPlaza();
    this.createBuildings();
    // Subscribe: world:{orgId} Realtime channel
  }

  update(time: number) {
    this.glowPhase    += 0.038;
    this.ripplePhase  += 0.032;
    this.updateBuildingGlow();
    this.updatePlazaRipple();
    this.updateMessageLines();
  }

  // Click building → camera.pan + zoom → navigate('/world/:companyId')
  private onBuildingClick(companyId: string) {
    const sprite = this.buildings.get(companyId)!;
    this.cameras.main.pan(sprite.x, sprite.y, 800, 'Sine.InOut');
    this.cameras.main.zoomTo(3.0, 800, 'Sine.InOut', false, (_cam, progress) => {
      if (progress === 1) navigate(`/world/${companyId}`);
    });
  }
}
```

### BuildingSprite (Phaser.GameObjects.Graphics)

```typescript
class BuildingSprite extends Phaser.GameObjects.Container {
  private body!:      Phaser.GameObjects.Graphics;
  private signBar!:   Phaser.GameObjects.Graphics;
  private windows!:   Phaser.GameObjects.Graphics[];
  private statusDot!: Phaser.GameObjects.Arc;
  private agentBadge!:Phaser.GameObjects.Text;
  private costBar!:   Phaser.GameObjects.Rectangle;

  updateStatus(status: CompanyStatus, agents: number, costUsd: number) {
    const dotColor = STATUS_COLOR_HEX[status];
    this.statusDot.setFillStyle(dotColor);
    const ratio = Math.min(costUsd / 5, 1);
    this.costBar.width = ratio * BUILDING_W;
    this.costBar.setFillStyle(ratio < 0.5 ? 0x10B06B : ratio < 0.85 ? 0xF59E0B : 0xDA3950);
    this.agentBadge.setText(`${agents}`);
  }
}
```

### MessageLine (Phaser.GameObjects.Graphics)

```typescript
class MessageLine extends Phaser.GameObjects.Graphics {
  private dashOffset = 0;

  draw(from: {x:number,y:number}, to: {x:number,y:number}, kind: string) {
    this.clear();
    const color = kind === 'response' ? 0x10B06B : 0x5E55EA;
    this.lineStyle(1.5, color, 0.67);

    // Compute control point biased toward plaza
    // Draw quadratic bezier as dashed line manually (Phaser has no native dash)
    const dist = Phaser.Math.Distance.Between(from.x, from.y, to.x, to.y);
    // ... draw 8px dash / 5px gap segments
  }

  update() {
    this.dashOffset = (this.dashOffset + 0.28) % 12;
    // Redraw with updated offset
  }
}
```

---

## HTML Demo Format (world_demo.html)

```javascript
// Required structure:
// - Topbar: logo + LIVE badge + WORLD VIEW / BUILDING VIEW tabs + cost/agents total
// - Main: worldCanvas (flex:1) + side-panel (260px)
// - Side panel: AI Companies list + Messages In Transit + Realtime Feed
// - Controls: simulate buttons (Start All / Send Msg / Trigger Approval / Alert / Reset)
// - Legend + demo note

// Canvas loop:
function drawWorld() {
  // 1. BG fill
  // 2. drawDotGrid
  // 3. drawRoads
  // 4. messages.forEach(drawMessageLine)
  // 5. drawPlaza
  // 6. COMPANIES.forEach(drawBuilding)
  // 7. Increment phases
  requestAnimationFrame(drawWorld);
}

// Zoom-in: CSS opacity transition 0.28s
//   overlay.style.display = 'flex'
//   requestAnimationFrame(() => overlay.classList.add('visible'))
// Zoom-out: classList.remove('visible') → setTimeout 300ms → display='none'

// Approval modal inside building overlay:
//   - RISK: HIGH/MEDIUM/LOW color coding
//   - APPROVE / REJECT buttons interactive
//   - resolveApproval(decision) restores company.status
```

### Building View (5 zones — per zoomedCompany)

```javascript
// Zone floor: company color + alpha per zone
const ZONE_ALPHA = [0.07, 0.09, 0.03, 0.08, 0.07]; // per zone index
// ctx.fillStyle = company.color + hex(ZONE_ALPHA[i]*255)

// Zone dividers: company.color + '1A' stroke

// Agents: zone-bounded movement
//   agent.zone = i % ZONES.length
//   movement clamped to zone's pixel boundaries
//   states: 'thinking' → amber dots above + strokeWidth pulse
//            'tool_call' → bracket symbol beside
//            'idle' → dim
```

---

## Animation Phases

| Phase var | increment/frame | Usage |
|---|---|---|
| `ripplePhase` | +0.032 | Plaza fountain ring radius |
| `msgAnimPhase` | +0.026 | Message line dash offset |
| `glowPhase` | +0.038 | Building glow, status dot ring, window flicker, thinking dots |

Window flicker (deterministic, no Math.random per frame):
```javascript
const seed = (c.gridX*7 + c.gridY*3 + row*2 + col*1)*0.18;
const flicker = lit ? (Math.sin(glowPhase*0.65 + seed) > 0.88 ? 0.35 : 1.0) : 1.0;
```

---

## Interaction

| Action | Behavior |
|---|---|
| Hover building | Scale 1.028×, border brightens, cursor=pointer |
| Click building | Zoom-in: show buildingOverlay (CSS fade), spawn agents |
| ESC / Back btn | Zoom-out: fade out overlay, resume world draw loop |
| Side panel company row | Same as click building on canvas |
| Trigger Approval (zoomed) | Show approval modal inside buildingOverlay |
| APPROVE / REJECT | resolveApproval() — restore company.status, hide modal |

---

## Checklist trước khi output

- [ ] BG = `#0C0D12` + dot grid
- [ ] Không dùng `imageSmoothingEnabled = false`
- [ ] Không có emoji
- [ ] Building có: sign bar + 2×3 windows + entrance columns + status dot + agent badge + cost bar
- [ ] Window flicker dùng sin-based seed — không `Math.random()` per frame
- [ ] Message line là quadratic bezier qua plaza, không straight line
- [ ] Message line dùng `lineDashOffset` animated — không vẽ lại từng dash
- [ ] Zoom in/out dùng CSS opacity transition 0.28s
- [ ] Agents trong building view bị giới hạn trong zone của mình
- [ ] Approval modal hiển thị risk level + APPROVE/REJECT clickable
- [ ] Phaser: `world:{orgId}` channel subscribe trên WorldScene.create()
- [ ] Phaser: `company:{id}` channel chỉ subscribe khi zoom-in, unsubscribe khi zoom-out

---

## Tham khảo

- World demo: `design/world_demo.html` (reference implementation)
- World spec: `design/World Map Design.md`
- Building interior: `design/office_demo.html` + `/pixel-office` skill
- Agent characters: `design/character_demo.html` + `/pixel-character` skill
- CLAUDE.md §Two-Layer Architecture — channel / LOD rules
- CLAUDE.md §Realtime Channel Protocol — WorldMsg / CompanyMsg types
