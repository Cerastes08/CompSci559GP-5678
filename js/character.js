import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class character extends GrObject {
    constructor() {
        const rabbit = new T.Group();
        rabbit.rotateY(Math.PI/2);
        const furText = new T.TextureLoader().load("../textures/beastfur.png");
        const whiteMat = new T.MeshStandardMaterial({
          map: furText,
        });
        const pinkMat = new T.MeshStandardMaterial({ color: "pink" });
        const eyeMat = new T.MeshStandardMaterial({ color: "black" });
        const whiskerMat = new T.MeshStandardMaterial({ color: "gray" });
        // ===== BODY  =====
        // Main body
        const bodyMain = new T.Mesh(
          new T.BoxGeometry(1, 0.65, 0.75),
          whiteMat
        );
        bodyMain.position.y = 0.45;
        bodyMain.position.z = 0.25;
        rabbit.add(bodyMain);
        // Rear body
        const bodyRear = new T.Mesh(
          new T.BoxGeometry(0.8, 0.6, 0.6),
          whiteMat
        );
        bodyRear.position.set(0, 0.45, -.25);
        rabbit.add(bodyRear);
        // ===== HEAD  =====
        const head = new T.Mesh(
          new T.BoxGeometry(0.6, 0.6, 0.6),
          whiteMat
        );
        head.position.set(0, 0.88, -0.6); 
        rabbit.add(head);
    
        // ===== EARS =====
        const earGeom = new T.BoxGeometry(0.15, 0.6, 0.15);
        const leftEar = new T.Mesh(earGeom, whiteMat);
        leftEar.position.set(-0.15, 1.38, -0.6);
        rabbit.add(leftEar);
        const rightEar = new T.Mesh(earGeom, whiteMat);
        rightEar.position.set(0.15, 1.38, -0.6);
        rabbit.add(rightEar);
        // ===== NOSE =====
        const nose = new T.Mesh(
          new T.BoxGeometry(0.1, 0.1, 0.1),
          pinkMat
        );
        nose.position.set(0, 0.85, -0.95);
        rabbit.add(nose);
        // ===== EYES =====
        const eyeGeom = new T.SphereGeometry(0.06, 12, 12);
        // ===== WHISKERS =====
        const whiskerGeom = new T.CylinderGeometry(0.01, 0.01, 0.35, 8);
        // Left whiskers
        for (let i = 0; i <= 1; i++) {
          const whisker = new T.Mesh(whiskerGeom, whiskerMat);
          whisker.rotation.z = Math.PI / 2;
          whisker.position.set(-0.25, 0.8 + i * 0.05, -0.91);
          rabbit.add(whisker);
        }
        // Right whiskers
        for (let i = 0; i <= 1; i++) {
          const whisker = new T.Mesh(whiskerGeom, whiskerMat);
          whisker.rotation.z = Math.PI / 2;
          whisker.position.set(0.25, 0.8 + i * 0.05, -0.91);
          rabbit.add(whisker);
        }
        // Left eye
        const leftEye = new T.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(-0.15, 0.95, -0.92);
        rabbit.add(leftEye);
        // Right eye
        const rightEye = new T.Mesh(eyeGeom, eyeMat);
        rightEye.position.set(0.15, 0.95, -0.92);
        rabbit.add(rightEye);
        // ===== TAIL =====
        const tail = new T.Mesh(
          new T.SphereGeometry(0.25, 16, 16),
          whiteMat
        );
        tail.position.set(0, 0.65, .8);
        rabbit.add(tail);
        // ===== LEGS =====
        const legGeom = new T.BoxGeometry(0.2, 0.3, 0.25);
        const legPositions = [
          [-0.35, 0.15,  0.4],
          [ 0.35, 0.15,  0.4],
          [-0.35, 0.15, -0.40],
          [ 0.35, 0.15, -0.40],
        ];
    
        legPositions.forEach(pos => {
          const leg = new T.Mesh(legGeom, whiteMat);
          leg.position.set(...pos);
          rabbit.add(leg);
        });
        // Lift entire rabbit
        rabbit.position.y = 0.15;
        rabbit.scale.setScalar(0.3);
        super("Player", rabbit);

        this.y = 0;
        this.z = 0;
        this.frozen = false;

        /*this.protoGeo = new T.BoxGeometry(0.8, 0.8, 0.8);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0xffffff });
        this.normalMat = material;*/
    }
    
    moved() {
        return this.y === this.objects[0].position.y && this.z === this.objects[0].position.z;
    }

    freeze() {
        this.frozen = true;
    }

    stepWorld(delta, timeOfDay) {
        if (this.objects[0].position.y < this.y) {
            this.objects[0].position.y += 0.1;
        } else if (this.objects[0].position.y > this.y) {
            this.objects[0].position.y = this.y;
        }

        if (this.objects[0].position.z < (this.z - 0.06)) {
            this.objects[0].position.z += 0.2;
        } else if (this.objects[0].position.z > (this.z + 0.06)) {
            this.objects[0].position.z -= 0.2;
        }

        if (!this.frozen) {
            /*if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }*/
        }
    }
}
