import { GameObject } from "./GameObject";
import { GameManager } from "./GameManager";
import { ENTITY_TYPE } from "~settings/entityType";
import { isColliding } from "./utils";
import { Wanderer } from "~objects/Wanderer";
import { Ship } from "~objects/Ship";

export class EntityManager {
  private static instance: EntityManager;
  player: GameObject;
  private entities: GameObject[] = [];
  private enemies: GameObject[] = [];
  private bullets: GameObject[] = [];
  private constructor() {}
  static getInstance() {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  add(object: GameObject) {
    this.entities.push(object);
    if (object.type === ENTITY_TYPE.BULLET) {
      this.bullets.push(object);
    }
    if (object.type === ENTITY_TYPE.ENEMY) {
      this.enemies.push(object);
    }
  }

  removeExpiredObjects() {
    this.entities
      .filter(object => object.isExpired)
      .forEach(object => {
        this.remove(object);
      });
    this.entities = this.entities.filter(object => !object.isExpired);
    this.bullets
      .filter(object => object.isExpired)
      .forEach(object => {
        this.remove(object);
      });
    this.bullets = this.bullets.filter(object => !object.isExpired);
    this.enemies
      .filter(object => object.isExpired)
      .forEach(object => {
        this.remove(object);
      });
    this.enemies = this.enemies.filter(object => !object.isExpired);
  }

  handleCollisionBetweenEnemyAndEnemy() {
    for (
      let currentIndex = 0;
      currentIndex < this.enemies.length - 1;
      currentIndex++
    ) {
      for (
        let nextIndex = currentIndex + 1;
        nextIndex < this.enemies.length;
        nextIndex++
      ) {
        const currentEnemy = this.enemies[currentIndex];
        const nextEnemy = this.enemies[nextIndex];
        if (isColliding(currentEnemy, nextEnemy)) {
          (<Wanderer>currentEnemy).handleCollision(nextEnemy);
          (<Wanderer>nextEnemy).handleCollision(currentEnemy);
        }
      }
    }
  }

  handleCollisionBetweenBulletAndEnemy() {
    for (
      let bulletIndex = 0;
      bulletIndex < this.bullets.length;
      bulletIndex++
    ) {
      for (let enemyIndex = 0; enemyIndex < this.enemies.length; enemyIndex++) {
        if (isColliding(this.bullets[bulletIndex], this.enemies[enemyIndex])) {
          this.bullets[bulletIndex].isExpired = true;
          this.enemies[enemyIndex].isExpired = true;
        }
      }
    }
  }

  handleCollisionBetweenPlayerAndEnemy() {
    for (let i = 0; i < this.enemies.length; i++) {
      if (isColliding(this.enemies[i], this.player)) {
        (<Ship>this.player).getHit();
        (<Wanderer>this.enemies[i]).handleCollision(this.player);
      }
    }
  }

  handleCollisions() {
    this.handleCollisionBetweenEnemyAndEnemy();
    this.handleCollisionBetweenPlayerAndEnemy();
    this.handleCollisionBetweenBulletAndEnemy();
  }

  update(delta: number) {
    this.removeExpiredObjects();
    this.handleCollisions();
    this.entities.forEach(entity => {
      entity.update(delta);
      entity.draw();
    });
  }

  clear() {
    this.entities = [];
  }

  remove(object: GameObject) {
    // this.entities = this.entities.filter(item => item !== object);
    GameManager.getInstance()
      .getScene()
      .remove(object.mesh);
  }
}
