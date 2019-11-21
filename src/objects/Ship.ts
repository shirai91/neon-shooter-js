import * as THREE from "three";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { ASSETS } from "~assetList";
import { ContentManager } from "~core/ContentManager";

const CONTROL_KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

const SHIP_SPEED = 2;
const ROTATION_VALUE = Math.PI / 2;

export default class Ship extends GameObject {
  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);

    window.addEventListener("keydown", this.onDocumentKeyDown);
    window.addEventListener("keyup", this.onDocumentKeyUp);
  }

  onDocumentKeyDown = (event: KeyboardEvent) => {
    if (!this.mesh) return;

    var keyCode = event.keyCode;
    if (keyCode === CONTROL_KEYS.UP) {
      this.speed.y = SHIP_SPEED;
      this.direction.y = 1;
    } else if (keyCode == CONTROL_KEYS.DOWN) {
      this.speed.y = -SHIP_SPEED;
      this.direction.y = -1;
    } else if (keyCode == CONTROL_KEYS.LEFT) {
      this.speed.x = -SHIP_SPEED;
      this.direction.x = -1;
    } else if (keyCode == CONTROL_KEYS.RIGHT) {
      this.speed.x = SHIP_SPEED;
      this.direction.x = 1;
    }
  };

  onDocumentKeyUp = (event: KeyboardEvent) => {
    if (!this.mesh) return;

    var keyCode = event.keyCode;
    if (keyCode === CONTROL_KEYS.UP) {
      this.speed.y = 0;
      this.direction.y = 0;
    } else if (keyCode == CONTROL_KEYS.DOWN) {
      this.speed.y = 0;
      this.direction.y = 0;
    } else if (keyCode == CONTROL_KEYS.LEFT) {
      this.speed.x = 0;
      this.direction.x = 0;
    } else if (keyCode == CONTROL_KEYS.RIGHT) {
      this.speed.x = 0;
      this.direction.x = 0;
    }
  };

  loadTexture(scene: THREE.Scene) {
    this.setScale(10, 10);
    const shipTexture = ContentManager.getInstance().getAsset(ASSETS.SHIP.name);
    this.setImage(shipTexture);
  }

  update(delta: number) {
    this.position.add(new THREE.Vector3(this.speed.x, this.speed.y, 0));
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(0, 0, this.direction.angle());
  }
}
