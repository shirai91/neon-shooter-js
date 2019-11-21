import {
  Vector2,
  Vector3,
  Texture,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  PlaneGeometry
} from "three";
import { GameManager } from "./GameManager";

export abstract class GameObject {
  geometry = new PlaneGeometry(0, 0, 0);
  mesh: Mesh = new Mesh(this.geometry, new MeshBasicMaterial());
  uniqueName = this.mesh.uuid;
  name: String = null;
  position = new Vector3();
  direction = new Vector2(0, 0);
  velocity: number = 0;
  acceleration: number = 0;
  radius: number = 0;
  orientation: number;
  isExpired: boolean = false;
  loader = new TextureLoader();
  speed = new Vector2(0, 0);

  constructor() {
    const scene = GameManager.getInstance().getScene();
    scene.add(this.mesh);
  }

  setScale(width, height) {
    this.geometry.scale(width, height, 0);
  }

  setImage(texture: Texture) {
    (<MeshBasicMaterial>this.mesh.material).map = texture;
    (<MeshBasicMaterial>this.mesh.material).needsUpdate = true;
  }

  init(): void {}

  update(delta: number): void {}

  draw(): void {}
}
