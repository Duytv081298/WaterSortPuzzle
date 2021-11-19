import { Application, Sprite, Container } from 'pixi.js'
var datalevel = { "ids": [2, 3, 4, 4, 4, 3, 4, 3, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0] }
var map = [[2, 3, 4, 4]]

import { gsap } from "gsap";
export default class GameController {
    constructor(app, resources, screenSize) {
        this.app = app;
        this.resources = resources;
        this.screenSize = screenSize;
        this.containerGame = new Container();
        this.map = null
        this.setUpDefaut()

    }
    setUpDefaut() {
        this.containerGame.name = 'container Game'
        this.containerGame.zIndex = 0
        this.containerPlaying = new Container();

        this.containerPlaying.name = 'container Bottles'
        this.containerPlaying.zIndex = 1
        this.app.stage.addChild(this.containerGame, this.containerPlaying);


        this.listBottles = []
        this.bottleBase = null;
        this.map = converLevel(this.resources.map.data.ids)
        console.log(this.map);


    }
    start() {
        console.log('start true');
        this.setBackground()
        this.setBottle()

    }

    setBackground() {
        const bg = PIXI.Sprite.from(this.resources.bg.texture);
        const scaleBg = (this.screenSize.height * 9.3 / 10) / bg.height
        bg.scale.set(scaleBg, scaleBg);
        bg.position.set((this.screenSize.width - bg.width) * 0.5, 0);
        bg.name = 'bg'
        bg.zIndex = 0

        const ground = PIXI.Sprite.from(this.resources.ground.texture);
        const scaleGround = (this.screenSize.width * 1.1) / ground.width
        ground.scale.set(scaleGround, scaleGround);
        ground.position.set((this.screenSize.width - ground.width) * 0.5, this.screenSize.height * 9.3 / 10);
        ground.name = 'ground'
        ground.zIndex = 0

        this.containerGame.addChild(bg, ground)
    }

    setBottle() {

        var WIDTH = this.screenSize.width
        var HEIGHT = this.screenSize.height

        var bottle = new PIXI.Sprite(this.resources.bottles.textures["bottle_1.png"]);
        var scale_bottle = (WIDTH * 0.1) / bottle.width
        bottle.scale.set(scale_bottle, scale_bottle);
        bottle.position.set((WIDTH - bottle.getBounds().width) * 0.5, HEIGHT * 0.3);
        bottle.interactive = true;
        this.bottleBase = { width: bottle.getBounds().width, height: bottle.getBounds().height, scale: scale_bottle }
        this.colorBase = { height: this.bottleBase.height * 0.85 / 4, width: this.bottleBase.height * 1.3 }


        for (let i = 0; i < map.length; i++) {
            var containerBottle = new Container();
            containerBottle.name = 'container_bottle_' + i

            var containerBottleMask = new Container();
            containerBottleMask.name = 'container_bottle_mask_' + i

            var containerColor = new Container();
            containerColor.name = 'container_color_' + i

            this.containerPlaying.addChild(containerBottle)

            const bottle = new PIXI.Sprite(this.resources.bottles.textures["bottle_1.png"]);
            bottle.name = 'bottle_' + i
            bottle.scale.set(scale_bottle, scale_bottle);
            bottle.position.set(0, 0);
            bottle.interactive = true;


            const bottle_fill = new PIXI.Sprite(this.resources.bottles.textures["bottle_fill_1.png"]);
            bottle_fill.name = 'bottle_fill_' + i
            bottle_fill.scale.set(scale_bottle, scale_bottle);
            bottle_fill.position.set((this.bottleBase.width - bottle_fill.getBounds().width) * 0.5, bottle.y + this.bottleBase.height * 0.02);

            bottle.on('pointerdown', () => { this.clickBottle() })
            this.listBottles.push(bottle)
            containerBottleMask.addChild(bottle_fill, bottle)
            this.setOriginRight(containerBottleMask)
            // this.setAnchor(bottle, 1)
            var waterX = bottle.anchor.x == 0 ? bottle.x + this.bottleBase.width : bottle.x


            for (let j = 0; j < map[0].length; j++) {
                const color = map[0][j];
                if (color <= 0) continue;
                var water = this.getWater(color)
                // this.setAnchor(water, 1)
                water.y = bottle.y + this.bottleBase.height * 0.15 + this.colorBase.height * j
                water.x = waterX
                containerColor.addChild(water)
            }

            var wave = this.getWave()
            wave.y = containerColor.children[0].y - wave.getBounds().height * 0.8
            containerBottle.addChild(containerColor, wave, containerBottleMask)
            wave.mask = bottle_fill
            containerColor.mask = bottle_fill
            containerBottle.x = (WIDTH - containerBottle.getBounds().width) * 0.5
            containerBottle.y = HEIGHT * 0.3

            // var moveX  = gsap.timeline(); gsap
            // moveX.to(wave, { x: '-=90', duration: 1, ease: "none" }).call(() => {
            //     moveX.invalidate();
            //     moveX.restart();
            // })

        }
        // containerBottleMask.rotation = degrees_to_radians(36)
        // gsap.to(containerBottleMask, { rotation: degrees_to_radians(36), duration: 1, ease: "none" })

    }

    getWave() {
        var containerWave = new Container();
        const water_wave = new PIXI.Sprite(this.resources.bottles.textures["wave.png"]);
        var scale_wave = this.bottleBase.width / water_wave.getBounds().width
        for (let i = 0; i < 5; i++) {
            const water_wave = new PIXI.Sprite(this.resources.bottles.textures["wave.png"]);
            water_wave.scale.set(scale_wave, scale_wave);
            water_wave.position.set(water_wave.getBounds().width * i, 0);
            containerWave.addChild(water_wave)
            water_wave.tint = 0x3f4482
        }
        return containerWave
    }












    setOriginLeft() {

    }

    setOriginRight(target) {

        target.pivot.x = this.bottleBase.width
        target.x = this.bottleBase.width
    }

    pourWater() {
        var containerColor = new Container();
        this.containerPlaying.addChild(containerColor)
        for (let i = 0; i < this.listBottles.length; i++) {
            const bottle = this.listBottles[i];


        }
    }
    getWater(param) {
        var color = getColor(param)
        let water = new PIXI.Graphics();
        water.beginFill(color);
        water.pivot.x = this.bottleBase.height * 1.3;
        water.drawRect(0, 0, this.colorBase.width, this.colorBase.height);
        return water
    }
    setAnchor(sprite, point) {
        if (point != sprite.anchor.x) {
            var x = sprite.getBounds().x;
            var y = sprite.getBounds().y;
            var width = sprite.getBounds().width;
            if (point == 1) {
                sprite.anchor.set(1, 0);
                sprite.position.set(x + width, y);
            } else {
                sprite.anchor.set(0, 0);
                sprite.position.set(x - width, y);
            }

        }
    }
    clickBottle() {
        console.log('click Bottle');
    }


}

function getColor(param) {
    switch (param) {
        case 1: return 0x88aaff
        case 2: return 0x3f4482
        case 3: return 0x145def
        case 4: return 0xf27914
        case 5: return 0xf4c916
        case 6: return 0x6c7490
        case 7: return 0xbc245e
        case 8: return 0xbf3cbf
        case 9: return 0xff94d1
        case 10: return 0x008160
        case 11: return 0x809917
        case 12: return 0xB3D666
    }
}
function converLevel(maplevel) {
    var map = maplevel.slice()
    var quantityBottle = map.length / 4
    var listColor = []
    while (map.length) {
        listColor.push(map.splice(0, 4));
    }
    return {
        "bottle": quantityBottle,
        "map": listColor
    }
}
function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}