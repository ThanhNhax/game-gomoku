// @ts-nocheck
import Phaser from "phaser";
const CELL_SIZE = 40;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("play-scene");
    this.myKey = undefined;
    this.whoseTurn = 1;
    this.gameOver = false;
    this.boardArray = [];
  }

  preload() {}

  create({ room, id }) {
    this.graphics = this.add.graphics();

    this.id = id;
    console.log("room player id: ", this.id);
    window.room = room;
    this.room = room;
    this.boardArray = this.pathBoard(room.state.board.toArray());
    this.add.image(500, 500, "background").setScale(6);
    this.bgbox = this.add.image(500, 500, "bgbox").setScale(6).setAlpha(0);
    this.drawNamePlayer1(this.game.config.width * 0.25, 60);
    this.drawNamePlayer2(this.game.config.width * 0.75, 60);
    this.drawBoard();

    this.input.on("gameobjectdown", this.handleClick, this);

    this.room.onMessage("move", ({ x, y, player }) => {
      console.log("server tra ve move", x, y, player);
      this.drawPlayer(y, x, player);
      if (this.id === player) {
        this.input.off("gameobjectdown", this.handleClick, this);
       
      } else {
        this.input.on("gameobjectdown", this.handleClick, this);
       
      }
      this[`textPlayer${player === 1 ? 2 : 1}`].tint =
        player === 2 ? 0xff0000 : 0x00ccff;
      this[`textPlayer${player === 1 ? 1 : 2}`].tint = 0xffffff;
    });
    // gameOver server tra ve
    this.room.onMessage("gameOver", ({ winner }) => {
      console.log("this.gameOver", winner);
      this.gameOver = true;
      this.winAnnouncement(winner);
    });
  }
  drawBoard() {
    for (let row = 0; row < this.boardArray[0].length; row++) {
      for (let col = 0; col < this.boardArray[row].length; col++) {
        if (this.boardArray[row][col].type === "empty") this.drawCell(row, col);
      }
    }
  }

  drawCell(row, col) {
    const bgHover = this.add.image(
      col * CELL_SIZE + 100,
      row * CELL_SIZE + 150,
      "bg"
    );
    bgHover.setOrigin(0, 0);
    bgHover.setInteractive({ cursor: "pointer" });
    bgHover.on("pointerover", () => {
      // vẻ cái hình tròn để xác định vị trí của người chơi đánh
      bgHover.setAlpha(0.5);
    });
    bgHover.on("pointerout", () => {
      bgHover.setAlpha(1);
    });
   
  }
  drawPlayer(row, col, level) {
    console.log("drawlayer called");
    // 1 : X ;2: O
    const x = (this.x = this.add.image(
      col * CELL_SIZE + 105, //105 = 100 cua padding board, 5 la padding cho XO vao giua duong cheo o
      row * CELL_SIZE + 155,
      level === 1 ? "x" : "o"
    ));
    x.setOrigin(0, 0);
    x.setScale(1.5);
  }
  handleClick(pointer, targets) {
    if (this.gameOver) {
      setTimeout(() => {
        return;
      }, 5000);
    }
    if (this.id === this.room.state.player1.id) {
      console.log("dung");
    }

    const { x, y } = targets;
    const col = x / CELL_SIZE - 100 / CELL_SIZE;
    const row = y / CELL_SIZE - 150 / CELL_SIZE;
    console.log({ x, y, col, row });
    // cho player click hay khong la o day
    this.room.send("play", { x: col, y: row });
  }

  winAnnouncement(playerID) {
    const bgToWin = this.add.rectangle(0, 0, 1000, 1000, 0x000000);
    bgToWin.setOrigin(0, 0);
    bgToWin.setAlpha(0.3);
    this.createTableGameOver(playerID);
  }

  drawNamePlayer1(x, y) {
    this.textPlayer1 = this.add
      .text(x, y, "Player1", {
        fontFamily: "Permanent Marker",
        fontSize: 24,
      })
      .setOrigin(0.5, 0.5);
  }
  drawNamePlayer2(x, y) {
    this.textPlayer2 = this.add
      .text(x, y, "Player2", {
        fontFamily: "Permanent Marker",
        fontSize: 24,
      })
      .setOrigin(0.5, 0.5);
  }
  // khoi tao lai game ( choi lai game)

  pathBoard(arr1d) {
    const rows = 20;
    const cols = 20;

    const arr2d = [];

    for (let i = 0; i < rows; i++) {
      arr2d.push(arr1d.slice(i * cols, i * cols + cols));
    }
    return arr2d;
  }
  createTableGameOver() {
    this.add.image(this.game.config.width / 2, 600, "bg-help");
    // tao 2 btn create va join room
    this.add
      .text(
        this.game.config.width / 2,
        600,
        this.id === 1 ? "You Win" : "You Lose",
        {
          fontFamily: "Permanent Marker",
          fontSize: 80,
        }
      )
      .setOrigin(0.5, 0.5);
  }
}
