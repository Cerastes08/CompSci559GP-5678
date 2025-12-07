import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { smallCar } from "./smallCar.js";
import { largeCar } from "./largeCar.js";

export class roadRow extends GrObject {
    constructor(x, direction) {
        let geometry = new T.BoxGeometry(1, 0.2, 9);
        let material = new T.MeshStandardMaterial({ color: 0x544f4f });
        let mesh = new T.Mesh(geometry, material);

        mesh.position.set(x, -0.1, 0);

        super("roadRow", mesh);

        this.x = x;
        this.direction = direction;
        this.cars = [];
        this.carDelay = 0;
        this.nextCar = Math.floor(Math.random() * 2);
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
            if (Math.abs(car.objects[0].position.z - char.objects[0].position.z) < 0.8 &&
                this.objects[0].position.x > -0.4 && this.objects[0].position.x < 0.4) {
                char.freeze();
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
                this.carDelay = 100 + Math.floor(Math.random() * 100);
            } else {
                this.carDelay -= 1;
            }

            this.cars.forEach((car) => {
                car.stepWorld(delta, timeOfDay, frozen);
            });
        }
    }
}