import { Loader } from "pixi.js";
import { ASSETS } from '../assets/assets.js';
export default class LoadAssets {
    constructor(level) {
        this.load = new Loader()
        this.level = level;
        this.assets = ASSETS
        this.assets.push({ name: 'map', url: 'assets/levels/Lv_' + this.level + '.json' },)
    }
    loader() {
        this.load
            .reset()
            .add(this.assets)
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