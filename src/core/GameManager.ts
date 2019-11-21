import { PerspectiveCamera, Scene } from "three";

export class GameManager {
  private static instance: GameManager;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private constructor() {}
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  setCamera(camera: PerspectiveCamera) {
    this.camera = camera;
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  setScene(scene: Scene) {
    this.scene = scene;
  }

  getScene(): Scene {
    return this.scene;
  }

  clearScene() {
    if (!this.scene) return;
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }
}
