import SCENES from "./list";

export default class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: SCENES.MENU_SCENE
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.startKey.isDown = false;
  }

  create(): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 150,
        this.sys.canvas.height / 2,
        "font",
        "PRESS SPACE TO PLAY",
        30
      )
    );

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 320,
        this.sys.canvas.height / 2 - 100,
        "font",
        "NEON SHOOTER",
        80
      )
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      console.log("game is starting");
      this.scene.start(SCENES.GAME_SCENE);
    }
  }
}
