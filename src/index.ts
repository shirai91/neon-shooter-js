import { GameEngine } from "./core/GameEngine";
import { ContentManager } from "./core/ContentManager";
import { ASSETS } from "./assetList";
import { TestCubeScene } from "./scenes/TestCubeScene";

async function initGameEngine() {
  const rootNode = document.getElementById("container");

  if (!rootNode) {
    document.body.append("<span>Root node not found</span>");
  }
  // TODO: next time we need to move content loader to another class
  await ContentManager.getInstance().loadContent(
    ASSETS.SHIP.name,
    ASSETS.SHIP.path
  );

  await ContentManager.getInstance().loadContent(
    ASSETS.WANDERER.name,
    ASSETS.WANDERER.path
  );

  const gameEngine = new GameEngine(rootNode!);
  const testScene = new TestCubeScene();

  gameEngine.setEntry(testScene);
  gameEngine.startEngine();
}

initGameEngine();
