import * as THREE from "three";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { ASSETS } from "~settings/assetList";
import { ContentManager } from "~core/ContentManager";
import {
  toVector3,
  getRandomInt,
  toVector2,
  getRandomColor
} from "~core/utils";
import { InputManager } from "~core/InputManager";
import { Vector2, Vector3, Geometry } from "three";
import { Enemy } from "./Enemy";

const WANDERER_SPEED = 50;
const ROTATION_VALUE = Math.PI / 40;
const CHANGE_DIRECTION_THRESHOLD = 0.5;

export class Wanderer extends Enemy {
  destination: Vector2;
  count = 0;
  debugDirectionLine: THREE.Line;
  isCanChangeDirection = true;
  changeDirectionThresholdRemaining = CHANGE_DIRECTION_THRESHOLD;
  radius = 10;

  constructor(position: Vector2) {
    super();
    this.position.set(position.x, position.y, 0);
  }

  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);

    this.destination = new Vector2(this.position.x, this.position.y);
    this.velocity = new Vector2(0, 0);

    if (GameManager.getInstance().getDebugStatus() === true) {
      this.initDirectionLine();
    }
  }

  getHit(actor: GameObject) {
    this.isExpired = true;
  }

  initDirectionLine() {
    const material = new THREE.LineBasicMaterial({ color: getRandomColor() });
    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(this.position.x, this.position.y, 0)
    );
    geometry.vertices.push(
      new THREE.Vector3(this.destination.x, this.destination.y, 0)
    );
    this.debugDirectionLine = new THREE.Line(geometry, material);
    geometry.verticesNeedUpdate = true;

    GameManager.getInstance()
      .getScene()
      .add(this.debugDirectionLine);
  }

  loadTexture(scene: THREE.Scene) {
    this.setScale(10, 10);
    const wandererTexture = ContentManager.getInstance().getAsset(
      ASSETS.WANDERER.name
    );
    this.setImage(wandererTexture);
  }

  handleCollision(otherEnemy: GameObject) {
    const direction = toVector2(this.position).sub(
      toVector2(otherEnemy.position)
    );
    direction.divideScalar(direction.lengthSq() + 1).multiplyScalar(10);
    this.velocity.add(direction);
  }

  getNewDestination() {
    return new Vector2(getRandomInt(-300, 300), getRandomInt(-300, 300));
  }

  changeDestinationWhenReachOldDestination() {
    if (!this.isCanChangeDirection) {
      return;
    }
    if (this.position.distanceTo(toVector3(this.destination)) < 1) {
      const newDestination = this.getNewDestination();
      this.destination.set(newDestination.x, newDestination.y);
      this.isCanChangeDirection = false;
      this.changeDirectionThresholdRemaining = this.changeDirectionThresholdTime;
      this.velocity
        .subVectors(this.destination, toVector2(this.position))
        .normalize()
        .multiplyScalar(WANDERER_SPEED);
    }
  }

  processingAI() {
    this.changeDestinationWhenReachOldDestination();
  }

  updateDebugLine() {
    (<Geometry>this.debugDirectionLine.geometry).vertices[0].set(
      this.position.x,
      this.position.y,
      0
    );
    (<Geometry>this.debugDirectionLine.geometry).vertices[1].set(
      this.destination.x,
      this.destination.y,
      0
    );
    (<Geometry>this.debugDirectionLine.geometry).verticesNeedUpdate = true;
  }

  calculateThresholdTime(delta: number) {
    if (this.changeDirectionThresholdRemaining < 0) {
      this.isCanChangeDirection = true;
    } else {
      this.changeDirectionThresholdRemaining -= delta;
    }
  }

  update(delta: number) {
    this.calculateThresholdTime(delta);
    this.processingAI();

    this.position
      .add(toVector3(this.velocity).multiplyScalar(delta))
      .addScalar(this.acceleration);
  }

  draw() {
    this.mesh.rotation.z += ROTATION_VALUE;
    this.mesh.position.set(this.position.x, this.position.y, 0);

    if (GameManager.getInstance().getDebugStatus() === true) {
      this.updateDebugLine();
    }
  }
}
