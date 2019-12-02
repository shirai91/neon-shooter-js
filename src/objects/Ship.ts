import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { ASSETS } from "~assetList";
import { ContentManager } from "~core/ContentManager";
import { toVector3, getRandomInt, toVector2 } from "~core/utils";
import { InputManager } from "~core/InputManager";
import { Vector2, Vector3, Scene, Raycaster } from "three";
import { Bullet } from "./Bullet";
import { EntityManager } from "~core/EntityManager";

const CONTROL_KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

const SHIP_SPEED = 100;
const FIRE_RATE = 0.2;

export class Ship extends GameObject {
  cooldownRemaining = 0;
  toggleFire = true;
  raycaster = new Raycaster();
  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    var keyCode = event.keyCode;
    InputManager.getInstance().updateKeyState(keyCode, true);
  };

  handleKeyUp = (event: KeyboardEvent) => {
    var keyCode = event.keyCode;
    InputManager.getInstance().updateKeyState(keyCode, false);
  };

  handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    let canvasBounds = (<HTMLCanvasElement>GameManager.getInstance()
      .getRenderer()
      .getContext().canvas).getBoundingClientRect();
    const x =
      ((event.clientX - canvasBounds.left) /
        (canvasBounds.right - canvasBounds.left)) *
        2 -
      1;
    const y =
      -(
        (event.clientY - canvasBounds.top) /
        (canvasBounds.bottom - canvasBounds.top)
      ) *
        2 +
      1;
    InputManager.getInstance().setMousePosition(new Vector2(x, y));
  };

  loadTexture(scene: Scene) {
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

  updateMouseAim() {
    const intersect = this.raycaster.intersectObject(
      GameManager.getInstance().platform.mesh
    );
    if (intersect.length) {
      InputManager.getInstance().setMouseAim(toVector2(intersect[0].point));
    }
  }

  fireBullet(delta) {
    if (!this.toggleFire) return;

    if (
      InputManager.getInstance().getMouseAim().x === this.position.x &&
      InputManager.getInstance().getMouseAim().y === this.position.y
    ) {
      return;
    }
    if (this.cooldownRemaining <= 0) {
      const bulletDirection = new Vector2();
      bulletDirection
        .subVectors(
          InputManager.getInstance().getMouseAim(),
          toVector2(this.position)
        )
        .normalize();
      const bullet = new Bullet(toVector2(this.position), bulletDirection);
      bullet.init();
      EntityManager.getInstance().add(bullet);
      this.cooldownRemaining = FIRE_RATE;
    } else {
      this.cooldownRemaining -= delta;
    }
  }

  update(delta: number) {
    this.updateMouseAim();

    this.fireBullet(delta);

    this.velocity = this.getMovementDirection().multiplyScalar(SHIP_SPEED);

    if (this.velocity.lengthSq() > 0) {
      this.orientation = this.velocity.angle();
    }

    this.position.add(toVector3(this.velocity).multiplyScalar(delta));
    this.raycaster.setFromCamera(
      InputManager.getInstance().getMousePosition(),
      GameManager.getInstance().getCamera()
    );
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(0, 0, this.orientation);
  }
}
