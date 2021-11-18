import { Loader } from "pixi.js";
import { ASSETS } from '../assets/assets.js';
export default class LoadAssets {
    constructor() {
        this.load = new Loader()
    }
    loader() {
        this.load
            .reset()
            .add(ASSETS)
            .load();
        // this.load.onProgress.add(this.downloadProgress, this);
        // this.load.onComplete.once(this.gameLoaded, this);
    }
    downloadProgress(loader) {
        const progressRatio = loader.progress / 100;
    }
    gameLoaded() {
        console.log('load all');
    }
    getProgress() {
        return this.load.progress
    }
    getResources() {
        return this.load.resources
    }
    

}