import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { trainWarning } from "./trainWarning.js";
import { train } from "./train.js";

export class trainRow extends GrObject {
    constructor(x) {
        const group = new T.Group();

        /* MATERIALS */
        const railMat = new T.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.4,
        metalness: 0.6
        });

        const tieMat = new T.MeshStandardMaterial({
        color: 0x5a3e2b
        });

        /* RAILS */
        const railGeom = new T.BoxGeometry(17, 0.05, 0.08);

        const railOffset = 0.6;

        const leftRail = new T.Mesh(railGeom, railMat);
        leftRail.position.set(0, 0.05, railOffset);
        group.add(leftRail);

        const rightRail = leftRail.clone();
        rightRail.position.z = -railOffset;
        group.add(rightRail);

        /* TIES */
        const tieGeom = new T.BoxGeometry(0.25, 0.04, railOffset * 2.3);

        const tieCount = Math.floor(length / 0.5);
        for (let i = 0; i < tieCount; i++) {
        const tie = new T.Mesh(tieGeom, tieMat);
        tie.position.set(
            -length / 2 + i * 0.5,
            0.02,
            0
        );
        group.add(tie);
        }
        group.scale.setScalar(2);
        super("Railroad", group);
        this.x = x;

        let warning = new trainWarning();
        this.objects[0].add(warning.objects[0]);
        let train1 = new train();
        this.objects[0].add(train1.objects[0]);

        this.trainDelay = Math.random() * 500 + 500;
        this.train = train1;
        this.warning = warning;

        /*this.protoGeo = new T.BoxGeometry(1, 0.2, 17);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x664a2c });
        this.normalMat = material;*/
    }

    rowType() {
        return "train";
    }

    stepWorld(delta, timeOfDay, frozen, char) {
        if (this.objects[0].position.x < (this.x - 0.06)) {
            this.objects[0].position.x += 0.2;
        } else if (this.objects[0].position.x > (this.x + 0.06)) {
            this.objects[0].position.x -= 0.2;
        }

        if (Math.abs(this.train.objects[0].position.z - char.objects[0].position.z) < 25 &&
            this.objects[0].position.x > -0.3 && this.objects[0].position.x < 0.3) {
            char.freeze();
        }

        if (!frozen) {
            if (this.trainDelay <= 100) {
                this.warning.activate();
            } else {
                this.warning.deactivate();
            }

            if (this.trainDelay <= 0) {
                this.train.go();
                this.trainDelay = Math.random() * 500 + 500;
            } else {
                this.trainDelay -= 1;
            }

            /*if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }*/
        }

        this.train.stepWorld(delta, timeOfDay, frozen);
        this.warning.stepWorld(delta, timeOfDay, frozen);
    }
}