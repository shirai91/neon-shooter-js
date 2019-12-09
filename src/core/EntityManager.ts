import { GameObject } from "./GameObject";
import { GameManager } from "./GameManager";
import { isColliding, toVector2 } from "./utils";
import { Wanderer } from "~objects/Wanderer";
import { Ship } from "~objects/Ship";
import { Bullet } from "~objects/Bullet";
import { Enemy } from "~objects/Enemy";
import { Vector2 } from "three";
import { BlackHole } from "~objects/BlackHole";

export class EntityManager {
  private static instance: EntityManager;
  player: GameObject;
  private entities: GameObject[] = [];
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];
  private blackHoles: BlackHole[] = [];
  private constructor() { }
  static getInstance() {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  add(object: GameObject) {
    this.entities.push(object);
    if (object instanceof Bullet) {
      this.bullets.push(object);
    }
    if (object instanceof Enemy) {
      this.enemies.push(object);
    }

    if (object instanceof BlackHole) {
      this.blackHoles.push(object);
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

  handleCollisionForBlackhole() {
    this.blackHoles.forEach(blackhole => {
      this.enemies.forEach(enemy => {
        if (isColliding(blackhole, enemy)) {
          enemy.getHit(blackhole);
        }
      });
    });
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
          (<Enemy>currentEnemy).handleCollision(nextEnemy);
          (<Enemy>nextEnemy).handleCollision(currentEnemy);
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
        this.enemies[i].getHit(this.player);
        (<Ship>this.player).getHit();
        (<Enemy>this.enemies[i]).handleCollision(this.player);
      }
    }
  }

  handleCollisions() {
    this.handleCollisionBetweenEnemyAndEnemy();
    this.handleCollisionBetweenPlayerAndEnemy();
    this.handleCollisionBetweenBulletAndEnemy();
    this.handleCollisionForBlackhole();
  }

  getNearbyEntities(position: Vector2, radius: number) {
    return this.entities.filter(entity => {
      const squaredDistance = position.distanceToSquared(
        toVector2(entity.position)
      );
      if (squaredDistance > radius * radius) {
        return false;
      } else {
        return true;
      }
    });
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
    GameManager.getInstance()
      .getScene()
      .remove(object.mesh);
  }
}
