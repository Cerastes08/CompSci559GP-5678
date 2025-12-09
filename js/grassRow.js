import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Tree } from "./tree.js";

export class grassRow extends GrObject {
    constructor(x) {
        let geometry = new T.BoxGeometry(1, 0.2, 9);
        let material = new T.MeshStandardMaterial({ color: 0x00ff00 });
        let mesh = new T.Mesh(geometry, material);

        let geometry1 = new T.BoxGeometry(1, 0.2, 4);
        let material1 = new T.MeshStandardMaterial({ color: 0x214217});
        let mesh1 = new T.Mesh(geometry1, material1);
        let mesh2 = new T.Mesh(geometry1, material1);

        mesh.position.set(x, -0.1, 0);
        mesh1.position.set(0, 0, 6.5);
        mesh2.position.set(0, 0, -6.5);

        mesh.add(mesh1);
        mesh.add(mesh2);

        let tree1 = new Tree();
        tree1.objects[0].position.set(0.3, 0, -6.8);
        let tree2 = new Tree();
        tree2.objects[0].position.set(-0.2, 0, -5.3);
        let tree3 = new Tree();
        tree3.objects[0].position.set(0.1, 0, 5.1);
        let tree4 = new Tree();
        tree4.objects[0].position.set(-0.2, 0, 6.3);

        mesh.add(tree1.objects[0]);
        mesh.add(tree2.objects[0]);
        mesh.add(tree3.objects[0]);
        mesh.add(tree4.objects[0]);

        super("grassRow", mesh);

        this.x = x;

        /*this.protoGeo = new T.BoxGeometry(1, 0.2, 9);
        this.normalGeo = geometry;
        this.protoMat = new T.MeshStandardMaterial({ color: 0x00ff00 });
        this.normalMat = material;
        this.protoMat1 = new T.MeshStandardMaterial({ color: 0x214217});
        this.normalMat1 = material1;*/
    }

    rowType() {
        return "grass";
    }

    stepWorld(delta, timeOfDay, frozen, char) {
        if (this.objects[0].position.x < (this.x - 0.06)) {
            this.objects[0].position.x += 0.2;
        } else if (this.objects[0].position.x > (this.x + 0.06)) {
            this.objects[0].position.x -= 0.2;
        }

        if (!frozen) {
            /*if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
                this.objects[0].children[0].material = this.protoMat1;
                this.objects[0].children[1].material = this.protoMat1;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
                this.objects[0].children[0].material = this.normalMat1;
                this.objects[0].children[1].material = this.normalMat1;
            }*/
        }
    }
}