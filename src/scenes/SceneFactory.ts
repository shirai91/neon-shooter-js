import * as THREE from "three";
import SceneConfig from "./SceneConfig";
import GameScene from "./GameScene";
import TestCubeScene from "./TestCubeScene";

export default class SceneFactory {
  createScene(sceneName: string): GameScene {
    switch (sceneName) {
      case "TestCubeScene":
        return new TestCubeScene();
      default:
        return new TestCubeScene();
    }
  }
}
