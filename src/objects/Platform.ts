import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { Scene, Vector2, MeshBasicMaterial, Color, RepeatWrapping } from "three";
import { ContentManager } from "~core/ContentManager";
import { ASSETS } from "~settings/assetList";
import { toVector3 } from "~core/utils";

export class Platform extends GameObject {
  init() {
    const scene = GameManager.getInstance().getScene();
    this.position.set(this.position.x, this.position.y, -0.1);
    // (<MeshBasicMaterial>this.mesh.material).color = new Color("black");

    this.loadTexture(scene);
    this.mesh.name = "platform";
  }

  loadTexture(scene: Scene) {
    this.setScale(5000, 5000);
    const spaceTexture = ContentManager.getInstance().getAsset(
      ASSETS.SPACE.name
    );
    spaceTexture.wrapS = RepeatWrapping;
    spaceTexture.wrapT = RepeatWrapping;
    spaceTexture.repeat.set(30, 30);
    this.setImage(spaceTexture);
    scene.add(this.mesh);
  }

  update(delta: number) { }

  draw() {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.set(0, 0, this.orientation);
  }
}
