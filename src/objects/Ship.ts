import GameObject from "~core/GameObject";
import * as THREE from "three";
import ScriptableScene from "~core/ScriptableScene";

const CONTROL_KEYS = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39
};

const SHIP_SPEED = 0.5;
const ROTATION_VALUE = Math.PI / 2;

export default class Ship extends GameObject {
  init(scene: ScriptableScene) {
    this.loadTexture(scene);
    window.addEventListener("keydown", this.onDocumentKeyDown);
    window.addEventListener("keyup", this.onDocumentKeyUp);
  }

  onDocumentKeyDown = (event: KeyboardEvent) => {
    if (!this.mesh) return;

    var keyCode = event.keyCode;
    if (keyCode === CONTROL_KEYS.UP) {
      this.speed.y = SHIP_SPEED;
      this.direction.y = 1;
    } else if (keyCode == CONTROL_KEYS.DOWN) {
      this.speed.y = -SHIP_SPEED;
      this.direction.y = -1;
    } else if (keyCode == CONTROL_KEYS.LEFT) {
      this.speed.x = -SHIP_SPEED;
      this.direction.x = -1;
    } else if (keyCode == CONTROL_KEYS.RIGHT) {
      this.speed.x = SHIP_SPEED;
      this.direction.x = 1;
    }
  };

  onDocumentKeyUp = (event: KeyboardEvent) => {
    if (!this.mesh) return;

    var keyCode = event.keyCode;
    if (keyCode === CONTROL_KEYS.UP) {
      this.speed.y = 0;
      this.direction.y = 0;
    } else if (keyCode == CONTROL_KEYS.DOWN) {
      this.speed.y = 0;
      this.direction.y = 0;
    } else if (keyCode == CONTROL_KEYS.LEFT) {
      this.speed.x = 0;
      this.direction.x = 0;
    } else if (keyCode == CONTROL_KEYS.RIGHT) {
      this.speed.x = 0;
      this.direction.x = 0;
    }
  };

  loadTexture(scene) {
    this.loader.load("assets/Player.png", texture => {
      this.material = new THREE.MeshBasicMaterial({
        map: texture
      });
      this.geometry = new THREE.PlaneGeometry(1, 1, 0);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.position = new THREE.Vector3(0, 0, 0);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);

      scene.scene.add(this.mesh);
    });
  }

  update(scene: THREE.Scene) {
    if (this.mesh) {
      this.mesh.position.add(new THREE.Vector3(this.speed.x, this.speed.y, 0));
      this.mesh.rotation.set(0, 0, this.direction.angle());
    }
  }
}
