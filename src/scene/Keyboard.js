// @ts-nocheck
import Phaser from "phaser";
import KeyboardItem from "../gameObject/KeyboardItem";
import { HOST } from "./CreateRoom";
import { Client } from "colyseus.js";

// ket noi voi server
const client = new Client(HOST);
const values = [7, 8, 9, 4, 5, 6, 1, 2, 3, "×", 0, "✓"];

const CELL_SIZE = 55;
const CELL_PADDING = 6;

export default class Keyboard extends Phaser.Scene {
  constructor() {
    super("keyboard");
  }

  preload() {
    this.load.image("bg_help", "assets/image/bg_help.png");
  }

  create() {
    this.keyboards = [];
    this.roomId = "";

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

    this.msgBox = this.add.image(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "bg_help",
    );

    this.createHeader();
    this.createKeyboard();
    this.createRoomLabel();

    this.handleOnEvent();
  }

  handleOnEvent() {
    // @ts-ignore
    this.input.on("gameobjectdown", (pointer, gameobject) => {
      switch (gameobject) {
        case this.exit:
          this.scene.stop();
          this.scene.start("create-room");
          break;
        default:
          if (gameobject.value == "×") {
            this.roomId.length > 0 && this.setRoomId(this.roomId.slice(0, -1));
            return;
          }

          if (gameobject.value == "✓") {
            this.handleSubmit();
            return;
          }

          if (this.roomId.length > 9) {
            return;
          }

          this.setRoomId(this.roomId + gameobject.value);
          break;
      }
    });
  }

  async handleSubmit() {
    console.log(this.roomId);
    // call join room
    await client.joinOrCreate("lobby").then((room) => {
      room.send("findRoom", `${this.roomId}`);
      // listen to patches c  oming from the server
      room.onMessage("roomId", (roomId) => {
        console.log({ roomId });
        client.joinById(roomId).then((data) => {
          this.room = data;
          console.log(data);
          window.room = data;
          const gameState = data.state;
          const board = gameState.board.toArray();

          console.log(board);
          data.onMessage("newGame", () => {
            setTimeout(() => {
              this.scene.stop();
              this.scene.start("play-scene", {
                room: data,
                id: 2,
              });
            }, 3000);
          });
        });
      });
    });
  }

  setRoomId(value) {
    this.roomId = value;
    this.roomLabel.setText(this.roomId);
  }

  createRoomLabel() {
    this.roomLabel = this.add
      .text(this.msgBox.x - 100, this.msgBox.y, this.roomId || "000000", {
        fontFamily: "Permanent Marker",
        fontSize: "40px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  createKeyboard() {
    values.forEach((value) => {
      let backgroundColor = undefined;
      let borderColor = undefined;

      if (value === "✓") {
        backgroundColor = 0x30e451;
        borderColor = 0x1c842c;
      }

      if (value === "×") {
        backgroundColor = 0xf87171;
        borderColor = 0xdc2626;
      }

      const keyboard = new KeyboardItem(
        this,
        CELL_SIZE,
        value,
        backgroundColor,
        borderColor,
      );
      this.keyboards.push(keyboard);
    });

    Phaser.Actions.GridAlign(this.keyboards, {
      width: 3,
      height: 4,
      cellWidth: CELL_SIZE + CELL_PADDING,
      cellHeight: CELL_SIZE + CELL_PADDING,
      x: this.msgBox.x + 120,
      y: this.msgBox.y - 60,
    });

    this.keyboards.forEach((keyboard) => {
      keyboard.createText();
    });
  }

  createHeader() {
    this.exit = this.add
      .sprite(
        this.msgBox.x + this.msgBox.width / 2 - 70,
        this.msgBox.y - this.msgBox.height / 2 + 70,
        "exit",
      )
      .setScale(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {});

    this.titleText = this.add
      .text(
        this.msgBox.x - this.msgBox.width / 2 + 50,
        this.msgBox.y - this.msgBox.height / 2 + 50,
        "please enter room id",
        {
          fontFamily: "Permanent Marker",
          fontSize: "30px",
          color: "#ffffff",
          wordWrap: { width: this.msgBox.width - 80 },
        },
      )
      .setShadow(-5, 5, "rgba(0,0,0,0.5)", 0);
  }
}
