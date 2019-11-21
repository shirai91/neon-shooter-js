import { TextureLoader, Texture } from "three";

export class ContentManager {
  private static instance: ContentManager;
  private loader = new TextureLoader();
  private assets: { [name: string]: Texture } = {};
  private constructor() {}
  static getInstance() {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  loadContent(name: string, path: string) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        texture => {
          this.assets[name] = texture;
          resolve(texture);
        },
        undefined,
        ex => {
          reject(ex);
        }
      );
    });
  }

  getAsset(name: string): THREE.Texture {
    return this.assets[name];
  }
}
