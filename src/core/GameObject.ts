import * as THREE from "three";
import ScriptableScene from "~core/ScriptableScene";
import { uuid } from "./uuid";

export default class GameObject {
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  uniqueName = uuid(15);
  name: String = null;
  position: THREE.Vector3;
  direction = new THREE.Vector2(0, 0);
  velocity: number;
  acceleration: number;
  radius: number;
  orientation: number;
  isExpired: boolean;
  loader = new THREE.TextureLoader();
  speed = new THREE.Vector2(0, 0);

  init(scene: ScriptableScene): void {}
  update(scene: THREE.Scene): void {}
}
