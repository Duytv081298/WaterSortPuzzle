import { Application, Sprite, Container } from 'pixi.js'
var datalevel = { "ids": [2, 3, 4, 4, 4, 3, 4, 3, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0] }
var map = [[2, 3, 4, 4]]
export default class GameController {
    constructor(app, resources, screenSize) {
        this.app = app;
        this.resources = resources;
        this.screenSize = screenSize;
        this.containerGame = new Container();
        this.setUpDefaut()

    }
    setUpDefaut() {
        this.containerGame.name = 'container Game'
        this.containerGame.zIndex = 0
        this.containerBottles = new Container();

        this.containerBottles.name = 'container Bottles'
        this.containerBottles.zIndex = 1
        this.app.stage.addChild(this.containerGame, this.containerBottles);


        this.listBottles = []
        this.bottleBase = null;
        console.log(map);

    }
    start() {
        console.log('start true');

        this.setBackground()
        this.setBottle()
        this.pourWater()

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
        this.setAnchor(bottle, 1)
        bottle.on('pointerdown', () => { this.clickBottle() })
        this.listBottles.push(bottle)
        this.bottleBase = { width: bottle.getBounds().width, height: bottle.getBounds().height, scale: scale_bottle }
        this.containerBottles.addChild(bottle)
    }
    pourWater() {
        for (let i = 0; i < this.listBottles.length; i++) {
            const bottle = this.listBottles[i];

            var water = this.getWater(3)
console.log(water.anchor);
            // this.setAnchor(water, 1)
            water.y = bottle.y + this.bottleBase.height * 0.15
            water.x = bottle.x
            this.containerBottles.addChild(water)

        }
    }
    getWater(param) {
        var color = getColor(param)
        console.log(color);
        let water = new PIXI.Graphics();
        water.beginFill(color);
        water.pivot.x = this.bottleBase.height * 1.3;
        water.drawRect(0, 0, this.bottleBase.height * 1.3, this.bottleBase.height);
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
    var quantityBottle = maplevel.length / 4
    var listColor = []
    while (maplevel.length) {
        listColor.push(maplevel.splice(0, 4));
    }
    return {
        "bottle": quantityBottle,
        "map": listColor
    }
}