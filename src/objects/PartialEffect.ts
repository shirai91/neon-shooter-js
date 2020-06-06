import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { Scene, Vector2 } from "three";
import { ContentManager } from "~core/ContentManager";
import { ASSETS } from "~settings/assetList";
import { toVector3 } from "~core/utils";
import { EntityManager } from "~core/EntityManager";

const VELOCITY = 200;
const EXPIRE_TIME = 3;

export class PartialEffect extends GameObject {
  remainingLifeTime = EXPIRE_TIME;
  radius = 7;
  /**
   *
   * @param position
   * @param direction a normalized Vector2,
   */
  constructor(position: Vector2, direction: Vector2) {
    super();
    this.canExpire = true;
    this.position = toVector3(position);
    this.velocity.set(direction.x * VELOCITY, direction.y * VELOCITY);
  }

  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);
  }

  neverExpire() {
    this.canExpire = false;
  }

  loadTexture(scene: Scene) {
    this.setScale(7, 3);
    const laserTexture = ContentManager.getInstance().getAsset(
      ASSETS.LASER.name
    );
    this.setImage(laserTexture);
  }

  updateExpireTime(delta: number) {
    if (!this.canExpire) return;
    if (this.remainingLifeTime <= 0) {
      this.isExpired = true;
    } else {
      this.remainingLifeTime -= delta;
    }
  }

  update(delta: number) {
    if (this.velocity.lengthSq() > 0) {
      this.orientation = this.velocity.angle();
    }
    this.position.add(toVector3(this.velocity).multiplyScalar(delta));

    this.updateExpireTime(delta);
  }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(0, 0, this.orientation);
  }
}
