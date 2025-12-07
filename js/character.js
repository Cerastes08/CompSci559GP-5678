import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class character extends GrObject {
    constructor() {
        let geometry = new T.BoxGeometry(0.8, 0.8, 0.8);
        let material = new T.MeshStandardMaterial({ color: 0x0000ff });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.y = 0.4;
        
        super("character", mesh);

        this.y = 0.4;
        this.z = 0;
        this.frozen = false;

        this.protoGeo = new T.BoxGeometry(0.8, 0.8, 0.8);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0xffffff });
        this.normalMat = material;
    }

    moved() {
        return this.y === this.objects[0].position.y && this.z === this.objects[0].position.z;
    }

    freeze() {
        this.frozen = true;
    }

    stepWorld(delta, timeOfDay) {
        if (this.objects[0].position.y < this.y) {
            this.objects[0].position.y += 0.1;
        } else if (this.objects[0].position.y > this.y) {
            this.objects[0].position.y = this.y;
        }

        if (this.objects[0].position.z < (this.z - 0.06)) {
            this.objects[0].position.z += 0.2;
        } else if (this.objects[0].position.z > (this.z + 0.06)) {
            this.objects[0].position.z -= 0.2;
        }

        if (!this.frozen) {
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