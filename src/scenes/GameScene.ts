export default interface GameScene {
  name: string;
  init(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void;
}
