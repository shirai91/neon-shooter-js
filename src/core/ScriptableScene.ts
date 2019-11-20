import * as THREE from "three";

export default class ScriptableScene {
  name: string;
  scene: THREE.Scene;
  init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    this.scene = scene;
  }
  update(scene: THREE.Scene, camera: THREE.PerspectiveCamera, delta: number) {}
}
