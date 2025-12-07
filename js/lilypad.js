import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class lilypad extends GrObject {
    constructor(z) {
        let geometry = new T.CylinderGeometry(0.4, 0.4, 0.3, 32);
        let material = new T.MeshStandardMaterial({ color: 0x183b10 });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(0, 0.05, z);

        super("lilypad", mesh);

        this.z = z;
    }

    stepWorld(delta, timeOfDay) {
        this.objects[0].position.z = this.z;
    }
}