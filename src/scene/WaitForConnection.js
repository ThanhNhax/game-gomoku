// @ts-nocheck

export default class WaitForConnertion extends Phaser.Scene {
  constructor() {
    super("wait-for-connection");
  }
  preload() {
    this.load.image("bg_help", "assets/image/bg_help.png");
  }
  create(room) {
    console.log(room);
    window.room = room;
    console.log("room scebe wait: ", room.state.code);
    room.onMessage("newGame", () => {
      setTimeout(() => {
        this.scene.start("play-scene", { room, id: 1 });
      }, 3000);
    });
    this.roomId = room.state.code;
    console.log(this.roomId);
    this.add.image(500, 500, "background").setScale(6);
    this.bgbox = this.add.image(500, 500, "bgbox").setScale(6).setAlpha(0);
    this.title = this.add
      .image(this.game.config.width / 2, 200, "title")
      .setScale(3)
      .setAlpha(0);
    this.tweens.timeline({
      targets: this.title,
      ease: "Linear",
      loop: 0,
      delay: 1000,
      tweens: [
        {
          y: 150,
          alpha: 1,
          ease: "Linear",
          duration: 2000,
          repeat: 0,
          delay: 1000,
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
    // add table thong bao

    this.add.image(this.game.config.width / 2, 500, "bg_help");
    this.add
      .image(this.game.config.width / 2 + 240, 360, "exit")
      .setScale(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("create-room");
        //click X thì hủy room đã tạo đi không thì thoát ra khỏi room
      });
    this.add
      .text(500, 500, "Wait for player to connect...", {
        fontFamily: "Permanent Marker",
        fontSize: 38,
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(this.game.config.width / 2 - 130, 360, "Room ID: " + this.roomId, {
        fontFamily: "Permanent Marker",
        fontSize: 38,
      })
      .setOrigin(0.5, 0.5);
  }
}
