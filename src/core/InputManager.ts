import { TextureLoader, Texture, Vector2 } from "three";

export class InputManager {
  private static instance: InputManager;
  private keyState: { [keyCode: number]: boolean } = {};
  private mousePosition: Vector2 = new Vector2(0, 0);
  private mouseAim: Vector2 = new Vector2(0, 100);
  private constructor() {}

  static getInstance() {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  updateKeyState(keyCode: number, isKeyDown: boolean) {
    this.keyState[keyCode] = isKeyDown;
  }

  isKeyDown(name: number): boolean {
    return this.keyState[name];
  }

  getMousePosition(): Vector2 {
    return this.mousePosition;
  }

  setMousePosition(position: Vector2) {
    this.mousePosition.set(position.x, position.y);
  }

  getMouseAim(): Vector2 {
    return this.mouseAim;
  }

  setMouseAim(position: Vector2) {
    this.mouseAim.set(position.x, position.y);
  }
}
