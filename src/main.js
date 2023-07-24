import Phaser, { AUTO } from "phaser";

import PlayScene from "./scene/PlayScene";
import Intro from "./scene/Intro";
import CreateRoom from "./scene/CreateRoom";
import WaitForConnertion from "./scene/WaitForConnection";
import Keyboard from "./scene/Keyboard";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 1000,
  height: 1000,
  // scene: [PlayScene],s
  scene: [Intro, PlayScene, Keyboard, CreateRoom, WaitForConnertion],
};

export default new Phaser.Game(config);
