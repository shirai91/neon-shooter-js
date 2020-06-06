import { GameObject } from "~core/GameObject";
import { ASSETS } from "~settings/assetList";
import { ContentManager } from "~core/ContentManager";
import { GameManager } from "~core/GameManager";
import { Vector2 } from "three";
import { EntityManager } from "~core/EntityManager";
import { toVector2 } from "~core/utils";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";
import * as THREE from "three";

const AREA_OF_EFFECT = 50;
const MAX_HP = 10;

export class BlackHole extends GameObject {
  hitPoint = MAX_HP;
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
    if(actor instanceof Bullet) {
      this.hitPoint -= 1;
    }

    // Death calculation phase
    if(!this.hitPoint) {
      this.isExpired = true;
      EntityManager.getInstance().createExplosion(toVector2(this.position), 20);
    }
  }

  update() {
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
      } else {
        const directionPosition = toVector2(this.position).sub(
          toVector2(entity.position)
        );
        const length = directionPosition.length();
        const multiple = THREE.Math.lerp(2, 0, length / AREA_OF_EFFECT);
        entity.velocity.add(directionPosition.multiplyScalar(multiple));
      }
    });
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, 0);
  }
}
