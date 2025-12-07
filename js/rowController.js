import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { grassRow } from "./grassRow.js";
import { roadRow } from "./roadRow.js";
import { riverRow } from "./riverRow.js";
import { trainRow } from "./trainRow.js";

export class rowControlller extends GrObject {
    constructor(char) {
        let controller = new T.Group();

        let geometry = new T.SphereGeometry(0.5, 32, 32);
        let material = new T.MeshStandardMaterial({ color: 0xff0000 });
        let mesh = new T.Mesh(geometry, material);
        mesh.position.y = -0.5;

        controller.add(mesh);

        super("rowController", controller);
        
        this.rows = [];
        for (let i = -4; i < 5; i++) {
            this.addGrassRow(i);
        }
        this.addRoadRow(-5, 0);
        this.addGrassRow(-6);
        this.addRiverRow(-7);
        this.addGrassRow(-8);
        this.addRoadRow(-9);
        this.addRoadRow(-10, 0);
        this.addGrassRow(-11);
        this.addGrassRow(-12);
        this.addGrassRow(-13);
        this.addTrainRow(-14);

        this.frozen = false;
        this.char = char;
    }

    addGrassRow(x) {
        let gRow = new grassRow(x);
        this.rows.push(gRow);
        this.objects[0].add(gRow.objects[0]);
    }

    addRoadRow(x) {
        let rRow = new roadRow(x, Math.floor(Math.random()*2));
        this.rows.push(rRow);
        this.objects[0].add(rRow.objects[0]);
    }

    addRiverRow(x) {
        let riRow = new riverRow(x);
        this.rows.push(riRow);
        this.objects[0].add(riRow.objects[0]);
    }

    addTrainRow(x) {
        let tRow = new trainRow(x);
        this.rows.push(tRow);
        this.objects[0].add(tRow.objects[0]);
    }

    freeze() {
        this.frozen = true;
    }

    stepWorld(delta, timeOfDay) {
        if (this.char.frozen) {
            this.frozen = true;
        } else {
            this.rows.forEach(row => {
                row.stepWorld(delta, timeOfDay, this.frozen, this.char);
            });
        }
    }
}