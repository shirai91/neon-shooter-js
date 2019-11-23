import * as THREE from "three";
import { GameObject } from "~core/GameObject";
import { GameManager } from "~core/GameManager";
import { ASSETS } from "~assetList";
import { ContentManager } from "~core/ContentManager";
import { InputManager } from "~core/InputManager";
import { Vector2, Vector3 } from "three";

const WANDERER_SPEED = 2;
const ROTATION_VALUE = Math.PI / 2;

export default class Wanderer extends GameObject {
    init() {
        const scene = GameManager.getInstance().getScene();
        this.loadTexture(scene);
        this.mesh.position.x = 30;
        this.mesh.position.y = 30;
    }

    loadTexture(scene: THREE.Scene) {
        this.setScale(10, 10);
        const wandererTexture = ContentManager.getInstance().getAsset(ASSETS.WANDERER.name);
        this.setImage(wandererTexture);
    }

    update(delta: number) {
        this.mesh.rotation.z += 0.3;
        this.mesh.position.x += WANDERER_SPEED;
    }
}
