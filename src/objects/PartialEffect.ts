import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { Scene, Vector2, Color } from "three";
import { ContentManager } from "~core/ContentManager";
import { ASSETS } from "~settings/assetList";
import { toVector3, getRandomFloat, HSVToColor, getRandomInt } from "~core/utils";
import { EntityManager } from "~core/EntityManager";

export class PartialEffect extends GameObject {
  remainingLifeTime = 1;
  baseColor: Color;
  radius = 5;
  /**
   *
   * @param position
   * @param direction a normalized Vector2,
   */
  constructor(position: Vector2, direction: Vector2, color: Color) {
    super();
    this.canExpire = true;
    this.position = toVector3(position);
    const velocity = getRandomInt(50, 150)
    this.velocity.set(direction.x * velocity, direction.y * velocity);
    this.baseColor = color;
  }

  init() {
    const scene = GameManager.getInstance().getScene();
    this.loadTexture(scene);
  }

  neverExpire() {
    this.canExpire = false;
  }

  loadTexture(scene: Scene) {
    const height = getRandomFloat(1,6);
    this.setScale(height, 1.5);
    const laserTexture = ContentManager.getInstance().getAsset(
      ASSETS.LASER.name
    );
    this.setImage(laserTexture);
    const hue2 = getRandomFloat(0,2)/6;
    const color2 = HSVToColor(hue2, 0.5, 1);
    const color = color2.lerp(this.baseColor, Math.random());
    this.setHexColor(color.getHex());
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
