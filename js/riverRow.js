import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { lilypad } from "./lilypad.js";

export class riverRow extends GrObject {
    constructor(x) {
        let geometry = new T.BoxGeometry(1, 0.2, 17);
        let material = new T.MeshStandardMaterial({ color: 0x365eba });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(x, -0.2, 0);

        let lilypads = [];
        let lilypad1 = new lilypad(3);
        mesh.add(lilypad1.objects[0]);
        lilypads.push(lilypad1);
        let lilypad2 = new lilypad(-3);
        mesh.add(lilypad2.objects[0]);
        lilypads.push(lilypad2);
        let lilypad3 = new lilypad(0);
        mesh.add(lilypad3.objects[0]);
        lilypads.push(lilypad3);

        super("riverRow", mesh);

        this.x = x;
        this.lilypads = lilypads;

        /*this.protoGeo = new T.BoxGeometry(1, 0.2, 17);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x365eba });
        this.normalMat = material;*/
    }

    rowType() {
        return "river";
    }

    stepWorld(delta, timeOfDay, frozen, char) {
        if (this.objects[0].position.x < (this.x - 0.06)) {
            this.objects[0].position.x += 0.2;
        } else if (this.objects[0].position.x > (this.x + 0.06)) {
            this.objects[0].position.x -= 0.2;
        }

        if (!frozen) {
            /*if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }*/

            this.lilypads.forEach((lp) => {
                lp.stepWorld(delta, timeOfDay);
            });
        }
    }
}