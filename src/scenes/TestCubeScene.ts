import * as THREE from "three";
import Ship from "~objects/Ship";
import Wanderer from "~objects/Wanderer"
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";

export class TestCubeScene extends GameObject {
  name = "testCube";
  entities: GameObject[] = [];

  init() {
    const scene = GameManager.getInstance().getScene();
    const camera = GameManager.getInstance().getCamera();
    GameManager.getInstance().clearScene();

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const wanderer = new Wanderer;
    const ship = new Ship();
    this.entities.push(ship);
    this.entities.push(wanderer);

    this.entities.forEach(entity => {
      entity.init();
    });
  }

  update(delta: number) {
    this.entities.forEach(entity => {
      entity.update(delta);
      entity.draw();
    });
  }
}