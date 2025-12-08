import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class smallCar extends GrObject {
    constructor(direction) {
        const group = new T.Group();

        const carMat = new T.MeshStandardMaterial({
        color: 0xe74c3c,
        roughness: 0.6,
        metalness: 0.0
        });

        const windowMat = new T.MeshStandardMaterial({
        color: 0x4fa3ff,   
        roughness: 0.4,
        metalness: 0.0
        });

        /* BODY */
        const body = new T.Mesh(
        new T.BoxGeometry(0.98, 0.28, 0.65),
        carMat
        );
        body.position.set(-0.07, 0.23, 0);
        group.add(body);

        /* FRONT HOOD */
        const hood = new T.Mesh(
        new T.BoxGeometry(0.4, 0.25, 0.64),
        carMat
        );
        hood.rotation.z = -Math.PI / 30;
        hood.position.set(0.5, 0.22, 0);
        group.add(hood);

        /* REAR TRUNK */
        const trunk = new T.Mesh(
        new T.BoxGeometry(0.25, 0.25, 0.64),
        carMat
        );
        trunk.rotation.z = Math.PI / 40;
        trunk.position.set(-0.65, 0.23, 0);
        group.add(trunk);

        /* CABIN */
        const cabin = new T.Mesh(
        new T.BoxGeometry(0.4, 0.23, 0.6),
        carMat
        );
        cabin.position.set(-0.1, 0.44, 0);
        group.add(cabin);

        /* FRONT WINDSHIELD */
        const frontWindshield = new T.Mesh(
        new T.BoxGeometry(0.4, 0.16, 0.598),
        windowMat
        );
        frontWindshield.rotation.z = -Math.PI / 6;
        frontWindshield.position.set(0.2, 0.385, 0);
        group.add(frontWindshield);

        /* REAR WINDSHIELD */
        const rearWindshield = new T.Mesh(
        new T.BoxGeometry(0.3, 0.16, 0.598),
        windowMat
        );
        rearWindshield.rotation.z = Math.PI / 5;
        rearWindshield.position.set(-0.35, 0.4, 0);
        group.add(rearWindshield);

        /* SIDE WINDOWS */
        const leftWindow = new T.Mesh(
        new T.BoxGeometry(0.41, 0.15, 0.01),
        windowMat
        );
        leftWindow.position.set(-0.1, 0.45, 0.30);
        group.add(leftWindow);

        const rightWindow = leftWindow.clone();
        rightWindow.position.z = -0.31;
        group.add(rightWindow);

        /* WHEELS */
        const wheelMat = new T.MeshStandardMaterial({ color: 0x222222 });
        const hubMat = new T.MeshStandardMaterial({ color: 0xaaaaaa });

        const wheelGeom = new T.CylinderGeometry(0.13, 0.13, 0.1, 16);
        wheelGeom.rotateX(Math.PI / 2);

        const hubGeom = new T.CylinderGeometry(0.08, 0.08, 0.11, 12);
        hubGeom.rotateX(Math.PI / 2);

        const wheelPositions = [
        [ 0.5, 0.14,  0.3],
        [-0.5, 0.14,  0.3],
        [ 0.5, 0.14, -0.3],
        [-0.5, 0.14, -0.3]
        ];

        wheelPositions.forEach(p => {
        const wheel = new T.Mesh(wheelGeom, wheelMat);
        const hub = new T.Mesh(hubGeom, hubMat);
        wheel.position.set(...p);
        hub.position.set(...p);
        group.add(wheel, hub);
        });

        /* HEADLIGHTS */
        const headlightMat = new T.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 0.4
        });

        const lightGeom = new T.BoxGeometry(0.08, 0.08, 0.08);

        const hl1 = new T.Mesh(lightGeom, headlightMat);
        hl1.position.set(0.68, 0.25, 0.25);
        const hl2 = hl1.clone();
        hl2.position.z = -0.25;
        group.add(hl1, hl2);

        /* TAILLIGHTS */
        const tailMat = new T.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
        });

        const tl1 = new T.Mesh(lightGeom, tailMat);
        tl1.position.set(-0.75, 0.25, 0.25);
        const tl2 = tl1.clone();
        tl2.position.z = -0.25;
        group.add(tl1, tl2);

        const bumperMat = new T.MeshStandardMaterial({ color: 0x444444 });

        const frontBumper = new T.Mesh(
        new T.BoxGeometry(0.01, 0.05, 0.62),
        bumperMat
        );
        frontBumper.position.set(0.7, 0.15, 0);
        group.add(frontBumper);

        const rearBumper = new T.Mesh(
        new T.BoxGeometry(0.01, 0.08, 0.62),
        bumperMat
        );
        rearBumper.position.set(-0.77, 0.15, 0);
        group.add(rearBumper);

        group.scale.setScalar(5);

        super("Car", group);

        this.direction = direction;

        /*this.protoGeo = new T.BoxGeometry(0.8, 0.8, 0.8);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x183b10 });
        this.normalMat = material;*/
    }

    stepWorld(delta, timeOfDay, frozen) {
        if (!frozen) {
            if (this.direction === 0) {
                this.objects[0].position.z += 0.03;
            } else {
                this.objects[0].position.z -= 0.03;
            }

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