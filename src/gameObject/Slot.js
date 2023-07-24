import Phaser from "phaser";
import { CELL_SIZE } from "./Icon";
export default class Slot extends Phaser.GameObjects.Sprite {
    constructor(scene, row, col) {
        const x = (col + 0.5) * CELL_SIZE;
        const y = (row + 0.5) * CELL_SIZE;
        const texture = "bg";
        super(scene, x, y, texture);

        this.scene = scene;
        this.col = col;
        this.row = row;
        scene.add.existing(this);
        this.setScale(0.7);
    }
}
