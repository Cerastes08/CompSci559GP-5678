import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class train extends GrObject {
    constructor() {
        let geometry = new T.BoxGeometry(0.8, 0.8, 50);
        let material = new T.MeshStandardMaterial({ color: 0xffffff });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(0, 0.4, 40);

        super("train", mesh);

        this.moving = false;
    }

    go() {
        this.moving = true;
    }

    stepWorld(delta, timeOfDay) {
        if (this.moving) {
            this.objects[0].position.z -= 1;
        }

        if (this.objects[0].position.z < -40) {
            this.objects[0].position.z = 40;
            this.moving = false;
        }
    }
}