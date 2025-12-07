import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class trainWarning extends GrObject {
    constructor() {
        let geometry = new T.CylinderGeometry(0.04, 0.04, 1, 32);
        let material = new T.MeshStandardMaterial({ color: 0xffffff });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(-0.45, 0.5, -2.5);

        super("trainWarning", mesh);
    }

    activate() {
        this.objects[0].material.color.set(0xff0000);
    }

    deactivate() {
        this.objects[0].material.color.set(0xffffff);
    }
}