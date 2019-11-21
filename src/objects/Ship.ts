import * as THREE from "three";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { ASSETS } from "~assetList";
import { ContentManager } from "~core/ContentManager";
import { InputManager } from "~core/InputManager";
import { Vector2, Vector3 } from "three";

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
    var keyCode = event.keyCode;
    InputManager.getInstance().updateKeyState(keyCode, true);
  };

  onDocumentKeyUp = (event: KeyboardEvent) => {
    var keyCode = event.keyCode;
    InputManager.getInstance().updateKeyState(keyCode, false);
  };

  loadTexture(scene: THREE.Scene) {
    this.setScale(10, 10);
    const shipTexture = ContentManager.getInstance().getAsset(ASSETS.SHIP.name);
    this.setImage(shipTexture);
  }

  getMovementDirection() {
    const Input = InputManager.getInstance();

    const direction = new Vector2();

    if (Input.isKeyDown(CONTROL_KEYS.UP)) {
      direction.y += 1;
    }
    if (Input.isKeyDown(CONTROL_KEYS.DOWN)) {
      direction.y -= 1;
    }
    if (Input.isKeyDown(CONTROL_KEYS.LEFT)) {
      direction.x -= 1;
    }
    if (Input.isKeyDown(CONTROL_KEYS.RIGHT)) {
      direction.x += 1;
    }
    if (direction.lengthSq() > 1) {
      direction.normalize();
    }
    return direction;
  }

  update(delta: number) {
    this.velocity = this.getMovementDirection().multiplyScalar(SHIP_SPEED);
    if (this.velocity.lengthSq() > 0) {
      this.orientation = this.velocity.angle();
    }
    this.position.add(new Vector3(this.velocity.x, this.velocity.y, 0));
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(0, 0, this.orientation);
  }
}
