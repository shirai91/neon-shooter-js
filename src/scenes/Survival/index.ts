import { Ship } from "~objects/Ship";
import { Wanderer } from "~objects/Wanderer";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { Vector3, Vector2 } from "three";
import { EntityManager } from "~core/EntityManager";
import { BlackHole } from "~objects/BlackHole";
import { getRandomInt } from "~core/utils";
import { GameSubscription } from "~core/GameSubscriptions";

type GameStates = "playing" | "menu";
const MOB_SPAWN_TIME = 1;
const BLACKHOLE_SPAWN_TIME = 3;
const MAX_MOBS = 10;
const MAX_BLACKHOLE = 3;

export default class Survival extends GameObject {
  name = "SurvivalMode";
  player: Ship;
  isGameOver= false;

  mobSpawnCooldown = MOB_SPAWN_TIME;
  blackholeSpawnCooldown = BLACKHOLE_SPAWN_TIME;

  init() {
    const scene = GameManager.getInstance().getScene();
    const camera = GameManager.getInstance().getCamera();
    GameManager.getInstance().setDebugStatus(false);
    GameManager.getInstance().clearScene();

    this.player = new Ship();
    EntityManager.getInstance().add(this.player);
    EntityManager.getInstance().player = this.player;
    this.player.init();
    camera.lookAt(this.player.position);
    GameSubscription.on('gameover', ()=> {
      this.gameOver();
    })
  }

  updateCamera() {
    GameManager.getInstance()
      .getCamera()
      .position.set(
        this.player.position.x,
        this.player.position.y,
        GameManager.getInstance().getCamera().position.z
      );
    GameManager.getInstance()
      .getCamera()
      .lookAt(this.player.position);
  }

  spawnMob(delta: number) {
    if(this.isGameOver){
      return;
    }
    this.mobSpawnCooldown = this.mobSpawnCooldown - delta;
    if(this.mobSpawnCooldown <= 0) {
      this.mobSpawnCooldown = MOB_SPAWN_TIME + this.mobSpawnCooldown;
      if(EntityManager.getInstance().getEnemiesCount('Wanderer') > MAX_MOBS) {
        return;
      }
      const randomX = getRandomInt(-200, 200);
      const randomY = getRandomInt(-200, 200);
      const wanderer = new Wanderer(new Vector2(randomX, randomY));
      EntityManager.getInstance().add(wanderer);
      wanderer.init();
    }
  }

  spawnBlackhole(delta: number) {
    if(this.isGameOver){
      return;
    }
    this.blackholeSpawnCooldown-= delta;

    if(this.blackholeSpawnCooldown <= 0) {
      this.blackholeSpawnCooldown = BLACKHOLE_SPAWN_TIME + this.blackholeSpawnCooldown;
      if(EntityManager.getInstance().getBlackholeCount() > MAX_BLACKHOLE) {
        return;
      }
      const randomX = getRandomInt(-200, 200);
      const randomY = getRandomInt(-200, 200);
      const blackhole = new BlackHole(new Vector2(randomX, randomY));
      EntityManager.getInstance().add(blackhole);
      blackhole.init();
    }
  }

  gameOver() {
    EntityManager.getInstance().destroyAll();
    this.isGameOver = true;
  }

  update(delta: number) {
    this.spawnMob(delta);
    this.spawnBlackhole(delta);

    EntityManager.getInstance().update(delta);
    this.updateCamera();
  }
}
