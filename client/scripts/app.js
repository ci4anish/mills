import { Cloud } from "./classes/Cloud";
import { land } from "./classes/Land";
import { sun } from "./classes/Sun";
import { millsManager } from "./classes/MillsManager";
import { sky } from "./classes/Sky";
import { gameScore } from "./classes/GameScore"

import { socket } from "./socket";

socket.emit("action", "User is emmiting some action");
socket.on("server event", (e) => { console.log("server event", e) });
socket.on("broadcast", (e) => { console.log("broadcast", e) });

let clouds = [
    new Cloud({x: 50, y: 135}),
    new Cloud({x: 200, y: 50}),
    new Cloud({x: 400, y: 180}),
    new Cloud({x: 600, y: 250}),
    new Cloud({x: 1100, y: 80}),
    new Cloud({x: 900, y: 235}),
    new Cloud({x: 1200, y: 150}),
    new Cloud({x: -50, y: 166}),
    new Cloud({x: 1100, y: 300}),
    new Cloud({x: 500, y: 166}),
    new Cloud({x: 700, y: 400}),
    new Cloud({x: 800, y: 260}),
    new Cloud({x: 300, y: 370}),
    new Cloud({x: -750, y: 420}),
];

clouds.forEach(cloud => {
    cloud.setup();
});

gameScore.draw();
sky.draw();
land.draw();
sun.setup();
millsManager.setup();
millsManager.addMill();
millsManager.addMill();
millsManager.addMill();
// setInterval(() => {
//     millsManager.addMill();
// }, 9000);
