import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

function setSRGB(tex) {
  // Works across Three versions
  if ("colorSpace" in tex) tex.colorSpace = T.SRGBColorSpace;
  else if ("encoding" in tex) tex.encoding = T.sRGBEncoding;
}

function makeNoise2D(w, h, seed = 12345) {
  // simple deterministic-ish noise (LCG)
  let s = seed >>> 0;
  function rnd() {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  }
  const a = new Float32Array(w * h);
  for (let i = 0; i < a.length; i++) a[i] = rnd();
  return a;
}

function makeCanvasTexture({
  size = 512,
  base = [60, 130, 60],
  variation = 35,
  speckCount = 12000,
  speckAlpha = 0.08,
  streaks = true,
  seed = 12345,
}) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  // base fill
  ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
  ctx.fillRect(0, 0, size, size);

  // multi-scale noise blotches
  const n = makeNoise2D(size, size, seed);
  const img = ctx.getImageData(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x);
      const v = n[i];

      // add low-frequency variation (fake by smoothing with neighbors)
      const v2 =
        0.6 * v +
        0.1 * n[(i + 1) % n.length] +
        0.1 * n[(i + size) % n.length] +
        0.1 * n[(i + 7) % n.length] +
        0.1 * n[(i + 13) % n.length];

      const dv = (v2 - 0.5) * 2.0 * variation;

      const p = i * 4;
      img.data[p + 0] = Math.max(0, Math.min(255, img.data[p + 0] + dv));
      img.data[p + 1] = Math.max(0, Math.min(255, img.data[p + 1] + dv));
      img.data[p + 2] = Math.max(0, Math.min(255, img.data[p + 2] + dv));
      img.data[p + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // speckles (leaf litter / dirt / highlights)
  ctx.globalAlpha = speckAlpha;
  for (let i = 0; i < speckCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.5 + Math.random() * 1.5;
    const g = 0.5 + Math.random() * 1.5;

    const colShift = (Math.random() - 0.5) * 30;
    ctx.fillStyle = `rgb(${base[0] + colShift},${base[1] + colShift},${base[2] + colShift})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, g, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // streaks (suggest grass blades / directional mowing)
  if (streaks) {
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 260; i++) {
      const y = (i / 260) * size;
      const w = 0.5 + Math.random() * 1.8;
      const shift = (Math.random() - 0.5) * 20;
      ctx.strokeStyle = `rgb(${base[0] + shift},${base[1] + shift},${base[2] + shift})`;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(size * 0.3, y + (Math.random() - 0.5) * 18,
                        size * 0.7, y + (Math.random() - 0.5) * 18,
                        size, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  const tex = new T.CanvasTexture(c);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(1, 6); // default tiling; rows are long in Z visually
  tex.needsUpdate = true;
  setSRGB(tex);
  return tex;
}

function makeBumpTexture({ size = 512, seed = 999, contrast = 1.2 }) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  const n = makeNoise2D(size, size, seed);
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      // blend a couple offsets to fake “fractal” detail
      const v =
        0.55 * n[i] +
        0.20 * n[(i + 17) % n.length] +
        0.15 * n[(i + size * 13) % n.length] +
        0.10 * n[(i + 101) % n.length];

      // contrast
      let g = (v - 0.5) * contrast + 0.5;
      g = Math.max(0, Math.min(1, g));
      const b = Math.floor(g * 255);

      const p = i * 4;
      img.data[p + 0] = b;
      img.data[p + 1] = b;
      img.data[p + 2] = b;
      img.data[p + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new T.CanvasTexture(c);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(1, 6);
  tex.needsUpdate = true;
  return tex;
}

export class grassRow extends GrObject {
  static _assets = null;

  static assets() {
    if (grassRow._assets) return grassRow._assets;

    // Procedural textures: grass (center) + forest floor (side bands) + dirt (edges/sides)
    const grassMap = makeCanvasTexture({
      base: [55, 140, 55],
      variation: 38,
      speckCount: 9000,
      speckAlpha: 0.06,
      streaks: true,
      seed: 123,
    });
    const grassBump = makeBumpTexture({ seed: 321, contrast: 1.35 });

    const forestMap = makeCanvasTexture({
      base: [40, 85, 40],
      variation: 45,
      speckCount: 15000,
      speckAlpha: 0.11,
      streaks: false,
      seed: 456,
    });
    forestMap.repeat.set(1, 4);
    const forestBump = makeBumpTexture({ seed: 654, contrast: 1.5 });
    forestBump.repeat.set(1, 4);

    const dirtMap = makeCanvasTexture({
      base: [100, 75, 45],
      variation: 55,
      speckCount: 18000,
      speckAlpha: 0.12,
      streaks: false,
      seed: 789,
    });
    dirtMap.repeat.set(1, 8);
    const dirtBump = makeBumpTexture({ seed: 987, contrast: 1.6 });
    dirtBump.repeat.set(1, 8);

    grassRow._assets = { grassMap, grassBump, forestMap, forestBump, dirtMap, dirtBump };
    return grassRow._assets;
  }

  constructor(x) {
    // --- dimensions: keep your exact gameplay widths ---
    const THICK = 0.2;
    const PLAY_Z = 9;
    const BAND_Z = 4;
    const bandCenter = 6.5; // matches your original placement
    const edgeZ = PLAY_Z / 2; // 4.5

    // --- normal (realistic) materials ---
    const { grassMap, grassBump, forestMap, forestBump, dirtMap, dirtBump } = grassRow.assets();

    const grassMatReal = new T.MeshStandardMaterial({
      map: grassMap,
      bumpMap: grassBump,
      bumpScale: 0.06,
      roughness: 1.0,
      metalness: 0.0,
    });

    const forestMatReal = new T.MeshStandardMaterial({
      map: forestMap,
      bumpMap: forestBump,
      bumpScale: 0.08,
      roughness: 1.0,
      metalness: 0.0,
    });

    const dirtMatReal = new T.MeshStandardMaterial({
      map: dirtMap,
      bumpMap: dirtBump,
      bumpScale: 0.05,
      roughness: 1.0,
      metalness: 0.0,
    });

    // --- prototype (flat) materials ---
    const grassMatProto = new T.MeshStandardMaterial({ color: 0x00ff00 });
    const forestMatProto = new T.MeshStandardMaterial({ color: 0x214217 });
    const dirtMatProto = new T.MeshStandardMaterial({ color: 0x6b4f2a });

    // --- base playable strip ---
    const playGeo = new T.BoxGeometry(1, THICK, PLAY_Z);
    const playMesh = new T.Mesh(playGeo, grassMatReal);
    playMesh.position.set(x, -0.1, 0);

    // --- side forest bands ---
    const bandGeo = new T.BoxGeometry(1, THICK, BAND_Z);
    const bandPos = new T.Mesh(bandGeo, forestMatReal);
    const bandNeg = new T.Mesh(bandGeo, forestMatReal);
    bandPos.position.set(0, 0, +bandCenter);
    bandNeg.position.set(0, 0, -bandCenter);
    playMesh.add(bandPos);
    playMesh.add(bandNeg);

    // --- dirt edge strips (visual boundary between playable grass & forest band) ---
    const edgeGeo = new T.BoxGeometry(1, THICK + 0.001, 0.24);
    const edgePos = new T.Mesh(edgeGeo, dirtMatReal);
    const edgeNeg = new T.Mesh(edgeGeo, dirtMatReal);
    edgePos.position.set(0, 0.001, +edgeZ);
    edgeNeg.position.set(0, 0.001, -edgeZ);
    playMesh.add(edgePos);
    playMesh.add(edgeNeg);

    // --- Decorative set dressing (trees/bushes/rocks/logs) on side bands only ---
    const decor = new T.Group();
    decor.position.set(0, 0, 0);
    playMesh.add(decor);

    // Tree models using instancing (fast, looks much richer than 2-3 meshes)
    const trunkGeo = new T.CylinderGeometry(0.045, 0.07, 0.60, 10);
    const crownGeo = new T.ConeGeometry(0.30, 0.85, 10);
    const bushGeo = new T.DodecahedronGeometry(0.12, 0);
    const rockGeo = new T.DodecahedronGeometry(0.09, 0);

    const trunkMatReal = new T.MeshStandardMaterial({ color: 0x6a4a2f, roughness: 1.0 });
    const crownMatReal = new T.MeshStandardMaterial({ color: 0x1f6b2b, roughness: 1.0 });
    const bushMatReal = new T.MeshStandardMaterial({ color: 0x2a7a33, roughness: 1.0 });
    const rockMatReal = new T.MeshStandardMaterial({ color: 0x7b7b7b, roughness: 1.0 });

    const trunkMatProto = new T.MeshStandardMaterial({ color: 0x6a4a2f });
    const crownMatProto = new T.MeshStandardMaterial({ color: 0x1f6b2b });
    const bushMatProto = new T.MeshStandardMaterial({ color: 0x2a7a33 });
    const rockMatProto = new T.MeshStandardMaterial({ color: 0x7b7b7b });

    // counts tuned to look “busy” but not insane
    const treesPerSide = 7;
    const bushesPerSide = 10;
    const rocksPerSide = 10;

    const treeCount = treesPerSide * 2;
    const bushCount = bushesPerSide * 2;
    const rockCount = rocksPerSide * 2;

    const trunks = new T.InstancedMesh(trunkGeo, trunkMatReal, treeCount);
    const crowns = new T.InstancedMesh(crownGeo, crownMatReal, treeCount);
    const bushes = new T.InstancedMesh(bushGeo, bushMatReal, bushCount);
    const rocks = new T.InstancedMesh(rockGeo, rockMatReal, rockCount);

    // tiny shadow bias helper: lift a hair to avoid z-fighting
    trunks.position.y = 0.0005;
    crowns.position.y = 0.0005;
    bushes.position.y = 0.0005;
    rocks.position.y = 0.0005;

    const tmp = new T.Object3D();

    const topY = 0.1; // top surface of the base (local) since box is centered, and base y is -0.1
    const placeOnBand = (sideSign, idxBase) => {
      // sideSign: +1 for +Z band, -1 for -Z band
      // Keep everything within the band width, and away from playable area
      const zCenter = sideSign * bandCenter;

      // Spread along the band in Z a bit, not all at the same line:
      // band spans [zCenter-2 .. zCenter+2]
      const z = zCenter + (Math.random() - 0.5) * 3.2;

      // Jitter in X but stay within row width
      const xj = (Math.random() - 0.5) * 0.35;

      return { xj, z, idx: idxBase };
    };

    // Trees
    for (let i = 0; i < treesPerSide; i++) {
      const a = placeOnBand(+1, i);
      const b = placeOnBand(-1, i + treesPerSide);

      for (const p of [a, b]) {
        const s = 0.85 + Math.random() * 0.45;
        const rot = (Math.random() - 0.5) * 0.6;

        // trunk
        tmp.position.set(p.xj, topY + 0.30 * s, p.z);
        tmp.rotation.set(0, rot, 0);
        tmp.scale.set(s, s, s);
        tmp.updateMatrix();
        trunks.setMatrixAt(p.idx, tmp.matrix);

        // crown (offset upward)
        tmp.position.set(p.xj, topY + 0.30 * s + 0.68 * s, p.z);
        tmp.rotation.set(0, rot, 0);
        tmp.scale.set(1.0 * s, 1.0 * s, 1.0 * s);
        tmp.updateMatrix();
        crowns.setMatrixAt(p.idx, tmp.matrix);
      }
    }

    // Bushes (more random scatter)
    for (let i = 0; i < bushesPerSide; i++) {
      const a = placeOnBand(+1, i);
      const b = placeOnBand(-1, i + bushesPerSide);

      for (const p of [a, b]) {
        const s = 0.7 + Math.random() * 0.9;
        tmp.position.set(p.xj + (Math.random() - 0.5) * 0.18, topY + 0.10 * s, p.z);
        tmp.rotation.set(0, Math.random() * Math.PI * 2, 0);
        tmp.scale.set(s, s, s);
        tmp.updateMatrix();
        bushes.setMatrixAt(p.idx, tmp.matrix);
      }
    }

    // Rocks (some near the dirt edges)
    for (let i = 0; i < rocksPerSide; i++) {
      const sideSign = i % 2 === 0 ? +1 : -1;
      const idx = i * 2;
      const zCenter = sideSign * bandCenter;

      for (let k = 0; k < 2; k++) {
        const id = idx + k;
        const z = zCenter + (Math.random() - 0.5) * 3.4;
        const xj = (Math.random() - 0.5) * 0.38;
        const s = 0.55 + Math.random() * 0.8;
        tmp.position.set(xj, topY + 0.05 * s, z);
        tmp.rotation.set(Math.random() * 0.6, Math.random() * Math.PI * 2, Math.random() * 0.6);
        tmp.scale.set(s, s * (0.7 + Math.random() * 0.5), s);
        tmp.updateMatrix();
        rocks.setMatrixAt(id, tmp.matrix);
      }
    }

    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;
    bushes.instanceMatrix.needsUpdate = true;
    rocks.instanceMatrix.needsUpdate = true;

    decor.add(trunks);
    decor.add(crowns);
    decor.add(bushes);
    decor.add(rocks);

    // a couple of fallen logs for “storybook realism”
    const logGeo = new T.CylinderGeometry(0.06, 0.06, 0.55, 10);
    const logMatReal = new T.MeshStandardMaterial({ color: 0x5a4026, roughness: 1.0 });
    const logMatProto = new T.MeshStandardMaterial({ color: 0x5a4026 });

    const log1 = new T.Mesh(logGeo, logMatReal);
    log1.rotation.z = Math.PI / 2;
    log1.rotation.y = 0.4;
    log1.position.set(0.15, topY + 0.06, +bandCenter - 0.9);

    const log2 = new T.Mesh(logGeo, logMatReal);
    log2.rotation.z = Math.PI / 2;
    log2.rotation.y = -0.6;
    log2.position.set(-0.12, topY + 0.06, -bandCenter + 1.0);

    decor.add(log1);
    decor.add(log2);

    // --- Playable area decorations (pebbles, flowers) ---
    const pebbleGeo = new T.SphereGeometry(0.025, 8, 8);
    
    // Realistic flower components
    const petalGeo = new T.SphereGeometry(0.025, 8, 8); // individual petal
    const centerGeo = new T.SphereGeometry(0.015, 8, 8); // flower center
    const stemGeo = new T.CylinderGeometry(0.003, 0.005, 0.12, 6);
    const leafGeo = new T.SphereGeometry(0.02, 6, 6); // leaf

    const pebbleMat = new T.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
    
    // Flower materials with more natural colors
    const yellowPetalMat = new T.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.4 });
    const yellowCenterMat = new T.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
    
    const redPetalMat = new T.MeshStandardMaterial({ color: 0xe53935, roughness: 0.4 });
    const redCenterMat = new T.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.6 });
    
    const bluePetalMat = new T.MeshStandardMaterial({ color: 0x5c6bc0, roughness: 0.4 });
    const blueCenterMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    
    const stemMat = new T.MeshStandardMaterial({ color: 0x558b2f, roughness: 0.9 });
    const leafMat = new T.MeshStandardMaterial({ color: 0x66bb6a, roughness: 0.8 });

    const pebbleCount = 5;
    const flowersPerColor = 1;
    const petalsPerFlower = 6; // 6 petals arranged in circle

    const pebbles = new T.InstancedMesh(pebbleGeo, pebbleMat, pebbleCount);
    
    // Each flower color needs: petals, centers, stems, leaves
    const yellowPetals = new T.InstancedMesh(petalGeo, yellowPetalMat, flowersPerColor * petalsPerFlower);
    const yellowCenters = new T.InstancedMesh(centerGeo, yellowCenterMat, flowersPerColor);
    
    const redPetals = new T.InstancedMesh(petalGeo, redPetalMat, flowersPerColor * petalsPerFlower);
    const redCenters = new T.InstancedMesh(centerGeo, redCenterMat, flowersPerColor);
    
    const bluePetals = new T.InstancedMesh(petalGeo, bluePetalMat, flowersPerColor * petalsPerFlower);
    const blueCenters = new T.InstancedMesh(centerGeo, blueCenterMat, flowersPerColor);
    
    const flowerStems = new T.InstancedMesh(stemGeo, stemMat, flowersPerColor * 3);
    const flowerLeaves = new T.InstancedMesh(leafGeo, leafMat, flowersPerColor * 3 * 2); // 2 leaves per flower

    pebbles.position.y = 0.0005;
    yellowPetals.position.y = 0.0005;
    yellowCenters.position.y = 0.0005;
    redPetals.position.y = 0.0005;
    redCenters.position.y = 0.0005;
    bluePetals.position.y = 0.0005;
    blueCenters.position.y = 0.0005;
    flowerStems.position.y = 0.0005;
    flowerLeaves.position.y = 0.0005;

    // Helper to get well-spaced random positions
    const usedPositions = [];
    const minDistance = 1.5; // minimum distance between decorations
    
    const getPosition = () => {
      let attempts = 0;
      while (attempts < 50) {
        const pos = {
          x: (Math.random() - 0.5) * 0.85,
          z: (Math.random() - 0.5) * 8.5
        };
        
        // Check if this position is far enough from all used positions
        let tooClose = false;
        for (const used of usedPositions) {
          const dx = pos.x - used.x;
          const dz = pos.z - used.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < minDistance) {
            tooClose = true;
            break;
          }
        }
        
        if (!tooClose) {
          usedPositions.push(pos);
          return pos;
        }
        attempts++;
      }
      
      // If we can't find a good spot after 50 tries, just return a random one
      const pos = {
        x: (Math.random() - 0.5) * 0.85,
        z: (Math.random() - 0.5) * 8.5
      };
      usedPositions.push(pos);
      return pos;
    };

    // Place pebbles (2x bigger)
    for (let i = 0; i < pebbleCount; i++) {
      const pos = getPosition();
      const s = (0.6 + Math.random() * 0.8) * 2.0; // 2x size
      tmp.position.set(pos.x, topY + 0.02 * s, pos.z);
      tmp.rotation.set(Math.random() * 0.3, Math.random() * Math.PI * 2, Math.random() * 0.3);
      tmp.scale.set(s, s * (0.6 + Math.random() * 0.4), s);
      tmp.updateMatrix();
      pebbles.setMatrixAt(i, tmp.matrix);
    }

    // Place flowers (2x bigger) - now with realistic petal arrangement
    const petalMeshes = [yellowPetals, redPetals, bluePetals];
    const centerMeshes = [yellowCenters, redCenters, blueCenters];
    
    for (let color = 0; color < 3; color++) {
      for (let i = 0; i < flowersPerColor; i++) {
        const pos = getPosition();
        const s = (0.7 + Math.random() * 0.6) * 2.0; // 2x size
        const flowerIdx = color * flowersPerColor + i;
        const flowerRotation = Math.random() * Math.PI * 2;
        
        // Stem
        tmp.position.set(pos.x, topY + 0.06 * s, pos.z);
        tmp.rotation.set(0, 0, 0);
        tmp.scale.set(s, s, s);
        tmp.updateMatrix();
        flowerStems.setMatrixAt(flowerIdx, tmp.matrix);
        
        // Leaves (2 leaves at different heights on stem)
        const leafIdx = flowerIdx * 2;
        for (let l = 0; l < 2; l++) {
          const leafHeight = 0.04 * s + l * 0.03 * s;
          const leafAngle = (l * Math.PI) + flowerRotation;
          const leafOffset = 0.015 * s;
          tmp.position.set(
            pos.x + Math.cos(leafAngle) * leafOffset, 
            topY + leafHeight, 
            pos.z + Math.sin(leafAngle) * leafOffset
          );
          tmp.rotation.set(Math.PI / 2, leafAngle, 0);
          tmp.scale.set(s * 0.8, s * 0.3, s * 0.8);
          tmp.updateMatrix();
          flowerLeaves.setMatrixAt(leafIdx + l, tmp.matrix);
        }
        
        // Flower center
        const flowerHeight = topY + 0.12 * s + 0.01;
        tmp.position.set(pos.x, flowerHeight, pos.z);
        tmp.rotation.set(0, 0, 0);
        tmp.scale.set(s, s * 0.5, s);
        tmp.updateMatrix();
        centerMeshes[color].setMatrixAt(i, tmp.matrix);
        
        // Petals arranged in a circle around center
        const petalStartIdx = i * petalsPerFlower;
        for (let p = 0; p < petalsPerFlower; p++) {
          const angle = (p / petalsPerFlower) * Math.PI * 2;
          const petalDist = 0.035 * s;
          const petalX = pos.x + Math.cos(angle) * petalDist;
          const petalZ = pos.z + Math.sin(angle) * petalDist;
          
          tmp.position.set(petalX, flowerHeight, petalZ);
          tmp.rotation.set(0, angle, Math.PI / 3); // tilt petals outward
          tmp.scale.set(s * 0.9, s * 0.5, s * 0.9);
          tmp.updateMatrix();
          petalMeshes[color].setMatrixAt(petalStartIdx + p, tmp.matrix);
        }
      }
    }

    pebbles.instanceMatrix.needsUpdate = true;
    flowerStems.instanceMatrix.needsUpdate = true;
    flowerLeaves.instanceMatrix.needsUpdate = true;
    yellowPetals.instanceMatrix.needsUpdate = true;
    yellowCenters.instanceMatrix.needsUpdate = true;
    redPetals.instanceMatrix.needsUpdate = true;
    redCenters.instanceMatrix.needsUpdate = true;
    bluePetals.instanceMatrix.needsUpdate = true;
    blueCenters.instanceMatrix.needsUpdate = true;

    decor.add(pebbles);
    decor.add(flowerStems);
    decor.add(flowerLeaves);
    decor.add(yellowPetals);
    decor.add(yellowCenters);
    decor.add(redPetals);
    decor.add(redCenters);
    decor.add(bluePetals);
    decor.add(blueCenters);

    // GrObject
    super("grassRow", playMesh);

    // movement target
    this.x = x;

    // store refs for prototype swap
    this._playMesh = playMesh;
    this._bands = [bandPos, bandNeg];
    this._edges = [edgePos, edgeNeg];
    this._decorGroup = decor;

    this._instanced = { trunks, crowns, bushes, rocks, log1, log2 };

    // “proto” assets
    this.protoGeo = new T.BoxGeometry(1, THICK, PLAY_Z);
    this.normalGeo = playGeo;

    this._mats = {
      real: { grass: grassMatReal, forest: forestMatReal, dirt: dirtMatReal, trunk: trunkMatReal, crown: crownMatReal, bush: bushMatReal, rock: rockMatReal, log: logMatReal },
      proto: { grass: grassMatProto, forest: forestMatProto, dirt: dirtMatProto, trunk: trunkMatProto, crown: crownMatProto, bush: bushMatProto, rock: rockMatProto, log: logMatProto },
    };
  }

  rowType() {
    return "grass";
  }

  stepWorld(delta, timeOfDay, frozen, char) {
    // keep your same snapping motion
    if (this.objects[0].position.x < (this.x - 0.06)) {
      this.objects[0].position.x += 0.2;
    } else if (this.objects[0].position.x > (this.x + 0.06)) {
      this.objects[0].position.x -= 0.2;
    }

    if (!frozen) {
      const proto = document.getElementById("prototype")?.checked;

      // Keep your geometry swap behavior for the main playable strip
      this._playMesh.geometry = proto ? this.protoGeo : this.normalGeo;

      const M = proto ? this._mats.proto : this._mats.real;

      // swap materials
      this._playMesh.material = M.grass;
      this._bands[0].material = M.forest;
      this._bands[1].material = M.forest;
      this._edges[0].material = M.dirt;
      this._edges[1].material = M.dirt;

      this._instanced.trunks.material = M.trunk;
      this._instanced.crowns.material = M.crown;
      this._instanced.bushes.material = M.bush;
      this._instanced.rocks.material = M.rock;
      this._instanced.log1.material = M.log;
      this._instanced.log2.material = M.log;
    }
  }
}