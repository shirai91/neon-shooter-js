import * as THREE from "three";
import { Vector2, Vector3, Geometry } from "three";
import { GameObject } from "~core/GameObject";

const WANDERER_SPEED = 50;
const ROTATION_VALUE = Math.PI / 40;

export abstract class Enemy extends GameObject {
  destination: Vector2;
  count = 0;
  debugDirectionLine: THREE.Line;
  isCanChangeDirection = true;
  changeDirectionThresholdTime = 0.5;
  changeDirectionThresholdRemaining = 0.5;
  radius = 10;
  abstract handleCollision(otherEnemy: GameObject): void;
  abstract getHit(actor: GameObject): void;
}
