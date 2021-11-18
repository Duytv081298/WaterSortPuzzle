
import * as PIXI from "pixi.js";
import Manager from './Manager.js'
import LoadAssets from "./LoadAssets.js";
import GameController from "./GameController"




class Main {
    constructor() {
        this.manager = new Manager(this)
        this.loadAssets = new LoadAssets()
        this.gameController = null;
    }
    init() {
        this.manager.initialize()
        this.loadAssets.loader()
        var resourcesComplete = setInterval(() => {
            const progress = this.loadAssets.getProgress()
            if (progress == 100) {
                console.log('load data complete');
                this.startGame()
                clearInterval(resourcesComplete);
            }
        }, 10);
    }
    startGame() {
        var app = this.manager.getApp()
        var resources = this.loadAssets.getResources()
        var screenSize = this.manager.getBounds()
        this.gameController = new GameController(app, resources, screenSize)
        this.gameController.start()

    }
    resize(width, height) {
        console.log({ width: width, height: height });
    }
}
const main = new Main()
main.init()