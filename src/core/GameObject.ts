import * as THREE from "three";
import ScriptableScene from "~core/ScriptableScene";
import { uuid } from "./uuid";

export default class GameObject {
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  uniqueName = uuid(15);
  name: String = null;
  position = new THREE.Vector3();
  direction = new THREE.Vector2(0, 0);
  velocity: number = 0;
  acceleration: number = 0;
  radius: number = 0;
  orientation: number;
  isExpired: boolean = false;
  loader = new THREE.TextureLoader();
  speed = new THREE.Vector2(0, 0);

  init(scene: ScriptableScene): void {}

  update(scene: THREE.Scene, delta: number): void {}

  draw(scene: THREE.Scene, delta: number): void {}
}
