import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Platform } from "~objects/Platform";

export class GameManager {
  private static instance: GameManager;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private debug: boolean = false;
  private renderer: WebGLRenderer;
  platform: Platform;
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
    this.platform = new Platform();
    this.platform.init();
  }

  getDebugStatus(): boolean {
    return this.debug;
  }

  setDebugStatus(status: boolean) {
    this.debug = status;
  }

  getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  setRenderer(renderer: WebGLRenderer) {
    this.renderer = renderer;
  }
}
