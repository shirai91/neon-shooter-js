import { GameObject } from "~core/GameObject";
import { ASSETS } from "~settings/assetList";
import { ContentManager } from "~core/ContentManager";
import { GameManager } from "~core/GameManager";
import { Vector2 } from "three";
import { EntityManager } from "~core/EntityManager";
import { toVector2 } from "~core/utils";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";

export class BlackHole extends GameObject {
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

  update() {
    const nearbyEntities = EntityManager.getInstance().getNearbyEntities(
      toVector2(this.position),
      50
    );

    nearbyEntities.forEach(entity => {
      if (entity instanceof Enemy) {
        return;
      }
      if (entity instanceof Bullet) {
        const velocityAdjustment = toVector2(entity.position)
          .sub(toVector2(this.position))
          .multiplyScalar(0.3);
        entity.velocity.add(velocityAdjustment);
      } else {
      }
    });
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, 0);
  }
}
