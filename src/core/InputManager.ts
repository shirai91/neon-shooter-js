import { TextureLoader, Texture } from "three";

export class InputManager {
  private static instance: InputManager;
  private keyState: { [keyCode: number]: boolean } = {};
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
}
