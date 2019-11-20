import * as THREE from "three";
import SceneConfig from "./SceneConfig";
import ScriptableScene from "~core/ScriptableScene";
import TestCubeScene from "./TestCubeScene";

export default class SceneFactory {
  createScene(sceneName: string): ScriptableScene {
    switch (sceneName) {
      case "TestCubeScene":
        return new TestCubeScene();
      default:
        return new TestCubeScene();
    }
  }
}
