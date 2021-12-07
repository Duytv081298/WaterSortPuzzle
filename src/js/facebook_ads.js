
const INTERSTITIAL_PLACEMENT_ID = '335423665035241_383656783545262';
const REWARDED_PLACEMENT_ID = '335423665035241_383656893545251';
const REWARDED_BANNER_ID = '335423665035241_383656276878646';

var nextLevelVideo = null;
var videoAddbottle = null;
var videoBack = null;
export default class Ads {
    constructor(gameController) {
        this.gameController = gameController
        this.addBottle = false;
        this.addBack = false;
        this.loadInterstitialAdAsync();
        this.loadAdAddBottle();
        this.loadAdBack();
        this.loadBannerAdAsync()
    }
    //load ads next level
    loadInterstitialAdAsync() {
        FBInstant.getInterstitialAdAsync(
            INTERSTITIAL_PLACEMENT_ID, // Your Ad Placement Id
        ).then((rewarded) => {
            nextLevelVideo = rewarded;
            return nextLevelVideo.loadAsync();
        }).then(() => {
            console.log('Interstitial 1 preloaded')
        }).catch((err) => {
            console.error('Interstitial 1 failed to preload: ' + err.message);
        });
    }

    //sử dụng
    showInterstitial(param) {
        nextLevelVideo.showAsync()
            .then(() => {
                console.log('Interstitial ad finished successfully');
                if (param == 'retry') this.gameController.replayGame()
                else this.gameController.nextLevel()
                this.loadInterstitialAdAsync()
            }).catch((e) => {
                console.error(e);
                console.error(e.message);
                // if (e.code == 'RATE_LIMITED') {  }
                if (param == 'retry') this.gameController.replayGame()
                else this.gameController.nextLevel()
                this.loadInterstitialAdAsync()

            });
    }
    // load ads banner //sử dụng
    loadBannerAdAsync() {
        FBInstant.loadBannerAdAsync(
            REWARDED_BANNER_ID,
        ).then(function () {
            console.log('loadBannerAdAsync resolved.');
        }).catch(function (err) {
            console.error('Banner failed to load: ' + err.message);
        });
    }


    //sử dụng
    loadAdAddBottle() {
        var type = 'addBottle'
        FBInstant.getRewardedVideoAsync(REWARDED_PLACEMENT_ID)
            .then((interstitial) => {
                videoAddbottle = interstitial;
                return videoAddbottle.loadAsync();
            }).then(() => {
                this.filterType(type, true)
                console.log('Rewarded video preloaded');
                // this.showvideoAddbottle()
            }).catch((err) => {
                this.filterType(type, false)
                console.error('Rewarded video failed to preload:' + err.message);
                setTimeout(() => { this.handleAdsNoFill(videoAddbottle, 2, type); }, 30 * 1000);
            });


    }
    showvideoAddbottle() {
        if (this.addBottle) {
            videoAddbottle.showAsync()
                .then(() => {
                    console.log('Rewarded video watched successfully');
                    this.addBottle = false
                    this.gameController.addBottle();
                    this.loadAdAddBottle()
                })
                .catch((e) => {
                    if (e.code == 'USER_INPUT') this.loadAdAddBottle()
                    console.error(e);
                    console.error(e.message);
                });
        }
    }
    loadAdBack() {
        var type = 'back'
        FBInstant.getRewardedVideoAsync(REWARDED_PLACEMENT_ID)
            .then((interstitial) => {
                videoBack = interstitial;
                return videoBack.loadAsync();
            }).then(() => {
                this.filterType(type, true)
                console.log('Rewarded video preloaded');
            }).catch((err) => {
                this.filterType(type, false)
                console.error('Rewarded video failed to preload:' + err.message);
                setTimeout(() => { this.handleAdsNoFill(videoBack, 2, type); }, 30 * 1000);
            });
    }
    showvideoBack() {
        if (this.addBack) {
            videoBack.showAsync()
                .then(() => {
                    console.log('Rewarded video watched successfully');
                    this.gameController.plus = false;
                    this.addBack = false;
                    this.gameController.back = 5
                    this.gameController.drawTextBack();
                    this.loadAdBack();
                })
                .catch((e) => {
                    if (e.code == 'USER_INPUT') this.loadAdBack()
                    console.error(e);
                    console.error(e.message);
                });
        }
    }
    handleAdsNoFill(adInstance, attemptNumber, type) {
        if (attemptNumber > 3) { return; }
        else {
            adInstance.loadAsync().then(() => {
                this.filterType(type, true)
                console.log('Rewarded video preloaded');
            }).catch((err) => {
                this.filterType(type, false)
                console.error('Rewarded video failed to preload:' + err.message);
                setTimeout(() => { handleAdsNoFill(adInstance, attemptNumber + 1); }, 30 * 1000);
            });
        }
    }
    filterType(type, status) {
        switch (type) {
            case 'back':
                this.addBack = status;
                console.log('video addBack is ready');
                break;
            case 'addBottle':
                this.addBottle = status;
                console.log('video addBottle is ready');
                break;
        }
    }
}