import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class lilypad extends GrObject {
    constructor(z) {
        // Load texture
        const lilyText = new T.TextureLoader().load("../../CompSci559GP-5678/textures/lilypad_v2_colored.png");
        lilyText.center.set(0.5, 0.5);
        lilyText.rotation = Math.random()*Math.PI*2;

        const padMat = new T.MeshStandardMaterial({
        map: lilyText
        });

        // Geometry
        const padGeom = new T.CylinderGeometry(0.4, 0.4, 0.03, 32);
        const pad = new T.Mesh(padGeom, padMat);

        // Lift above water
        pad.position.y = 0.1;

        super("Lilypad", pad);

        this.z = z;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x183b10, map: null });
        this.normalMat = padMat;
    }

    stepWorld(delta, timeOfDay) {
        this.objects[0].position.z = this.z;
        const protoMat = this.protoMat;

        const protoBox = document.getElementById("prototype");
        const proto = protoBox ? protoBox.checked : false;

        if (proto) {
            console.log("proto");
            this.objects[0].material = this.protoMat;
        } else {
            this.objects[0].material = this.normalMat;
        }
    }
}