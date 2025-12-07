import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class trainWarning extends GrObject {
    constructor() {
        let geometry = new T.CylinderGeometry(0.04, 0.04, 1, 32);
        let material = new T.MeshStandardMaterial({ color: 0xffffff });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(-0.45, 0.5, -2.5);

        super("trainWarning", mesh);

        this.protoGeo = new T.CylinderGeometry(0.04, 0.04, 1, 32);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0xffffff });
        this.normalMat = material;
    }

    activate() {
        this.objects[0].material.color.set(0xff0000);
    }

    deactivate() {
        this.objects[0].material.color.set(0xffffff);
    }

    stepWorld(delta, timeOfDay, frozen) {
        if (!frozen) {
            if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }
        }
    }
}