// @ts-nocheck
import Phaser from "phaser";
import WebFontFile from "../gameObject/WebFontFile";

export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }
  preload() {
    this.load.image("background", "assets/sprites/titlescreen/background.png");
    this.load.image("bgbox", "assets/sprites/titlescreen/bgbox.png");
    this.load.image("title", "assets/sprites/titlescreen/title.png");
    this.load.image("btnstart", "assets/sprites/titlescreen/startbutton.png");
    this.load.image("bg-help", "assets/image/bg_help.png");
    this.load.image("exit", "assets/image/but_no.png");
    this.load.image("bg", "assets/image/background.png");
    this.load.image("x", "assets/image/X.png");
    this.load.image("o", "assets/image/O.png");

    this.load.addFile(new WebFontFile(this.load, "Permanent Marker"));
  }
  create() {
    this.add.image(500, 500, "background").setScale(6);
    this.bgbox = this.add.image(500, 500, "bgbox").setScale(6).setAlpha(0);
    this.title = this.add
      .image(this.game.config.width / 2, 350, "title")
      .setScale(3)
      .setAlpha(0);
    this.animTitle(300, this.title);
    this.tweens.timeline({
      targets: this.bgbox,
      ease: "Linear",
      loop: 0,
      tweens: [
        {
          alpha: 1,
          ease: "Linear",
          duration: 1000,
          delay: 500,
          repeat: 0,
        },
      ],
    });

    this.gomoku = this.add.text(this.game.config.width / 2, 650, "GOMOKU", {
      fontFamily: "Permanent Marker",
      fontSize: 72,
    });
    this.gomoku.setOrigin(0.5, 0.5);
    this.animTitle(650, this.gomoku);
    //btnStart
    this.add
      .image(
        this.game.config.width / 2,
        this.game.config.height - 150,
        "btnstart",
      )
      .setScale(2)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("create-room");
      });
  }
  animTitle(y, targets) {
    this.tweens.timeline({
      targets: targets,
      ease: "Linear",
      loop: 0,
      delay: 500,
      tweens: [
        {
          y: y,
          alpha: 1,
          ease: "Linear",
          duration: 2000,
          repeat: 0,
          delay: 1000,
        },
        {
          y: y + 50,
          alpha: 1,
          ease: "Linear",
          duration: 2000,
          repeat: -1,
          delay: 600,
          yoyo: true,
        },
      ],
    });
  }
}
