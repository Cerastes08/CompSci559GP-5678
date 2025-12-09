import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { smallCar } from "./smallCar.js";
import { largeCar } from "./largeCar.js";

// ---------- Procedural asphalt helpers (no external textures) ----------

function setSRGB(tex) {
  // Compatible across Three versions
  if ("colorSpace" in tex) tex.colorSpace = T.SRGBColorSpace;
  else if ("encoding" in tex) tex.encoding = T.sRGBEncoding;
}

function clamp255(v) {
  return Math.max(0, Math.min(255, v));
}

// CanvasTexture: asphalt + subtle aggregate + tire streaks + edge paint
function makeAsphaltMap(size = 768) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  // Base asphalt
  ctx.fillStyle = "rgb(55,55,58)";
  ctx.fillRect(0, 0, size, size);

  // Big blotches (low-frequency variation)
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 40 + Math.random() * 180;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const d = (Math.random() - 0.5) * 22;
    g.addColorStop(0, `rgba(${55 + d},${55 + d},${58 + d},0.55)`);
    g.addColorStop(1, `rgba(${55 + d},${55 + d},${58 + d},0.0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Aggregate speckles (tiny stones)
  ctx.globalAlpha = 0.20;
  for (let i = 0; i < 26000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const s = Math.random() < 0.85 ? 1 : 2;
    const v = 35 + Math.random() * 55; // gray range
    ctx.fillStyle = `rgba(${v},${v},${v + 3},0.35)`;
    ctx.fillRect(x, y, s, s);
  }
  // darker pits
  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const s = 1;
    const v = 18 + Math.random() * 20;
    ctx.fillStyle = `rgba(${v},${v},${v},0.30)`;
    ctx.fillRect(x, y, s, s);
  }
  ctx.globalAlpha = 1.0;

  // Tire streaks along traffic direction (Z axis => texture Y axis)
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * size;
    const w = 1 + Math.random() * 2.5;
    const drift = (Math.random() - 0.5) * 25;
    ctx.strokeStyle = "rgba(110,110,115,0.18)";
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(
      x + drift, size * 0.33,
      x - drift, size * 0.66,
      x + (Math.random() - 0.5) * 15, size
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;


  // Road lane markings (horizontal lines in world space)
  // U (x in texture) maps to X (width) in world space
  // V (y in texture) maps to Z (depth) in world space
  
  const lineWidth = Math.max(6, Math.floor(size * 0.016)); // ~1.6% of texture width
  
  // WHITE EDGE LINES (solid, on left and right edges)
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(245,245,245,0.9)";
  
  // Left edge line (at x = ~8% from left)
  const leftEdge = Math.floor(size * 0.08);
  ctx.fillRect(leftEdge, 0, lineWidth, size);
  
  // Right edge line (at x = ~92% from left)
  const rightEdge = Math.floor(size * 0.92);
  ctx.fillRect(rightEdge, 0, lineWidth, size);
  
  // YELLOW CENTER LINE (dashed)
  ctx.fillStyle = "rgba(255,220,60,0.95)";
  const centerX = Math.floor(size * 0.5) - Math.floor(lineWidth / 2);
  const dashLength = Math.floor(size * 0.08); // length of each dash
  const gapLength = Math.floor(size * 0.06);  // gap between dashes
  
  // Draw dashed center line
  let currentY = 0;
  while (currentY < size) {
    ctx.fillRect(centerX, currentY, lineWidth, dashLength);
    currentY += dashLength + gapLength;
  }
  
  // Add slight wear/aging to all lines
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "rgba(70,70,75,0.3)";
  for (let i = 0; i < 200; i++) {
    // Random wear spots on lines
    const linePos = Math.random();
    let x;
    if (linePos < 0.33) x = leftEdge + Math.random() * lineWidth;
    else if (linePos < 0.66) x = centerX + Math.random() * lineWidth;
    else x = rightEdge + Math.random() * lineWidth;
    
    const y = Math.random() * size;
    const w = 2 + Math.random() * 8;
    const h = 1 + Math.random() * 4;
    ctx.fillRect(x, y, w, h);
  }
  ctx.globalAlpha = 1.0;
  const tex = new T.CanvasTexture(c);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  // Road top face is 1×17; we want many repeats along Z (V)
  tex.repeat.set(1, 7);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  setSRGB(tex);
  return tex;
}

// Bump map: more contrast, plus thin cracks
function makeAsphaltBump(size = 768) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  // Base mid-gray
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.fillRect(0, 0, size, size);

  // Noise
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    // layered noise
    const n = (Math.random() - 0.5) * 26 + (Math.random() - 0.5) * 12;
    const v = clamp255(128 + n);
    img.data[i + 0] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  // Cracks (dark thin lines)
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = "rgba(70,70,70,0.45)";
  for (let i = 0; i < 65; i++) {
    const x0 = Math.random() * size;
    const y0 = Math.random() * size;
    ctx.lineWidth = 0.6 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    let x = x0, y = y0;
    for (let k = 0; k < 10; k++) {
      x += (Math.random() - 0.5) * 90;
      y += (Math.random() - 0.5) * 90;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  const tex = new T.CanvasTexture(c);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(1, 7);
  tex.needsUpdate = true;
  return tex; // bump maps should stay linear
}

export class roadRow extends GrObject {
  static _assets = null;

  static assets() {
    if (roadRow._assets) return roadRow._assets;
    const asphaltMap = makeAsphaltMap(768);
    const asphaltBump = makeAsphaltBump(768);
    roadRow._assets = { asphaltMap, asphaltBump };
    return roadRow._assets;
  }

  constructor(x, direction) {
    let geometry = new T.BoxGeometry(1, 0.2, 17);

    // PROTOTYPE (unchanged, your original gray) :contentReference[oaicite:1]{index=1}
    const protoMat = new T.MeshStandardMaterial({ color: 0x544f4f });

    // NORMAL: realistic asphalt
    const { asphaltMap, asphaltBump } = roadRow.assets();
    const roadMat = new T.MeshStandardMaterial({
      map: asphaltMap,
      bumpMap: asphaltBump,
      bumpScale: 0.06,
      roughness: 0.95,
      metalness: 0.02,
      color: 0xffffff, // keep texture colors true
    });

    let mesh = new T.Mesh(geometry, roadMat);
    mesh.position.set(x, -0.1, 0);

    super("roadRow", mesh);

    this.x = x;
    this.direction = direction;
    this.cars = [];
    this.carDelay = Math.random() * 50;
    this.nextCar = Math.floor(Math.random() * 2);

    // Keep your proto/normal swap structure exactly :contentReference[oaicite:2]{index=2}
    this.protoGeo = new T.BoxGeometry(1, 0.2, 17);
    this.normalGeo = geometry;
    this.protoMat = protoMat;
    this.normalMat = roadMat;
  }

  rowType() {
    return "road";
  }

  stepWorld(delta, timeOfDay, frozen, char) {
    // unchanged X snapping :contentReference[oaicite:3]{index=3}
    if (this.objects[0].position.x < (this.x - 0.06)) {
      this.objects[0].position.x += 0.2;
    } else if (this.objects[0].position.x > (this.x + 0.06)) {
      this.objects[0].position.x -= 0.2;
    }

    // unchanged collision/removal logic :contentReference[oaicite:4]{index=4}
    this.cars.forEach((car) => {
      if (
        Math.abs(car.objects[0].position.z - char.objects[0].position.z) < 0.6 &&
        this.objects[0].position.x > -0.3 && this.objects[0].position.x < 0.3
      ) {
        char.freeze();
      }

      if (car.objects[0].position.z > 10 || car.objects[0].position.z < -10) {
        this.objects[0].remove(car.objects[0]);
      }
    });

    if (!frozen) {
      // unchanged car spawn logic :contentReference[oaicite:5]{index=5}
      if (this.carDelay <= 0) {
        if (this.nextCar === 0) {
          let car = new smallCar(this.direction);
          this.cars.push(car);
          this.objects[0].add(car.objects[0]);
        } else {
          let car = new largeCar(this.direction);
          this.cars.push(car);
          this.objects[0].add(car.objects[0]);
        }
        this.nextCar = Math.floor(Math.random() * 2);
        this.carDelay = 50 + Math.random() * 200;
      } else {
        this.carDelay -= 1;
      }

      this.cars.forEach((car) => {
        car.stepWorld(delta, timeOfDay, frozen);
      });

      // unchanged prototype swap behavior :contentReference[oaicite:6]{index=6}
      if (document.getElementById("prototype").checked) {
        this.objects[0].geometry = this.protoGeo;
        this.objects[0].material = this.protoMat;
      } else {
        this.objects[0].geometry = this.normalGeo;
        this.objects[0].material = this.normalMat;
      }
    }
  }
}