import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { lilypad } from "./lilypad.js";

export class riverRow extends GrObject {
    constructor(x) {
        let geometry = new T.BoxGeometry(1, 0.2, 9);
        let material = new T.MeshStandardMaterial({ color: 0x365eba });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(x, -0.2, 0);

        let lilypad1 = new lilypad(3);
        mesh.add(lilypad1.objects[0]);
        let lilypad2 = new lilypad(-3);
        mesh.add(lilypad2.objects[0]);
        let lilypad3 = new lilypad(0);
        mesh.add(lilypad3.objects[0]);

        super("riverRow", mesh);

        this.x = x;
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
    }
}