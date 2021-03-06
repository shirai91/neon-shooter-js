import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { ASSETS } from "~settings/assetList";
import { ContentManager } from "~core/ContentManager";
import { toVector3, getRandomInt, toVector2 } from "~core/utils";
import { InputManager } from "~core/InputManager";
import { Vector2, Vector3, Scene, Raycaster } from "three";
import { Bullet } from "./Bullet";
import { EntityManager } from "~core/EntityManager";
import Survival from "~scenes/Survival";
import { GameEngine } from "~core/GameEngine";
import { GameSubscription } from "~core/GameSubscriptions";

const CONTROL_KEYS = {
  UP: 87,
  DOWN: 83,
  LEFT: 65,
  RIGHT: 68,
};

const SHIP_SPEED = 100;
const FIRE_RATE = 0.2;

export class Ship extends GameObject {
  cooldownRemaining = 0;
  toggleFire = true;
  bulletPerShot = 1;
  raycaster = new Raycaster();
  isActive = true;
  force: Vector2 = new Vector2(0, 0);

  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  getHit() {
    if (this.isActive === true) {
      this.isActive = false;
      GameSubscription.emit("gameover");
      EntityManager.getInstance().createExplosion(toVector2(this.position), 200);
    }
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

  createBullet() {
    const bulletDirection = new Vector2();
    bulletDirection
      .subVectors(
        InputManager.getInstance().getMouseAim(),
        toVector2(this.position)
      )
      .normalize();
    const bulletPosition = toVector2(this.position);
    bulletPosition.add(
      new Vector2(bulletDirection.x * 8, bulletDirection.y * 8)
    );
    const bullet = new Bullet(bulletPosition, bulletDirection);
    bullet.init();
    EntityManager.getInstance().add(bullet);

    const bullet2Angle = bulletDirection.clone().angle() - Math.PI / 60;
    const bullet2Direction = new Vector2(Math.cos(bullet2Angle), Math.sin(bullet2Angle));

    const bullet2Position = toVector2(this.position);
    bullet2Position.add(
      new Vector2(bullet2Direction.x * 8, bullet2Direction.y * 8)
    );
    const bullet2 = new Bullet(bullet2Position, bullet2Direction);
    bullet2.init();
    EntityManager.getInstance().add(bullet2);

    const bullet3Angle = bulletDirection.clone().angle() + Math.PI / 60;
    const bullet3Direction = new Vector2(Math.cos(bullet3Angle), Math.sin(bullet3Angle));

    const bullet3Position = toVector2(this.position);
    bullet3Position.add(
      new Vector2(bullet3Direction.x * 8, bullet3Direction.y * 8)
    );
    const bullet3 = new Bullet(bullet3Position, bullet3Direction);
    bullet3.init();
    EntityManager.getInstance().add(bullet3);
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
      this.createBullet();
      this.cooldownRemaining = FIRE_RATE;
    } else {
      this.cooldownRemaining -= delta;
    }
  }

  update(delta: number) {
    if (!this.isActive) {
      return;
    }
    this.updateMouseAim();

    this.fireBullet(delta);

    this.force.divideScalar(1.5);
    this.velocity = this.getMovementDirection().multiplyScalar(SHIP_SPEED).sub(this.force);


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
    if (!this.isActive) {
      this.mesh.visible = false;
      return;
    }
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(0, 0, this.orientation);
  }
}
