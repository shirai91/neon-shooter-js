import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { GameObject } from "./GameObject";
import { GameManager } from "./GameManager";

const params = {
  exposure: 1,
  bloomStrength: 0.8,
  bloomThreshold: 0,
  bloomRadius: 0
};

export class GameEngine {
  clock: THREE.Clock;
  renderer: THREE.WebGLRenderer;
  stats: Stats;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  gameRoot: GameObject;

  constructor(domElement: HTMLElement) {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    this.camera.position.set(50, 50, 200);

    this.stats = new Stats();
    domElement.appendChild(this.stats.dom);

    this.initRenderer(domElement);

    this.initComposer(domElement);

    this.initGui();

    GameManager.getInstance().setScene(this.scene);
    GameManager.getInstance().setCamera(this.camera);

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
    this.camera.aspect = boundingRect.width / boundingRect.height;
    this.camera.updateProjectionMatrix();
    domElement.appendChild(this.renderer.domElement);
    GameManager.getInstance().setRenderer(this.renderer);
  }

  startEngine() {
    this.update();
  }

  setEntry(gameObject: GameObject) {
    this.gameRoot = gameObject;
    this.gameRoot.init();
  }

  update() {
    this.renderer.setClearColor(0x000000, 1);
    requestAnimationFrame(() => {
      this.update();
    });

    // delta is time between 2 frames
    const delta = this.clock.getDelta();
    this.gameRoot.update(delta);
    this.gameRoot.draw();
    // This is for debug UI
    this.stats.update();
    this.composer.render();
  }
}
