import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class train extends GrObject {
    constructor() {
        const group = new T.Group();

        /* MATERIALS */
        const engineMat = new T.MeshStandardMaterial({
        color: 0x555555,
        roughness: 0.6,
        metalness: 0.1
        });

        const boxMat = new T.MeshStandardMaterial({
        color: 0x8b1e1e,
        roughness: 0.6,
        metalness: 0.0
        });

        const detailMat = new T.MeshStandardMaterial({
        color: 0x333333
        });

        const windowMat = new T.MeshStandardMaterial({
        color: 0x4fa3ff,
        roughness: 0.4,
        metalness: 0.0
        });

        /* ENGINE MAIN BODY */
        const engineBody = new T.Mesh(
        new T.CylinderGeometry(0.24, 0.24, 1.6, 24),
        engineMat
        );
        engineBody.rotation.z = Math.PI / 2;
        engineBody.position.set(0.2, 0.5, 0);
        group.add(engineBody);

        /* ENGINE NOSE */
        const engineNose = new T.Mesh(
        new T.CylinderGeometry(0.3, 0.3, 0.1, 24),
        engineMat
        );
        engineNose.rotation.z = Math.PI / 2;
        engineNose.position.set(1, 0.5, 0);
        group.add(engineNose);

        /* ENGINE CAB */
        const engineCab = new T.Mesh(
        new T.BoxGeometry(0.7, 0.8, 0.75),
        engineMat
        );
        engineCab.position.set(-0.4, 0.5, 0);
        group.add(engineCab);

        /*  UNDER ENGINE CAB */
        const underCab = new T.Mesh(
        new T.BoxGeometry(1.2, 0.25, 0.7),
        engineMat
        );
        underCab.position.set(0.5, 0.25, 0);
        group.add(underCab);

        /* CAB WINDOWS */

        // Front cab window
        const cabFrontWindow = new T.Mesh(
        new T.BoxGeometry(0.4, 0.3, 0.02),
        windowMat
        );
        cabFrontWindow.rotation.y = Math.PI / 2; // face +X
        cabFrontWindow.position.set(-0.05, 0.65, 0);
        group.add(cabFrontWindow);

        // Side cab windows (left/right)
        const cabSideWindowGeom = new T.BoxGeometry(0.25, 0.3, 0.02);

        const cabLeftWindow = new T.Mesh(cabSideWindowGeom, windowMat);
        cabLeftWindow.position.set(-0.4, 0.65, 0.42);
        group.add(cabLeftWindow);

        const cabRightWindow = cabLeftWindow.clone();
        cabRightWindow.position.z = -0.42;
        group.add(cabRightWindow);

        /* EXHAUST STACK */
        const exhaust = new T.Group();

        const stackBase = new T.Mesh(
        new T.CylinderGeometry(0.10, 0.12, 0.12, 12),
        detailMat
        );
        stackBase.position.set(0.6, 0.65, 0);

        const stackPipe = new T.Mesh(
        new T.CylinderGeometry(0.06, 0.09, 0.5, 16),
        detailMat
        );
        stackPipe.position.set(0.6, 0.95, 0);

        const stackCap = new T.Mesh(
        new T.CylinderGeometry(0.09, 0.09, 0.04, 12),
        detailMat
        );
        stackCap.position.set(0.6, 1.2, 0);

        exhaust.add(stackBase, stackPipe, stackCap);
        exhaust.position.set(0.2, 0, 0);
        group.add(exhaust);

        /* ROOF DETAIL */
        const roof = new T.Mesh(
        new T.BoxGeometry(0.9, 0.15, 0.78),
        detailMat
        );
        roof.position.set(-0.3, 0.9, 0);
        group.add(roof);

        /* BOX CARS */
        const carSpacing = 1.6;

        for (let i = 1; i <= 3; i++) {
        const x = -i * carSpacing;

        const boxCar = new T.Mesh(
            new T.BoxGeometry(1.5, 0.55, 0.85),
            boxMat
        );
        boxCar.position.set(x, 0.35, 0);
        group.add(boxCar);

        const boxRoof = new T.Mesh(
            new T.BoxGeometry(1.45, 0.12, 0.82),
            detailMat
        );
        boxRoof.position.set(x, 0.65, 0);
        group.add(boxRoof);

        /* BOX CAR WINDOWS */
        const carWindowGeom = new T.BoxGeometry(0.8, 0.25, 0.02);

        const leftCarWindow = new T.Mesh(carWindowGeom, windowMat);
        leftCarWindow.position.set(x, 0.5, 0.46);
        group.add(leftCarWindow);

        const rightCarWindow = leftCarWindow.clone();
        rightCarWindow.position.z = -0.46;
        group.add(rightCarWindow);
        }

        /* SIMPLE BOTTOM CONNECTORS */
        const connectorMat = detailMat;
        const connectorGeom = new T.BoxGeometry(0.3, 0.08, 0.2);
        const connectorY = 0.2;

        // engine -> car 1
        const con0 = new T.Mesh(connectorGeom, connectorMat);
        con0.position.set(-carSpacing / 2 + 0.1, connectorY, 0);
        group.add(con0);

        // car 1 -> car 2
        const con1 = con0.clone();
        con1.position.x = -carSpacing - carSpacing / 2 + 0.1;
        group.add(con1);

        // car 2 -> car 3
        const con2 = con0.clone();
        con2.position.x = -2 * carSpacing - carSpacing / 2 + 0.1;
        group.add(con2);

        /* TRAIN WHEELS */
        const wheelMat = new T.MeshStandardMaterial({ color: 0x222222 });

        const wheelOuterGeom = new T.CylinderGeometry(0.17, 0.17, 0.06, 24);
        wheelOuterGeom.rotateX(Math.PI / 2);

        const wheelFlangeGeom = new T.CylinderGeometry(0.20, 0.20, 0.03, 24);
        wheelFlangeGeom.rotateX(Math.PI / 2);

        const wheelHubGeom = new T.CylinderGeometry(0.07, 0.07, 0.07, 16);
        wheelHubGeom.rotateX(Math.PI / 2);

        const wheelY = 0.15;

        const makeWheel = (x, z) => {
        const wheelGroup = new T.Group();

        const outer = new T.Mesh(wheelOuterGeom, wheelMat);
        const flange = new T.Mesh(wheelFlangeGeom, wheelMat);
        const hub = new T.Mesh(wheelHubGeom, detailMat);

        flange.position.z = -0.02; 
        hub.position.z = 0;

        wheelGroup.add(outer, flange, hub);
        wheelGroup.position.set(x, wheelY, z);

        group.add(wheelGroup);
        };

        // Engine wheels – 4 per side
        [-0.5, -.1, 0.3, 0.7].forEach(x => {
        makeWheel(x, 0.4);   // left side
        makeWheel(x, -0.4);  // right side
        });

        // Box car wheels – 2 per side per car
        for (let i = 1; i <= 3; i++) {
        [-0.4, 0.4].forEach(dx => {
            const baseX = -i * carSpacing + dx;
            makeWheel(baseX, 0.4);
            makeWheel(baseX, -0.4);
        });
        }
        group.scale.setScalar(5);
        group.position.y = 0.25;

        super("Train", group);

        this.moving = false;

        /*this.protoGeo = new T.BoxGeometry(0.8, 0.8, 50);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0xffffff });
        this.normalMat = material;*/
    }

    go() {
        this.moving = true;
    }

    stepWorld(delta, timeOfDay, frozen) {
        if (this.moving) {
            this.objects[0].position.z -= 1;
        }

        if (this.objects[0].position.z < -40) {
            this.objects[0].position.z = 40;
            this.moving = false;
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