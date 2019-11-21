import * as THREE from "three";
import ScriptableScene from "~core/ScriptableScene";
import Ship from "~objects/Ship";
import GameObject from "~core/GameObject";

export default class TestCubeScene extends ScriptableScene {
  name = "testCube";
  entities: GameObject[] = [];

  constructor() {
    super();
  }

  init(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    super.init(scene, camera);
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const ship = new Ship();
    this.entities.push(ship);

    this.entities.forEach(entity => {
      entity.init(this);
    });
  }

  update(scene: THREE.Scene, camera: THREE.PerspectiveCamera, delta: number) {
    this.entities.forEach(entity => {
      entity.update(scene, delta);
      entity.draw(scene, delta);
    });
  }
}
