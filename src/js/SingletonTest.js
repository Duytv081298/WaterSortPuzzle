import { Loader } from "pixi.js";
import { ASSETS } from '../assets/assets.js';
var Singleton = (function () {
    var resources;
    var load = new Loader()
    const myPromise = new Promise((resolve, reject) => {
        load
            .reset()
            .add(ASSETS)
            .load()
        load.onComplete.once(() => { resolve(load.resources); })
    });
    return {
        getInstance: async function () {
            if (!resources) {
                console.log(1111111);
                await myPromise.then((val) => { resources = val })
            }
            return resources;
        }
    };
})();
export { Singleton }