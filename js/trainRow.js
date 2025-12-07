import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { trainWarning } from "./trainWarning.js";
import { train } from "./train.js";

export class trainRow extends GrObject {
    constructor(x) {
        let geometry = new T.BoxGeometry(1, 0.2, 17);
        let material = new T.MeshStandardMaterial({ color: 0x664a2c });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(x, -0.1, 0);

        super("roadRow", mesh);

        this.x = x;

        let warning = new trainWarning();
        this.objects[0].add(warning.objects[0]);
        let train1 = new train();
        this.objects[0].add(train1.objects[0]);

        this.trainDelay = Math.random() * 500 + 500;
        this.train = train1;
        this.warning = warning;

        this.protoGeo = new T.BoxGeometry(1, 0.2, 17);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x664a2c });
        this.normalMat = material;
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

            if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }
        }

        this.train.stepWorld(delta, timeOfDay, frozen);
        this.warning.stepWorld(delta, timeOfDay, frozen);
    }
}