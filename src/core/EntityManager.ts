import { GameObject } from "./GameObject";
import { GameManager } from "./GameManager";
import { isColliding, toVector2,getRandomInt, getRandomColor } from "./utils";
import { Wanderer } from "~objects/Wanderer";
import { Ship } from "~objects/Ship";
import { Bullet } from "~objects/Bullet";
import { Enemy } from "~objects/Enemy";
import { Vector2, Color } from "three";
import { BlackHole } from "~objects/BlackHole";
import { PartialEffect } from "~objects/PartialEffect";

export class EntityManager {
  private static instance: EntityManager;
  player: GameObject;
  private entities: GameObject[] = [];
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];
  private blackHoles: BlackHole[] = [];
  private partialEffects: PartialEffect[] = [];
  private constructor() {}
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

  destroyAll() {
    this.blackHoles.forEach((blackhole) => {
      this.createExplosion(toVector2(blackhole.position), 60);
      blackhole.isExpired = true;
    })
    this.enemies.forEach((enemy) => {
      this.createExplosion(toVector2(enemy.position), 60);
      enemy.isExpired = true;
    })
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
          this.enemies[enemyIndex].getHit(this.bullets[bulletIndex]);
          this.bullets[enemyIndex].getHit(this.enemies[bulletIndex]);
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

  handleCollisionBetweenPlayerAndBlackHole() {
    for (let i = 0; i < this.blackHoles.length; i++) {
      if (isColliding(this.blackHoles[i], this.player)) {
        (<Ship>this.player).getHit();
      }
    }
  }


  handleCollisionBetweenBulletAndBlackhole() {
    for (
      let bulletIndex = 0;
      bulletIndex < this.bullets.length;
      bulletIndex++
    ) {
      for (let enemyIndex = 0; enemyIndex < this.blackHoles.length; enemyIndex++) {
        if (isColliding(this.bullets[bulletIndex], this.blackHoles[enemyIndex])) {
          this.blackHoles[enemyIndex].getHit(this.bullets[bulletIndex]);
          this.bullets[bulletIndex].getHit(this.blackHoles[enemyIndex]);
        }
      }
    }
  }

  createExplosion(location: Vector2, count: number){
    const COLORS = ["#32a852", "#a83632", "#6600ff", "#0040ff"]
    const randColor = COLORS[getRandomInt(0,4)];
    const baseColor = new Color(randColor)
    for (let index = 0; index < count; index++) {
      const rad = index*(2*Math.PI/count);
      const direction = new Vector2(Math.cos(rad), Math.sin(rad));
      const partial = new PartialEffect(location, direction, baseColor);
      EntityManager.getInstance().add(partial);
      partial.init();
    }
  }

  handleCollisions() {
    this.handleCollisionBetweenEnemyAndEnemy();
    this.handleCollisionBetweenPlayerAndEnemy();
    this.handleCollisionBetweenPlayerAndBlackHole();
    this.handleCollisionBetweenBulletAndEnemy();
    this.handleCollisionBetweenBulletAndBlackhole();
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

  getEnemiesCount() {
    return this.enemies.length;
  }

  getBlackholeCount(){
    return this.blackHoles.length;
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
