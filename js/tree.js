import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class Tree extends GrObject {
  constructor() {
    const group = new T.Group();

    // test
    // Load bark texture
    const barkTexture = new T.TextureLoader().load("../../ComppSci559GP-5678/textures/bark_downscale.jpg");
    barkTexture.wrapS = T.RepeatWrapping;
    barkTexture.wrapT = T.RepeatWrapping;
    barkTexture.repeat.set(1, 2);
    barkTexture.anisotropy = 8;

    const trunkMat = new T.MeshStandardMaterial({
      map: barkTexture
    });

    // Trunk 
    const trunk = new T.Mesh(
      new T.CylinderGeometry(0.10, 0.16, 2, 16),
      trunkMat
    );
    trunk.position.y = 1;
    group.add(trunk);

    // Load leaf texture
    const leafTexture = new T.TextureLoader().load("../../CompSci559GP-5678/textures/tree2_downscale.jpg");
    leafTexture.center.set(0.5, 0.5);
    leafTexture.flipY = false;
    leafTexture.anisotropy = 8;

    const leafMat = new T.MeshStandardMaterial({
      map: leafTexture,
      transparent: true,
      side: T.DoubleSide
    });

    // Dense leaves
    const leafCount = 22;
    for (let i = 0; i < leafCount; i++) {
      const radius = 0.35 + Math.random() * 0.15;
      const theta = Math.random() * Math.PI * 2;
      const y = 1.15 + Math.random() * 0.5;

      const leaf = new T.Mesh(
        new T.SphereGeometry(0.28 + Math.random() * 0.12, 16, 12),
        leafMat
      );

      leaf.position.set(
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius
      );

      group.add(leaf);
    }

    // Top crown
    const crown = new T.Mesh(
      new T.SphereGeometry(0.5, 20, 16),
      leafMat
    );
    crown.position.y = 1.6;
    group.add(crown);

    // Variation
    group.scale.setScalar(0.95 + Math.random() * 0.15);
    group.scale.setScalar(0.8);
    group.rotation.y = Math.random() * Math.PI * 2;

    super("Tree", group);
  }
}
