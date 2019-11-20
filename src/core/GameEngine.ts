import * as THREE from "three";

import SceneConfig from "../scenes/SceneConfig";
import GameScene from "./ScriptableScene";
import SceneFactory from "../scenes/SceneFactory";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

const params = {
  exposure: 1,
  bloomStrength: 0.8,
  bloomThreshold: 0,
  bloomRadius: 0
};

export default class GameEngine {
  clock: THREE.Clock;
  renderer: THREE.WebGLRenderer;
  stats: Stats;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  gameScenes: { [name: string]: GameScene } = {};
  activeGameSceneName: string = null;

  constructor(domElement: HTMLElement) {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    this.camera.position.set(0, 0, 20);

    this.stats = new Stats();
    domElement.appendChild(this.stats.dom);

    this.initRenderer(domElement);

    this.initComposer(domElement);

    this.initGui();

    var controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.onresize = () => {
      const boundingRect = domElement.getBoundingClientRect();
      var width = boundingRect.width;
      var height = boundingRect.height;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    };
  }

  initGui() {
    var gui = new GUI();
    gui.add(params, "exposure", 0.1, 2).onChange(value => {
      this.renderer.toneMappingExposure = Math.pow(value, 4.0);
    });
    gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(value => {
      this.bloomPass.threshold = Number(value);
    });
    gui.add(params, "bloomStrength", 0.0, 3.0).onChange(value => {
      this.bloomPass.strength = Number(value);
    });
    gui
      .add(params, "bloomRadius", 0.0, 1.0)
      .step(0.01)
      .onChange(value => {
        this.bloomPass.radius = Number(value);
      });
  }

  initComposer(domElement: HTMLElement) {
    var renderScene = new RenderPass(this.scene, this.camera);
    const boundingRect = domElement.getBoundingClientRect();

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(boundingRect.width, boundingRect.height),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(this.bloomPass);
  }

  initRenderer(domElement: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer();
    const boundingRect = domElement.getBoundingClientRect();
    this.renderer.setSize(boundingRect.width, boundingRect.height);
    domElement.appendChild(this.renderer.domElement);
  }

  startEngine() {
    this.update();
  }

  registerScenes(scenes: string[]) {
    if (!scenes.length) {
      throw new Error("no scenes to load");
    }

    const sceneFactory = new SceneFactory();

    scenes.forEach((sceneName, idx) => {
      if (idx === 0) {
        this.activeGameSceneName = sceneName;
      }
      const gameScene = sceneFactory.createScene(sceneName);
      this.gameScenes[sceneName] = gameScene;
    });

    this.loadSceneData(this.gameScenes[this.activeGameSceneName]);
  }

  loadSceneData(scene: GameScene) {
    scene.init(this.scene, this.camera);
  }

  update() {
    this.renderer.setClearColor(0x000000, 1);
    requestAnimationFrame(() => {
      this.update();
    });

    // delta is time between 2 frames
    const delta = this.clock.getDelta();
    const activeScene = this.gameScenes[this.activeGameSceneName];
    if (activeScene) {
      activeScene.update(this.scene, this.camera, delta);
    }

    // This is for debug UI
    this.stats.update();
    this.composer.render();
  }
}
