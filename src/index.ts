import { GameEngine } from "./core/GameEngine";
import { ContentManager } from "./core/ContentManager";
import { ASSETS } from "./settings/assetList";
import TestScene from "./scenes/TestScene";
import Survival from "./scenes/Survival";

async function initGameEngine() {
  const rootNode = document.getElementById("container");

  if (!rootNode) {
    document.body.append("<span>Root node not found</span>");
  }
  // TODO: next time we need to move content loader to another class

  for(let key in ASSETS) {
    await ContentManager.getInstance().loadContent(
      ASSETS[key].name,
      ASSETS[key].path
    );
  }

  const gameEngine = new GameEngine(rootNode!);
  const survivalScene = new Survival();

  gameEngine.setEntry(survivalScene);
  gameEngine.startEngine();
}

initGameEngine();
