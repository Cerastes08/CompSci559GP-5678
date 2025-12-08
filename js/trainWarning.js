import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class trainWarning extends GrObject {
    constructor() {
        const group = new T.Group();

        /* MATERIALS */
        const poleMat = new T.MeshStandardMaterial({ color: 0xaaaaaa });
        const signMat = new T.MeshStandardMaterial({ color: 0xffffff });

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

        group.add(h1, h2);

        /* BASE */
        const base = new T.Mesh(
        new T.CylinderGeometry(0.18, 0.18, 0.1, 12),
        poleMat
        );
        base.position.y = 0.05;
        group.scale.setScalar(2);
        group.add(base);

        super("RailroadSignal", group);

        /*this.protoGeo = new T.CylinderGeometry(0.04, 0.04, 1, 32);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0xffffff });
        this.normalMat = material;*/
    }

    activate() {
        //this.objects[0].material.color.set(0xff0000);
    }

    deactivate() {
        //this.objects[0].material.color.set(0xffffff);
    }

    stepWorld(delta, timeOfDay, frozen) {
        if (!frozen) {
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