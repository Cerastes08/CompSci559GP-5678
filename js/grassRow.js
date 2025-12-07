import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class grassRow extends GrObject {
    constructor(x) {
        let geometry = new T.BoxGeometry(1, 0.2, 9);
        let material = new T.MeshStandardMaterial({ color: 0x00ff00 });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(x, -0.1, 0);

        super("grassRow", mesh);

        this.x = x;
    }

    rowType() {
        return "grass";
    }

    stepWorld(delta, timeOfDay, frozen, char) {
        if (this.objects[0].position.x < (this.x - 0.06)) {
            this.objects[0].position.x += 0.2;
        } else if (this.objects[0].position.x > (this.x + 0.06)) {
            this.objects[0].position.x -= 0.2;
        }
    }
}