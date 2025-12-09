import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { smallCar } from "./smallCar.js";
import { largeCar } from "./largeCar.js";

export class roadRow extends GrObject {
    constructor(x, direction) {
        let geometry = new T.BoxGeometry(1, 0.2, 17);
        let material = new T.MeshStandardMaterial({ color: 0x544f4f });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(x, -0.1, 0);

        super("roadRow", mesh);

        this.x = x;
        this.direction = direction;
        this.cars = [];
        this.carDelay = Math.random() * 50;
        this.nextCar = Math.floor(Math.random() * 2);

        /*this.protoGeo = new T.BoxGeometry(1, 0.2, 17);
        this.normalGeo = geometry
        this.protoMat = new T.MeshStandardMaterial({ color: 0x544f4f });
        this.normalMat = material;*/
    }

    rowType() {
        return "road";
    }

    stepWorld(delta, timeOfDay, frozen, char) {
        if (this.objects[0].position.x < (this.x - 0.06)) {
            this.objects[0].position.x += 0.2;
        } else if (this.objects[0].position.x > (this.x + 0.06)) {
            this.objects[0].position.x -= 0.2;
        }

        this.cars.forEach((car) => {
            if (car instanceof smallCar) {
                if (Math.abs(car.objects[0].position.z - char.objects[0].position.z) < 0.85 &&
                    this.objects[0].position.x > -0.3 && this.objects[0].position.x < 0.3) {
                    char.freeze();
                }
            } else {
                if (Math.abs(car.objects[0].position.z - char.objects[0].position.z) < 1.1 &&
                    this.objects[0].position.x > -0.3 && this.objects[0].position.x < 0.3) {
                    char.freeze();
                }
            }

            if (car.objects[0].position.z > 10 || car.objects[0].position.z < -10) {
                this.objects[0].remove(car.objects[0]);
            }
        });

        if (!frozen) {
            if (this.carDelay <= 0) {
                if (this.nextCar === 0) {
                    let car = new smallCar(this.direction);
                    this.cars.push(car);
                    this.objects[0].add(car.objects[0]);
                } else {
                    let car = new largeCar(this.direction);
                    this.cars.push(car);
                    this.objects[0].add(car.objects[0]);
                }
                this.nextCar = Math.floor(Math.random() * 2);
                this.carDelay = 70 + Math.random() * 200;
            } else {
                this.carDelay -= 1;
            }

            this.cars.forEach((car) => {
                car.stepWorld(delta, timeOfDay, frozen);
            });

            /*if (document.getElementById("prototype").checked) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }*/
        }
    }
}