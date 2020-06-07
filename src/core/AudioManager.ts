import { AudioLoader, AudioListener, Audio } from "three";

export class AudioManager {
  static audioLoader = new AudioLoader();
  static listener = new AudioListener();
  static sound = new Audio(AudioManager.listener);

  static audios = {};
  static load(name: string, path: string) {
    AudioManager.audioLoader.load(path, (buffer) => {
      AudioManager.audios[name] = buffer;
    }, undefined, undefined);
  }

  static play(name: string) {
    AudioManager.sound.setBuffer(AudioManager.audios[name]);
    AudioManager.sound.setLoop(true);
    AudioManager.sound.setVolume(0.5);
    AudioManager.sound.play();
  }

  static loadAndPlay(name: string, path: string) {
    AudioManager.audioLoader.load(path, (buffer) => {
      AudioManager.audios[name] = buffer;
      AudioManager.sound.setBuffer(AudioManager.audios[name]);
      AudioManager.sound.setLoop(true);
      AudioManager.sound.setVolume(1);
      AudioManager.sound.play();
    }, undefined, undefined);
  }
}