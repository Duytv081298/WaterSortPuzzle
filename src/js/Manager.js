
import { Application } from "@pixi/app";
export default class Manager {
    constructor(main) {
        this.main = main
        this.app = null;
        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getBounds() {
        return { width: this.width, height: this.height };
    }
    getApp() {
        return this.app
    }
    initialize() {
        this.app = new Application({
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: 0x23395D,
            width: this.width,
            height: this.height
        });
        this.app.renderer.backgroundColor = 0x23395D
        this.app.renderer.resize(this.width, this.height)
        this.app.renderer.view.style.position = 'absolute'

        this.app.stage.sortableChildren = true
        document.body.appendChild(this.app.view)
        window.addEventListener("resize", () => { this.resize() });
    }
    resize() {
        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.app.renderer.resize(this.width, this.height)
        this.main.resize(this.width, this.height)
    }

}