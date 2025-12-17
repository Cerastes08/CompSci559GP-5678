import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";



export class trainWarning extends GrObject {
    constructor() {
        const texLoader = new T.TextureLoader();
        //const signTex = texLoader.load("../textures/rrsign.jpg");
        const signTex = texLoader.load("../../CompSci559GP-5678/textures/rrsign.jpg");
        signTex.colorSpace = T.SRGBColorSpace;
        signTex.anisotropy = 16;
        const group = new T.Group();
        group.rotateY(Math.PI / 2);
        group.position.set(-0.4, 0.1, -2.75);

        /* MATERIALS */
        const poleMat = new T.MeshStandardMaterial({ color: 0xaaaaaa });
        const signMat = new T.MeshStandardMaterial({
            map: signTex,
            color: 0xffffff,
            side: T.DoubleSide,
            roughness: 0.6,
            metalness: 0.0
        });

        const lightOnMat = new T.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.6
        });

        const lightOffMat = new T.MeshStandardMaterial({
        color: 0x550000
        });

        /* POLE */
        const pole = new T.Mesh(
        new T.CylinderGeometry(0.05, 0.05, 3.0, 15),
        poleMat
        );
        pole.position.y = 1.5;
        group.add(pole);

        /* CROSS */
        const signGeom = new T.BoxGeometry(1.2, 0.2, 0.05);

        const sign1 = new T.Mesh(signGeom, signMat);
        sign1.rotation.z = Math.PI / 4;
        sign1.position.y = 1.6;

        const sign2 = sign1.clone();
        sign2.rotation.z = -Math.PI / 4;
        sign1.position.set(0, 2.5, 0.05);
        sign2.position.set(0, 2.5, 0.05);


        group.add(sign1, sign2);

        /* SIGNAL ARM */
        const armMat = new T.MeshStandardMaterial({ color: 0x444444 });

        // Main horizontal arm
        const arm = new T.Mesh(
        new T.BoxGeometry(0.8, 0.05, 0.05),
        armMat
        );
        arm.position.set(0, 1.75, 0);
        group.add(arm);

        // Small vertical connectors to lights 
        const dropGeom = new T.BoxGeometry(0.05, 0.2, 0.05);

        const leftDrop = new T.Mesh(dropGeom, armMat);
        leftDrop.position.set(0.3, 1.65, 0);
        group.add(leftDrop);

        const rightDrop = leftDrop.clone();
        rightDrop.position.x = -0.3;
        group.add(rightDrop);

        /* CYLINDER SIGNAL LIGHTS */
        const lightGeom = new T.CylinderGeometry(0.12, 0.12, 0.08, 16);
        lightGeom.rotateX(Math.PI / 2); // face outward

        const leftLight = new T.Mesh(lightGeom, lightOnMat);
        leftLight.position.set(0.3, 1.75, 0.1);

        const rightLight = new T.Mesh(lightGeom, lightOffMat);
        rightLight.position.set(-0.3, 1.75, 0.1);

        group.add(leftLight, rightLight);

        /* LIGHT HOUSINGS */
        const housingGeom = new T.CylinderGeometry(0.14, 0.14, 0.1, 16);
        housingGeom.rotateX(Math.PI / 2);
        const housingMat = new T.MeshStandardMaterial({ color: 0x222222 });

        const h1 = new T.Mesh(housingGeom, housingMat);
        h1.position.copy(leftLight.position);
        h1.position.z -= 0.05;

        const h2 = h1.clone();
        h2.position.copy(rightLight.position);
        h2.position.z -= 0.05;

        group.add(h1, h2);

        /* BASE */
        const base = new T.Mesh(
        new T.CylinderGeometry(0.18, 0.18, 0.4, 12),
        poleMat
        );
        base.position.y = -0.2;
        group.scale.setScalar(0.5);
        group.add(base);
        
        super("RailroadSignal", group);

        this.signTex = signTex;
        this.signMat = signMat;
        this.leftLight = leftLight;
        this.rightLight = rightLight;
        this.lightOnMat = lightOnMat;
        this.lightOffMat = lightOffMat;

    }

    activate() {
        this.leftLight.material = this.lightOnMat;
        this.rightLight.material = this.lightOnMat;
    }

    deactivate() {
        this.leftLight.material = this.lightOffMat;
        this.rightLight.material = this.lightOffMat;
    }

    stepWorld(delta, timeOfDay, frozen) {
        const protoBox = document.getElementById("prototype");
        const proto = protoBox && protoBox.checked;

        if (proto) {
            this.signMat.map = null;
        } else {
            this.signMat.map = this.signTex;
        }

        this.signMat.needsUpdate = true;

    }
}