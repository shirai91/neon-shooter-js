import ASSETS from "../assets";
import SCENES from "./list";

export default class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: SCENES.BOOT_SCENE
    });
  }

  preload(): void {
    // set the background, create the loading and progress bar
    this.cameras.main.setBackgroundColor(0x000000);
    this.createLoadingGraphics();

    // pass value to change the loading bar fill
    this.load.on(
      "progress",
      function(value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x88e453, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    // delete bar graphics, when loading complete
    this.load.on(
      "complete",
      function() {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );

    // load our assets
    this.load.image(ASSETS.BLACKHOLE, "assets/Black Hole.png");
    this.load.image(ASSETS.LASER, "assets/Laser.png");
    this.load.image(ASSETS.PLAYER, "assets/Player.png");
    this.load.image(ASSETS.SEEKER, "assets/Seeker.png");
    this.load.spritesheet(ASSETS.WANDERER, "assets/Wanderer.png", {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.bitmapFont(
      "font",
      "assets/font/font.png",
      "assets/font/font.fnt"
    );
  }

  update(): void {
    this.scene.start(SCENES.MENU_SCENE);
  }

  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xffffff, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
