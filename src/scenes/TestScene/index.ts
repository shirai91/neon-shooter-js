import { Ship } from "~objects/Ship";
import { Wanderer } from "~objects/Wanderer";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { Vector3, Vector2 } from "three";
import { EntityManager } from "~core/EntityManager";
import { Bullet } from "~objects/Bullet";

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
      const wanderer = new Wanderer();
      EntityManager.getInstance().add(wanderer);
      wanderer.init();
    }
    this.player = new Ship();
    EntityManager.getInstance().add(this.player);
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
