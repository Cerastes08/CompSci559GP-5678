import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { character } from "./character.js";
import { rowControlller } from "./rowController.js";

let world = new GrWorld({
    width: "1000", 
    height: "1000", 
    lookfrom: new T.Vector3(5, 13, 0), 
    //lookfrom: new T.Vector3(7, 10, 4),
    lookat: new T.Vector3(-3, 0, 0),
    groundplane: false
});
world.orbitControlOff();

let char = new character();
world.add(char);

let rowController1 = new rowControlller(char);
world.add(rowController1);

let points = 0;
let keydown = false;
let gameOver = false;
let scoreText = document.getElementById("scoreText");
document.addEventListener("keydown", (event) => {
    if (!gameOver) {
        const keyName = event.key;
        if (char.frozen) {
            gameOver = true;
            rowController1.freeze();
            return;
        }
        if (keydown === true) {
            return;
        }
        if (keyName === "ArrowUp") {
            keydown = true;
            let farthestRow = rowController1.rows[rowController1.rows.length - 1];
            let nearestRow = rowController1.rows[points + 5];
            char.objects[0].rotation.y = Math.PI / 2;
            points += 1;
            scoreText.innerText = "Score: " + points;
            rowController1.rows.forEach(row => {
                row.x += 1;
            });

            if (farthestRow.x > -14) {
                let r = Math.random()*4;
                if (r < 1) {
                    rowController1.addGrassRow(-14);
                } else if (r < 2) {
                    rowController1.addRoadRow(-14);
                } else if (r < 3) {
                    rowController1.addRiverRow(-14);
                } else {
                    rowController1.addTrainRow(-14);
                }
            }

            if (nearestRow.rowType() === "river" && !(char.z === 0 || char.z === 3 || char.z === -3)) {
                gameOver = true;
                rowController1.freeze();
            }
        }
        else if (keyName === "ArrowDown" && points > 0) {
            keydown = true;
            let farthestRow = rowController1.rows[rowController1.rows.length - 1];
            let nearestRow = rowController1.rows[points + 3];
            char.objects[0].rotation.y = -Math.PI / 2;
            points -= 1;
            scoreText.innerText = "Score: " + points;
            rowController1.rows.forEach(row => {
                row.x -= 1;
            });

            if (nearestRow.rowType() === "river" && !(char.z === 0 || char.z === 3 || char.z === -3)) {
                gameOver = true;
                rowController1.freeze();
            }
        }
        else if (keyName === "ArrowRight") {
            keydown = true;
            if (char.z > -4) {
                char.z -= 1;
            }
            char.objects[0].rotation.y = 0;
            let nearestRow = rowController1.rows[points + 4];
            if (nearestRow.rowType() === "river" && !(char.z === 0 || char.z === 3 || char.z === -3)) {
                gameOver = true;
                rowController1.freeze();
            }
        }
        else if (keyName === "ArrowLeft") {
            keydown = true;
            if (char.z < 4) {
                char.z += 1;
            }
            char.objects[0].rotation.y = -Math.PI;
            let nearestRow = rowController1.rows[points + 4];
            if (nearestRow.rowType() === "river" && !(char.z === 0 || char.z === 3 || char.z === -3)) {
                gameOver = true;
                rowController1.freeze();
            }
        }
    }
});
document.addEventListener("keyup", (event) => {
    console.log("Points: " + points);
    keydown = false;
    if (char.frozen) {
        gameOver = true;
        rowController1.freeze();
    }
});

world.go();