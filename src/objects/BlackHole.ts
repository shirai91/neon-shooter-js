import { GameObject } from "~core/GameObject";
import { ASSETS } from "~settings/assetList";
import { ContentManager } from "~core/ContentManager";
import { GameManager } from "~core/GameManager";
import { Vector2, Color } from "three";
import { EntityManager } from "~core/EntityManager";
import { toVector2, getRandomFloat, getRandomInt } from "~core/utils";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";
import * as THREE from "three";
import { PartialEffect } from "./PartialEffect";
import { Ship } from "./Ship";

const AREA_OF_EFFECT = 50;
const MAX_HP = 10;
const CREATE_PARTIAL_TIME = 0.1;

export class BlackHole extends GameObject {
  hitPoint = MAX_HP;
  radius = 7;
  remainingTimeForCreatePartial = CREATE_PARTIAL_TIME;
  constructor(position: Vector2) {
    super();
    this.position.set(position.x, position.y, 0);
  }

  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);
    this.velocity = new Vector2(0, 0);
  }

  loadTexture(scene: THREE.Scene) {
    this.setScale(10, 10);
    const blackHoleTexture = ContentManager.getInstance().getAsset(
      ASSETS.BLACK_HOLE.name
    );
    this.setImage(blackHoleTexture);
  }

  getHit(actor: GameObject) {
    //Damage calculation phase
    if (actor instanceof Bullet) {
      this.hitPoint -= 1;
      EntityManager.getInstance().createExplosion(toVector2(this.position), 35, true);
    }

    // Death calculation phase
    if (this.hitPoint <= 0) {
      this.isExpired = true;
      EntityManager.getInstance().createExplosion(toVector2(this.position), 80);
    }
  }

  createForceOnNearbyEntities() {
    const nearbyEntities = EntityManager.getInstance().getNearbyEntities(
      toVector2(this.position),
      AREA_OF_EFFECT
    );

    nearbyEntities.forEach(entity => {
      if (entity instanceof BlackHole) {
        return;
      }
      if (entity instanceof Enemy && !entity.isActive) {
        return;
      }
      if (entity instanceof Bullet) {
        const velocityAdjustment = toVector2(entity.position)
          .sub(toVector2(this.position))
          .multiplyScalar(0.3);
        entity.velocity.add(velocityAdjustment);
        return;
      }

      if (entity instanceof Ship) {
        const velocityAdjustment = toVector2(entity.position)
          .sub(toVector2(this.position))
          .multiplyScalar(0.6);
        entity.force.add(velocityAdjustment);
        return;
      }


      if (entity instanceof PartialEffect) {
        if ((<PartialEffect>entity).ignoreGravity) {
          return;
        }

        const dPos = this.position.clone().sub(entity.position);
        const distance = dPos.length();
        const n = dPos.divideScalar(distance);
        const diff = n.divideScalar(distance * distance + 700).multiplyScalar(10000)
        entity.velocity.add(toVector2(diff));

        if (distance < 30) {
          const diff = (new Vector2(n.y, -n.x)).divideScalar(distance + 100).multiplyScalar(45);
          entity.velocity.add(diff);
        }
        return;
      }
      const directionPosition = toVector2(this.position).sub(
        toVector2(entity.position)
      );
      const length = directionPosition.length();
      const multiple = THREE.Math.lerp(2, 0, length / AREA_OF_EFFECT);
      entity.velocity.add(directionPosition.multiplyScalar(multiple));
    });
  }

  productPartial(delta: number) {
    this.remainingTimeForCreatePartial -= delta;

    if (this.remainingTimeForCreatePartial < 0) {
      this.remainingTimeForCreatePartial += CREATE_PARTIAL_TIME;

      const position = this.position.clone().addScalar(getRandomFloat(1, 5));
      const randomDeg = (Math.PI * 2) / getRandomInt(1, 360);
      const direction = new Vector2(Math.cos(randomDeg), Math.sin(randomDeg))
      const randColor = "#32a852";
      const partial = new PartialEffect(toVector2(position), direction, new Color(randColor), 1.5);
      EntityManager.getInstance().add(partial);
      partial.init();
    }
  }

  update(delta: number) {
    this.createForceOnNearbyEntities();

    this.productPartial(delta);
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, 0);
  }
}
