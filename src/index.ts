import GameEngine from "./core/GameEngine";

function initGameEngine() {
  const rootNode = document.getElementById("container");

  if (!rootNode) {
    document.body.append("<span>Root node not found</span>");
  }

  const gameEngine = new GameEngine(rootNode!);

  gameEngine.registerScenes(["TestCubeScene"]);
  gameEngine.startEngine();
}

initGameEngine();
