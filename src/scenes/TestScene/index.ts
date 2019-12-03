import { Ship } from "~objects/Ship";
import { Wanderer } from "~objects/Wanderer";
import { Seeker } from "~objects/Seeker";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { Vector3, Vector2 } from "three";
import { EntityManager } from "~core/EntityManager";
import { BlackHole } from "~objects/BlackHole";
import { getRandomInt } from "~core/utils";

export default class TestScene extends GameObject {
  name = "testCube";
  player: Ship;

  init() {
    const scene = GameManager.getInstance().getScene();
    const camera = GameManager.getInstance().getCamera();
    GameManager.getInstance().setDebugStatus(false);
    GameManager.getInstance().clearScene();

    camera.lookAt(new Vector3(50, 50, 0));

    for (let index = 0; index < 50; index++) {
      const randomX = getRandomInt(-200, 200);
      const randomY = getRandomInt(-200, 200);
      const wanderer = new Wanderer(new Vector2(randomX, randomY));
      EntityManager.getInstance().add(wanderer);
      wanderer.init();
    }
    for (let index = 0; index < 10; index++) {
      const randomX = getRandomInt(-200, 200);
      const randomY = getRandomInt(-200, 200);
      const seeker = new Seeker(new Vector2(randomX, randomY));
      EntityManager.getInstance().add(seeker);
      seeker.init();
    }
    for (let index = 0; index < 5; index++) {
      const randomX = getRandomInt(-200, 200);
      const randomY = getRandomInt(-200, 200);
      const blackhole = new BlackHole(new Vector2(randomX, randomY));
      EntityManager.getInstance().add(blackhole);
      blackhole.init();
    }
    this.player = new Ship();
    EntityManager.getInstance().add(this.player);
    EntityManager.getInstance().player = this.player;
    this.player.init();
  }

  updateCamera() {
    GameManager.getInstance()
      .getCamera()
      .position.set(
        this.player.position.x,
        this.player.position.y,
        GameManager.getInstance().getCamera().position.z
      );
    GameManager.getInstance()
      .getCamera()
      .lookAt(this.player.position);
  }

  update(delta: number) {
    EntityManager.getInstance().update(delta);
    this.updateCamera();
  }
}
