import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class largeCar extends GrObject {
    constructor(direction) {
        const group = new T.Group();
        if (direction === 0) {
            group.rotateY(-Math.PI / 2);
        } else {
            group.rotateY(Math.PI / 2);
        }

        /*  SHARED MATERIALS */
        const carMat = new T.MeshStandardMaterial({
        color: "white",
        roughness: 0.6,
        metalness: 0.0
        });

        const windowMat = new T.MeshStandardMaterial({
        color: 0x4fa3ff,
        roughness: 0.4,
        metalness: 0.0
        });

        /*  MAIN BODY */
        const body = new T.Mesh(
        new T.BoxGeometry(1.5, 0.35, 0.7),
        carMat
        );
        body.position.set(-0.1, 0.3, 0);
        group.add(body);

        /*  SHORT FRONT HOOD */
        const hood = new T.Mesh(
        new T.BoxGeometry(0.5, 0.4, 0.68),
        carMat
        );
        hood.rotation.z = -Math.PI / 36;
        hood.position.set(0.67, 0.3, 0);
        group.add(hood);

        /*  CABIN  */
        const cabin = new T.Mesh(
        new T.BoxGeometry(1.3, 0.5, 0.68),
        carMat
        );
        cabin.position.set(-0.2, 0.65, 0);
        group.add(cabin);

        /* FRONT WINDSHIELD */
        const frontWindshield = new T.Mesh(
        new T.BoxGeometry(0.32, 0.5, 0.65),
        windowMat
        );
        frontWindshield.position.set(0.55, 0.58, 0);
        group.add(frontWindshield);

        /* WINDSHIELD VISOR (slab above front window) */
        const visor = new T.Mesh(
        new T.BoxGeometry(0.36, 0.08, 0.66),
        carMat
        );

        visor.position.set(0.55, 0.84, 0);

        group.add(visor);



        /* LARGE SIDE WINDOWS */
        const leftWindow = new T.Mesh(
        new T.BoxGeometry(0.9, 0.3, 0.01),
        windowMat
        );
        leftWindow.position.set(-0.2, 0.68, 0.34);
        group.add(leftWindow);

        const rightWindow = leftWindow.clone();
        rightWindow.position.z = -0.34;
        group.add(rightWindow);

        /* REAR WINDOW */
        const rearWindow = new T.Mesh(
        new T.BoxGeometry(0.4, 0.3, 0.01),
        windowMat
        );
        rearWindow.position.set(-0.85, 0.72, 0);
        rearWindow.rotation.y = Math.PI / 2;
        group.add(rearWindow);

        /* WHEELS */
        const wheelMat = new T.MeshStandardMaterial({ color: 0x222222 });
        const hubMat = new T.MeshStandardMaterial({ color: 0xaaaaaa });

        const wheelGeom = new T.CylinderGeometry(0.18, 0.18, 0.12, 16);
        wheelGeom.rotateX(Math.PI / 2);

        const hubGeom = new T.CylinderGeometry(0.08, 0.08, 0.13, 12);
        hubGeom.rotateX(Math.PI / 2);

        const wheelPositions = [
        [ 0.6, 0.16,  0.35],
        [-0.6, 0.16,  0.35],
        [ 0.6, 0.16, -0.35],
        [-0.6, 0.16, -0.35]
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

        const lightGeom = new T.BoxGeometry(0.09, 0.09, 0.09);

        const hl1 = new T.Mesh(lightGeom, headlightMat);
        hl1.position.set(0.9, 0.32, 0.28);
        const hl2 = hl1.clone();
        hl2.position.z = -0.28;
        group.add(hl1, hl2);

        /* TAILLIGHTS */
        const tailMat = new T.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
        });

        const tl1 = new T.Mesh(lightGeom, tailMat);
        tl1.position.set(-.83, 0.35, 0.28);
        const tl2 = tl1.clone();
        tl2.position.z = -0.28;
        group.add(tl1, tl2);

        /* BUMPERS */
        const bumperMat = new T.MeshStandardMaterial({ color: 0x444444 });

        const frontBumper = new T.Mesh(
        new T.BoxGeometry(0.01, 0.07, 0.65),
        bumperMat
        );
        frontBumper.position.set(0.93, 0.18, 0);
        group.add(frontBumper);

        const rearBumper = new T.Mesh(
        new T.BoxGeometry(0.01, 0.1, 0.65),
        bumperMat
        );
        rearBumper.position.set(-.85, 0.18, 0);
        group.add(rearBumper);

        group.scale.setScalar(1);

        group.position.z = direction === 0 ? -6 : 6;
        group.position.y = 0.1;
        super("Van", group);


        this.direction = direction;

        /*this.protoGeo = new T.BoxGeometry(0.8, 0.8, 1.8);
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