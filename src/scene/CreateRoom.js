// @ts-nocheck
import { Client } from "colyseus.js";
export const HOST = "wss://fresher.woay.io";
const client = new Client(HOST);
// @ts-nocheck
export default class CreateRoom extends Phaser.Scene {
  constructor() {
    super("create-room");
  }
  preload() {}
  create() {
    this.add.image(500, 500, "background").setScale(6);
    this.bgbox = this.add.image(500, 500, "bgbox").setScale(6).setAlpha(0);
    this.title = this.add
      .image(this.game.config.width / 2, 200, "title")
      .setScale(3)
      .setAlpha(0);
    //anim cua title
    this.tweens.timeline({
      targets: this.title,
      ease: "Linear",
      loop: 0,
      delay: 500,
      tweens: [
        {
          y: 150,
          alpha: 1,
          ease: "Linear",
          duration: 1000,
          repeat: 0,
          delay: 500,
        },
        {
          y: 200,
          alpha: 1,
          ease: "Linear",
          duration: 2000,
          repeat: -1,
          delay: 600,
          yoyo: true,
        },
      ],
    });
    this.tweens.timeline({
      targets: this.bgbox,
      ease: "Linear",
      loop: 0,
      tweens: [
        {
          alpha: 1,
          ease: "Linear",
          duration: 2000,
          delay: 1000,
          repeat: 0,
        },
      ],
    });

    // tao bang
    this.createTableRoom();
  }
  createTableRoom() {
    this.add.image(this.game.config.width / 2, 600, "bg-help");
    // tao 2 btn create va join room
    this.add
      .text(this.game.config.width / 2, 450, "matchmaking", {
        fontFamily: "Permanent Marker",
        fontSize: 40,
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(this.game.config.width / 2 + 50, 650, "Create", {
        fontFamily: "Permanent Marker",
        fontSize: 40,
        color: "green",
        backgroundColor: "white",
        padding: { x: 20, bottom: 10 },
      })
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.scene.stop();
        // emit len server cteate room
        this.room();
      });
    this.add
      .text(this.game.config.width / 2 - 225, 650, "Join", {
        fontFamily: "Permanent Marker",
        fontSize: 40,
        color: "yellow",
        backgroundColor: "#db2777",
        padding: { x: 30, bottom: 10 },
      })
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("keyboard");
      });
  }
  room() {
    client.create("caro").then((room) => {
      console.log(room); // log co
      room.onStateChange.once((state) => {
        if (state.code) {
          //TODO: Show code lên màn hình
          this.scene.start("wait-for-connection", room);
        }
      });
    });
  }
}
