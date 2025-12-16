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
        const padGeom = new T.CylinderGeometry(0.35, 0.35, 0.03, 32);
        const pad = new T.Mesh(padGeom, padMat);

        // Lift above water
        pad.position.y = 0.1;

        super("Lilypad", pad);

        this.time = 0;
        this.baseY = 0.25;
        this.baseX = .05;
        this.baseZ = z;

        this.z = z;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x183b10, map: null });
        this.normalMat = padMat;
    }



    stepWorld(delta, timeOfDay) {
        const pad = this.objects[0];
        this.time += delta;

        // Float settings
        const bobSpeed = 0.003;
        const bobHeight = 0.025;
        const swayWidth = 0.03;
        const driftDepth = 0.08;   

        // Vertical bob 
        pad.position.y = this.baseY + Math.sin(this.time * bobSpeed + this.baseZ) * bobHeight;

        // Horizontal sway
        pad.position.x = this.baseX + Math.sin(this.time * bobSpeed * 0.8) * swayWidth;

        // left-right drift
        pad.position.z = this.baseZ + Math.sin(this.time * bobSpeed * 0.6) * driftDepth;

        // Prototype toggle
        const protoBox = document.getElementById("prototype");
        let proto = false;
        if (protoBox) {
            proto = protoBox.checked;
        }

        if (proto) {
            pad.material = this.protoMat;
        } else {
            pad.material = this.normalMat;
        }
    }


}