import Phaser from "phaser";

export const CELL_SIZE = 100;
export default class Icon extends Phaser.GameObjects.Sprite {
    constructor(scene, level, col, row) {
        const x = (col + 0.5) * CELL_SIZE;
        const y = (row + 0.5) * CELL_SIZE;
        const texture = "icon-" + level;
        super(scene, x, y, texture);
        this.level = level;
        this.row0 = this.row = row;
        this.col0 = this.col = col;
        this.scene = scene;
        scene.add.existing(this);
    }
    // back() {
    //     this.x = CELL_SIZE * (this.col0 + 0.5);
    //     this.y = CELL_SIZE * (this.row0 + 0.5);
    // }
    back() {
        this.x = CELL_SIZE * (this.col0 + 0.5);
        this.y = CELL_SIZE * (this.row0 + 0.5);
    }

    // randomLevel() {
    //     const level = Phaser.Math.Between(1, 2);
    //     this.level = level;
    //     this.setTexture("icon-" + this.level);
    // }
    randomLevel() {
        const level = Phaser.Math.Between(1, 2);
        this.level = level;
        this.setTexture("icon-" + this.level);
    }

    // levelUp() {
    //     if (this.level < 3) {
    //         this.level += 1;
    //         this.setTexture("icon-" + this.level);
    //     }
    // }
    levelUp() {
        if (this.level < 3) {
            this.level += 1;
            this.setTexture("icon-" + this.level);
        }
    }
}
