
import * as PIXI from "pixi.js";
import Manager from './Manager.js'
import LoadAssets from "./LoadAssets.js";
import GameController from "./GameController"
import Ads from './facebook_ads'



var temPro = 0;
class Main {
    constructor() {
        this.level = 1
        this.manager = new Manager(this)
        this.gameController = null;

    }
    connectWithFacebook() {
        FBInstant.initializeAsync()
            .then(() => {
                // FBInstant.player
                //   .setDataAsync({ level: 1 })
                //   .then(function () {
                //     console.log('data is set: ', { level: 1 });
                //   });
                FBInstant.player
                    .getDataAsync(['level'])
                    .then((stats) => {
                        if (JSON.stringify(stats) === '{}') this.level = 1
                        else if (stats) {
                            this.level = stats.level
                        }
                        else console.log(stats);
                        console.log(stats);
                        this.level = 1
                        this.init()
                    })
            }
            );
    }
    init() {
        this.manager.initialize()
        this.loadAssets = new LoadAssets(this.level)
        this.loadAssets.loader()
        var resourcesComplete = setInterval(() => {
            const progress = this.loadAssets.getProgress()
            // console.log(progress);
            if (progress == 100) {
                var plus = 0
                if (progress - temPro >= 10) plus = Math.floor(Math.random() * 6);
                else plus = Math.floor(Math.random() * (progress - temPro)) + 1;
                temPro += plus
                FBInstant.setLoadingProgress(temPro);
                if (temPro == 100) {
                    this.startGame()
                    clearInterval(resourcesComplete);
                }
                temPro = 95
            } else {
                if (temPro + 1 <= progress) {
                    temPro++
                    FBInstant.setLoadingProgress(temPro);
                }
            }
        }, 50);
    }
    startGame() {

        FBInstant.startGameAsync()
        .then(() => {
          this.supportedAPIs = FBInstant.getSupportedAPIs();
          // console.log(this.supportedAPIs);
          if (this.supportedAPIs.includes('getInterstitialAdAsync') && this.supportedAPIs.includes('getRewardedVideoAsync')) {
            // this.ads_facebook = new Ads(this)
            this.adSupport = true
          } else {
            console.error('Ads not supported in this session');
            this.adSupport = false
          }
          
          var app = this.manager.getApp()
          var resources = this.loadAssets.getResources()
          var screenSize = this.manager.getBounds()
          this.gameController = new GameController(app, resources, screenSize, this.level)
          this.gameController.start()
        })
     

    }
    resize(width, height) {
        console.log({ width: width, height: height });
    }
}
const main = new Main()
main.connectWithFacebook()
// main.init()

// https://www.facebook.com/embed/instantgames/896168877938674/player?game_url=https://localhost:8080