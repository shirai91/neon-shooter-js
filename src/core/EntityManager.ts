import { GameObject } from "./GameObject";
import { GameManager } from "./GameManager";

export class EntityManager {
  private static instance: EntityManager;
  private entities: GameObject[] = [];
  private constructor() {}
  static getInstance() {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  add(object: GameObject) {
    this.entities.push(object);
  }

  update(delta: number) {
    this.entities.forEach(entity => {
      entity.update(delta);
      entity.draw();
    });
  }

  clear() {
    this.entities = [];
  }

  remove(object: GameObject) {
    this.entities = this.entities.filter(item => item !== object);
    GameManager.getInstance()
      .getScene()
      .remove(object.mesh);
  }
}
