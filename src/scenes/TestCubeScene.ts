import * as THREE from "three";
import Ship from "~objects/Ship";
import Wanderer from "~objects/Wanderer";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";

export class TestCubeScene extends GameObject {
  name = "testCube";
  entities: GameObject[] = [];
  player: Ship;

  init() {
    const scene = GameManager.getInstance().getScene();
    const camera = GameManager.getInstance().getCamera();
    GameManager.getInstance().setDebugStatus(true);
    GameManager.getInstance().clearScene();

    camera.lookAt(new THREE.Vector3(50, 50, 0));

    for (let index = 0; index < 50; index++) {
      const wanderer = new Wanderer();
      this.entities.push(wanderer);
    }
    this.player = new Ship();
    this.entities.push(this.player);

    this.entities.forEach(entity => {
      entity.init();
    });
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
    this.entities.forEach(entity => {
      entity.update(delta);
      entity.draw();
    });
    this.updateCamera();
  }
}
