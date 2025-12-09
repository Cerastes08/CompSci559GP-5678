import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class lilypad extends GrObject {
    constructor(z) {
        const group = new T.Group();

        // Load texture
        const lilyText = new T.TextureLoader().load("../textures/lilypad_v2_colored.png");
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

        group.add(pad);

        super("Lilypad", group);

        this.z = z;
        /*this.protoGeo = new T.CylinderGeometry(0.4, 0.4, 0.3, 32);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x183b10 });
        this.normalMat = material;*/
    }

    stepWorld(delta, timeOfDay) {
        this.objects[0].position.z = this.z;

        /*if (document.getElementById("prototype").checked) {
            this.objects[0].geometry = this.protoGeo;
            this.objects[0].material = this.protoMat;
        } else {
            this.objects[0].geometry = this.normalGeo;
            this.objects[0].material = this.normalMat;
        }*/
    }
}