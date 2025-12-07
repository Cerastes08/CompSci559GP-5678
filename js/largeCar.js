import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class largeCar extends GrObject {
    constructor(direction) {
        let geometry = new T.BoxGeometry(0.8, 0.8, 1.8);
        let material = new T.MeshStandardMaterial({ color: 0x183b10 });
        let mesh = new T.Mesh(geometry, material);

        if (direction === 0) {
            mesh.position.set(0, 0.4, -5);
        } else {
            mesh.position.set(0, 0.4, 5);
        }

        super("largeCar", mesh);

        this.direction = direction;
    }

    stepWorld(delta, timeOfDay, frozen) {
        if (!frozen) {
            if (this.direction === 0) {
                this.objects[0].position.z += 0.03;
            } else {
                this.objects[0].position.z -= 0.03;
            }
        }
    }
}