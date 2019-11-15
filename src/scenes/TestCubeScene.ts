import * as THREE from "three";
import GameScene from "./GameScene";

export default class TestCubeScene implements GameScene {
  name = "testCube";
  constructor() {}

  init(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    const geometry = new THREE.BoxBufferGeometry(3, 3, 3);
    const material = new THREE.MeshBasicMaterial({ color: "green" });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.lookAt(mesh.position);
  }
}
