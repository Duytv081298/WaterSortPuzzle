import { Application, Sprite, Container } from 'pixi.js'
import { sound } from '@pixi/sound';
import { gsap } from "gsap";
import { Spine } from 'pixi-spine';
const TIMEUP = 0.15;
const TIMEMOVEMIN = 0.35


var loaderNextData = new PIXI.Loader();
var loaderBackData = new PIXI.Loader();

var numBottleAdd = 0
export default class GameController {
    constructor(app, resources, screenSize, level) {
        this.app = app;
        this.resources = resources;
        this.screenSize = screenSize;
        this.level = level;
        this.data = null;
        this.bottleW = null;
        this.template_bottle_use = "bottle_1.png";
        this.setUpDefaut();
        this.listBottles = [];
        this.listBottleA = [];
        this.listBottleB = [];
        this.speed = { a: 0, b: 0 }

        this.complete = true;
        this.dataLevelNextLoad = false;

        this.sound = true;
        this.vibration = false;
        this.back = 5

    }
    setUpDefaut() {
        this.containerGame = new Container();
        this.containerGame.name = 'container Game'
        this.containerGame.zIndex = 0

        this.containerPlaying = new Container();
        this.containerPlaying.name = 'container Playing'
        this.containerPlaying.zIndex = 2

        this.containerPlaying.sortableChildren = true


        this.diaphragm = new PIXI.Graphics();
        this.diaphragm.name = 'diaphragm'
        this.diaphragm.beginFill(0x000000);
        this.diaphragm.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        this.diaphragm.alpha = 0
        this.diaphragm.zIndex = 3

        this.containerLevel = new Container();
        this.containerLevel.name = 'container Level'
        this.containerLevel.zIndex = 1

        this.containerButton = new Container();
        this.containerButton.name = 'container Button'
        this.containerButton.zIndex = 1

        this.containerSettings = new Container();
        this.containerSettings.name = 'container Settings'
        this.containerSettings.zIndex = 3


        this.containerWin = new Container();
        this.containerWin.zIndex = 4
        this.containerWin.name = 'container win'


        // this.confettiContainer = new Container();
        // this.confettiContainer.name = 'confetti Container'
        // this.app.stage.addChild(this.confettiContainer)


        this.app.stage.addChild(this.containerGame, this.containerButton, this.containerLevel,
            this.containerPlaying, this.diaphragm, this.containerSettings, this.containerWin);


        this.listBottles = []
        this.bottleBase = null;
        this.data = converLevel(this.resources.map.data.ids)

    }
    start() {
        console.log('start true');
        this.setBackground()
        this.setButton()
        this.setLCBottle(this.data.bottle)
        this.setBottle()
        this.getNextLevelData()
        this.drawTextLevel()
        // this.drawWin()
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
    //set location bottle
    setLCBottle(quantity) {

        var WIDTH = this.screenSize.width
        var HEIGHT = this.screenSize.height

        var indexRow = this.divideRow(quantity);
        var startY = [];
        if (indexRow.numR1 <= 6) {
            this.bottleW = WIDTH / 7;
            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 5, HEIGHT / 1.9]
        }
        else if (indexRow.numR1 <= 7) {
            this.bottleW = WIDTH / 7.5;
            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 5, HEIGHT / 1.9]
        }
        else if (indexRow.numR1 <= 8) {
            this.bottleW = WIDTH / 9;
            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 5, HEIGHT / 2]
        } else {
            this.bottleW = WIDTH / 10;
            if (indexRow.row == 1) startY.push(HEIGHT / 3)
            else startY = [HEIGHT / 4.5, HEIGHT / 2]
        }


        var bottle = new PIXI.Sprite(this.resources.bottles.textures[this.template_bottle_use]);
        var scale_bottle = this.bottleW / bottle.width
        bottle.scale.set(scale_bottle, scale_bottle);
        // bottle.position.set((WIDTH - bottle.getBounds().width) * 0.5, HEIGHT * 0.3);
        // bottle.interactive = true;

        var startX, defaultX, distanceBottle;
        if (indexRow.row == 1) {
            var indexXBottle0 = this.renderStartXBottle(indexRow.numR1);
            startX = indexXBottle0.startX;
            defaultX = [indexXBottle0.defaultX];
            distanceBottle = [indexXBottle0.distanceBottle];
        } else {
            var indexXBottle0 = this.renderStartXBottle(indexRow.numR1);
            var indexXBottle1 = this.renderStartXBottle(indexRow.numR2, true);
            startX = indexXBottle0.startX.concat(indexXBottle1.startX);
            defaultX = [indexXBottle0.defaultX, indexXBottle1.defaultX];
            distanceBottle = [indexXBottle0.distanceBottle, indexXBottle1.distanceBottle];
        }
        this.bottleBase = {
            indexRow: indexRow,
            width: bottle.getBounds().width,
            height: bottle.getBounds().height,
            scale: scale_bottle,
            defaultX: defaultX,
            distanceBottle: distanceBottle,
            startX: startX,
            startY: startY,
            empty: bottle.getBounds().height * 0.15,
            up: bottle.getBounds().height * 0.2
        };
        this.colorBase = { height: this.bottleBase.height * 0.85 / 4, width: this.bottleBase.height * 1.3 }
    }
    divideRow(quantity) {
        if (quantity >= 2 && quantity <= 5) {
            return {
                row: 1,
                numR1: quantity
            }
        }
        else if (quantity >= 6) {
            return {
                row: 2,
                numR1: Math.floor(quantity / 2) + 1,
                numR2: quantity - (Math.floor(quantity / 2) + 1)
            }
        } else return null
    }
    renderStartXBottle(quantity, row2) {
        var unusedArea = this.screenSize.width - (this.bottleW * quantity)
        var defaultX, distanceBottle;
        if (quantity == 2) {
            if (row2 == true) {
                defaultX = (unusedArea * 2.5 / 3) / 2;
                distanceBottle = (unusedArea * 0.5 / 3) / (quantity - 1);
            } else {
                defaultX = (unusedArea * 2.25 / 3) / 2;
                distanceBottle = (unusedArea * 0.75 / 3) / (quantity - 1);
            }
        } else if (quantity == 3) {
            if (row2 == true) {
                defaultX = (unusedArea * 2 / 3) / 2;
                distanceBottle = (unusedArea / 3) / (quantity - 1);
            } else {
                defaultX = (unusedArea * 1.75 / 3) / 2;
                distanceBottle = (unusedArea * 1.25 / 3) / (quantity - 1);
            }
        }
        else if (quantity <= 5) {
            if (row2 == true) {
                defaultX = (unusedArea * 1.8 / 3) / 2;
                distanceBottle = (unusedArea * 1.2 / 3) / (quantity - 1);
            } else {
                defaultX = (unusedArea / 3) / 2;
                distanceBottle = (unusedArea * 2 / 3) / (quantity - 1);
            }
        }
        else {
            defaultX = (unusedArea * 2 / 3) / 2;
            distanceBottle = (unusedArea / 3) / (quantity - 1);
        }
        var plus = this.bottleW + distanceBottle;
        var startX = []
        for (let i = 0; i < quantity; i++) {
            startX.push(defaultX + plus * i)
        }
        return { startX: startX, defaultX: defaultX, distanceBottle: distanceBottle }
    }
    setBottle() {
        this.listBottles = [];
        var map = this.data.map
        for (let i = 0; i < map.length; i++) {
            //set container each bottle
            var containerBottle = new Container();
            containerBottle.name = 'container_bottle_' + i
            var containerBottleMask = new Container();
            containerBottleMask.name = 'container_bottle_mask_' + i
            var containerColor = new Container();
            containerColor.name = 'container_color_' + i
            this.containerPlaying.addChild(containerBottle)


            const bottle = new PIXI.Sprite(this.resources.bottles.textures["bottle_1.png"]);
            bottle.name = 'bottle_' + i
            bottle.scale.set(this.bottleBase.scale, this.bottleBase.scale);
            bottle.position.set(0, 0);
            bottle.interactive = true;


            const bottle_fill = new PIXI.Sprite(this.resources.bottles.textures["bottle_fill_1.png"]);
            bottle_fill.name = 'bottle_fill_' + i
            bottle_fill.scale.set(this.bottleBase.scale, this.bottleBase.scale);
            bottle_fill.position.set((this.bottleBase.width - bottle_fill.getBounds().width) * 0.5, this.bottleBase.height * 0.02);

            bottle.on('pointerdown', () => { this.clickBottle(i) })

            containerBottleMask.addChild(bottle_fill, bottle)


            for (let j = 0; j < map[i].length; j++) {
                const color = map[i][j];
                if (color <= 0) {
                    let water = new PIXI.Graphics();
                    water.beginFill(0xffffff);
                    water.drawRect(0, 0, this.colorBase.width, this.colorBase.height);
                    water.y = this.colorBase.height * j
                    water.alpha = 0
                    containerColor.addChild(water)
                } else if (j == map[i].length - 1) {
                    var color1 = getColor(color)
                    let water = new PIXI.Graphics();
                    water.beginFill(color1);
                    water.drawRect(0, 0, this.colorBase.width, this.colorBase.height * 6);
                    water.y = this.colorBase.height * j
                    containerColor.addChild(water)
                } else {
                    var water = this.getWater(color)
                    water.y = this.colorBase.height * j
                    containerColor.addChild(water)
                }
            }
            containerColor.y = this.bottleBase.empty
            containerColor.x = bottle.x
            this.listBottles.push({ status: true, runWave4: false, runWave: false, num: 0, new: [] });

            var colWater = this.getColWater(3)
            colWater.name = 'colWater_' + i
            colWater.x = this.bottleBase.width * 0.22
            colWater.y = -this.bottleBase.height * 0.226
            colWater.alpha = 0
            var wave = this.getWave(map[i][map[i].lastIndexOf(0) + 1])
            wave.name = 'wave_' + i
            wave.y = this.colorBase.height * (map[i].lastIndexOf(0) + 1) + this.bottleBase.empty - wave.getBounds().height * 0.8
            wave.alpha = 0

            var wave4 = this.getWave4(map[i][map[i].lastIndexOf(0) + 1])
            wave4.name = 'wave4_' + i
            var indexWaterExist = map[i].lastIndexOf(0) + 1
            wave4.y = indexWaterExist < 3 ? containerColor.children[indexWaterExist].y - wave4.getBounds().height * 0.7 + this.bottleBase.empty : containerColor.children[3].y + containerColor.children[3].getBounds().height - wave4.getBounds().height * 0.7 + this.bottleBase.empty

            wave4.alpha = 0

            wave.mask = bottle_fill
            wave4.mask = bottle_fill
            containerColor.mask = bottle_fill

            containerBottle.addChild(colWater, containerColor, wave, wave4, containerBottleMask)
            containerBottle.x = this.bottleBase.startX[i]
            containerBottle.y = i >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0]
        }

        var x0 = this.bottleBase.startX[1],
            y0 = this.bottleBase.startY[0] - this.bottleBase.up,
            x1 = this.bottleBase.startX[1] + this.bottleBase.width * 0.3,
            y1 = this.bottleBase.startY[0] - this.bottleBase.height * 0.225
        var distance = getDistance({ x: x0, y: y0 }, { x: x1, y: y1 });
        this.speed = { a: distance / 38, b: (distance / 38) * 1.4 }
    }
    reDrawWater(id) {
        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + id)
        var containerColor = containerBottle.getChildByName('container_color_' + id)
        while (containerColor.children[0]) {
            containerColor.removeChild(containerColor.children[0]);
        }
        var listColor = this.data.map[id]
        for (let j = 0; j < listColor.length; j++) {
            const color = listColor[j];
            if (color <= 0) {
                let water = new PIXI.Graphics();
                water.beginFill(0xffffff);
                water.drawRect(0, 0, this.colorBase.width, this.colorBase.height);
                water.y = this.colorBase.height * j
                water.alpha = 0
                containerColor.addChild(water)
            } else if (j == listColor.length - 1) {
                var color1 = getColor(color)
                let water = new PIXI.Graphics();
                water.beginFill(color1);
                water.drawRect(0, 0, this.colorBase.width, this.colorBase.height * 6);
                water.y = this.colorBase.height * j
                containerColor.addChild(water)
            } else {
                var water = this.getWater(color)
                water.y = this.colorBase.height * j
                containerColor.addChild(water)
            }
        }
    }
    getWave(param) {
        var color = getColor(param)
        var containerWave = new Container();
        const water_wave = new PIXI.Sprite(this.resources.bottles.textures["wave.png"]);
        var scale_wave = this.bottleBase.width / water_wave.getBounds().width
        for (let i = 0; i < 3; i++) {
            const water_wave = new PIXI.Sprite(this.resources.bottles.textures["wave.png"]);
            water_wave.scale.set(scale_wave, scale_wave);
            water_wave.position.set(water_wave.getBounds().width * i, 0);
            containerWave.addChild(water_wave)
            water_wave.tint = color
        }
        return containerWave
    }
    updateColorWave(container, param) {
        var color = getColor(param)
        container.children.forEach(water_wave => { water_wave.tint = color });
    }
    runWave(container, index) {
        for (let i = 0; i < container.children.length; i++) {
            const water_wave = container.children[i];
            const water_wave_x = water_wave.x

            gsap.to(water_wave, {
                x: water_wave_x - water_wave.getBounds().width,
                onComplete: () => {
                    if (i == container.children.length - 1) {
                        container.children[0].x = container.children[container.children.length - 1].x + water_wave.getBounds().width;
                        var temp = container.children.shift()
                        container.children.push(temp)
                        if (this.listBottles[index].runWave) this.runWave(container, index)
                    }
                },
                duration: 0.5, ease: "none"
            })
        }
    }
    stopWave(index, wave) {
        this.listBottles[index].runWave = false
        wave.alpha = 0
        this.reDrawWater(index)
        this.listBottles[index].status = true;
    }
    getWave4(param) {
        var color = getColor(param)
        var containerWave = new Container();
        const water_wave = new PIXI.Sprite(this.resources.bottles.textures["wave4.png"]);
        var scale_wave = this.colorBase.width * 0.5 / water_wave.getBounds().width
        for (let i = 0; i < 8; i++) {
            const water_wave = new PIXI.Sprite(this.resources.bottles.textures["wave4.png"]);
            water_wave.scale.set(scale_wave, scale_wave);
            water_wave.position.set(water_wave.getBounds().width * i, 0);
            containerWave.addChild(water_wave)
            water_wave.tint = color
        }
        return containerWave
    }
    updateColorWave4(container, param) {
        var color = getColor(param)
        container.children.forEach(water_wave => { water_wave.tint = color });
    }
    runWave4Right(container, index) {
        container.alpha = 1
        container.pivot.x = this.colorBase.width * 0.7 * 2
        for (let i = 0; i < container.children.length; i++) {
            const water_wave = container.children[i];
            const water_wave_x = water_wave.x

            gsap.to(water_wave, {
                x: water_wave_x - water_wave.getBounds().width,
                onComplete: () => {
                    if (i == container.children.length - 1) {
                        container.children[0].x = container.children[container.children.length - 1].x + water_wave.getBounds().width;
                        var temp = container.children.shift()
                        container.children.push(temp)
                        if (this.listBottles[index].runWave4) this.runWave4Right(container, index)
                    }
                },
                duration: 0.4, ease: "none"
            })
        }
    }
    runWave4Left(container, index) {
        container.alpha = 1
        container.pivot.x = this.colorBase.width * 0.7 * 2
        for (let i = container.children.length - 1; i >= 0; i--) {
            const water_wave = container.children[i];
            const water_wave_x = water_wave.x

            gsap.to(water_wave, {
                x: water_wave_x + water_wave.getBounds().width,
                onComplete: () => {
                    if (i == container.children.length - 1) {
                        container.children[container.children.length - 1].x = 0;
                        var temp = container.children.pop()
                        container.children.unshift(temp)
                        if (this.listBottles[index].runWave4) this.runWave4Left(container, index)
                    }
                },
                duration: 0.4, ease: "none"
            })


        }
    }
    stopWave4(index, wave4) {
        this.listBottles[index].runWave4 = false
        wave4.alpha = 0
    }
    getWater(param) {
        var color = getColor(param)
        let water = new PIXI.Graphics();
        water.beginFill(color);
        water.drawRect(0, 0, this.colorBase.width, this.colorBase.height);
        return water
    }
    getColWater(param) {
        var color = getColor(param)
        let colWater = new PIXI.Graphics();
        colWater.beginFill(color);
        // water.pivot.x = this.bottleBase.height * 1.3;
        colWater.drawRect(0, 0, this.bottleBase.width * 0.07, this.bottleBase.height * 1.2);
        return colWater
    }
    clickBottle(param) {
        var map = this.data.map
        const indexChoose = param
        if (indexChoose != null) {
            if (this.listBottleA.length == this.listBottleB.length) {
                if (map[indexChoose].lastIndexOf(0) != 3) {
                    if (this.listBottles[indexChoose].status == true) {
                        var choose = this.getWaterChoose(indexChoose);
                        this.listBottleA.push(choose);
                        this.upBottle(indexChoose);
                    };
                };
            } else {
                var oldChoose = this.listBottleA[this.listBottleA.length - 1].index
                var newColor = this.getWaterEmpty(indexChoose);
                if (indexChoose != oldChoose && newColor.num > 0) {
                    var oldColor = this.listBottleA[this.listBottleA.length - 1]
                    if (newColor.color == oldColor.color || newColor.num == 4) {
                        this.listBottleB.push(newColor);
                        this.moveBottle();

                    } else {
                        this.downBottle(oldChoose);
                        if (this.listBottles[indexChoose].status == true) {
                            var choose = this.getWaterChoose(indexChoose);
                            this.listBottleA.push(choose);
                            this.upBottle(indexChoose);
                        };
                    }
                } else if (indexChoose == oldChoose) {
                    this.downBottle(indexChoose);
                } else {
                    this.downBottle(oldChoose);
                    if (this.listBottles[indexChoose].status == true) {
                        var choose = this.getWaterChoose(indexChoose);
                        this.listBottleA.push(choose);
                        this.upBottle(indexChoose);
                    };
                }
            }
        }
    }
    upBottle(indexChoose) {
        var isActive = this.bottleIsActive(this.listBottles)
        this.listBottles[indexChoose].status = false;
        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + indexChoose)
        containerBottle.zIndex = 2 + isActive
        var temp = this.bottleBase.indexRow.numR1
        var y = indexChoose < temp ? this.bottleBase.startY[0] - this.bottleBase.up : this.bottleBase.startY[1] - this.bottleBase.up;
        gsap.to(containerBottle, { y: y, duration: TIMEUP, ease: "none" })
            .eventCallback("onComplete", () => {
                this.listBottles[indexChoose].status = true;
            });
    }
    downBottle(indexChoose) {
        this.listBottles[indexChoose].status = false;
        this.listBottleA.pop();
        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + indexChoose)
        var temp = this.bottleBase.indexRow.numR1
        var y = indexChoose < temp ? this.bottleBase.startY[0] : this.bottleBase.startY[1];

        gsap.to(containerBottle, { y: y, duration: TIMEUP, ease: "none" })
            .eventCallback("onComplete", () => {
                this.listBottles[indexChoose].status = true;
                containerBottle.zIndex = 0
            });
    }
    convertMap(oldChoose, newChoose) {
        let oldColorArr = this.data.map[oldChoose.index]
        let newColorArr = this.data.map[newChoose.index]
        var num = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num
        while (num > 0) {
            num -= 1
            oldColorArr.splice(oldColorArr.lastIndexOf(0) + 1, 1, 0);
            newColorArr.splice(newColorArr.lastIndexOf(0), 1, oldChoose.color);
        }
        this.data.map.splice(oldChoose.index, 1, oldColorArr);
        this.data.map.splice(newChoose.index, 1, newColorArr);
    }
    getAzimuth() {
        var lead_Point = null;
        var change_pivot = false; // false bình đi đổ nghiêng bên trái, true bình đi đổ nghiên bên phải
        var x0 = this.bottleBase.startX[arguments[0]]
        var x1 = this.bottleBase.startX[arguments[1]]
        var y1 = arguments[1] >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0]

        var x0_lead_Point = x1 + this.bottleBase.width * 0.33
        var x1_lead_Point = x1 + this.bottleBase.width * 0.67
        var y_lead_Point = y1 - this.bottleBase.height * 0.225

        if (x0 > x1) {
            if (this.screenSize.width - x1_lead_Point < this.bottleBase.height * 0.9) {
                change_pivot = true
                lead_Point = { x: x0_lead_Point, y: y_lead_Point }
            } else {
                change_pivot = false
                lead_Point = { x: x1_lead_Point, y: y_lead_Point }
            }
        } else {
            if (x0_lead_Point < this.bottleBase.height * 0.9) {
                change_pivot = false
                lead_Point = { x: x1_lead_Point, y: y_lead_Point }
            } else {
                change_pivot = true
                lead_Point = { x: x0_lead_Point, y: y_lead_Point }
            }
        }

        return { change_pivot: change_pivot, lead_Point: lead_Point }
    }

    moveBottle() {
        var pourWater = this.resources.pourWater.sound

        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];
        var listColorWater0 = this.data.map[oldChoose.index].slice()
        var listColorWater1 = this.data.map[newChoose.index].slice()
        var azimuth = this.getAzimuth(oldChoose.index, newChoose.index) // điểm tiếp dẫn

        this.listBottles[oldChoose.index].status = false;
        this.listBottles[newChoose.index].status = false;

        this.convertMap(oldChoose, newChoose)
        var iscomplete = this.checkWin()
        var bottleComplete = checkCompleteItem(this.data.map[newChoose.index])

        var containerBottle0 = this.containerPlaying.getChildByName('container_bottle_' + oldChoose.index)
        var containerBottleMask0 = containerBottle0.getChildByName('container_bottle_mask_' + oldChoose.index)
        var containerColor0 = containerBottle0.getChildByName('container_color_' + oldChoose.index)
        var wave4 = containerBottle0.getChildByName('wave4_' + oldChoose.index)
        var wave0 = containerBottle0.getChildByName('wave_' + oldChoose.index)

        var containerBottle1 = this.containerPlaying.getChildByName('container_bottle_' + newChoose.index)
        var containerColor1 = containerBottle1.getChildByName('container_color_' + newChoose.index)
        var colWater1 = containerBottle1.getChildByName('colWater_' + newChoose.index)
        var wave = containerBottle1.getChildByName('wave_' + newChoose.index)

        var amount_water_poured = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num

        var degrees = this.getAngle(listColorWater0.lastIndexOf(0) + 1, listColorWater0.lastIndexOf(0) + amount_water_poured)



        this.listBottles[newChoose.index].num += 1
        this.listBottles[newChoose.index].new.push({ color: oldChoose.color, num: amount_water_poured, progress: 0, id: oldChoose.index, listColor: listColorWater1 })


        this.listBottles[oldChoose.index].runWave4 = true
        this.updateColorWave4(wave4, oldChoose.color)
        var radians = null;

        var distance = getDistance({ x: containerBottle0.x, y: containerBottle0.y }, azimuth.lead_Point);
        //#
        if (azimuth.change_pivot) {
            var widthBottleMask0 = containerBottleMask0.getBounds().width
            containerBottle0.pivot.x = widthBottleMask0
            containerBottle0.x = this.bottleBase.startX[oldChoose.index] + widthBottleMask0

            containerBottleMask0.pivot.x = widthBottleMask0
            containerBottleMask0.x = widthBottleMask0

            containerColor0.pivot.x = containerColor0.getBounds().width
            containerColor0.x = containerBottleMask0.x
            radians = { start: degrees_to_radians(degrees.start), end: degrees_to_radians(degrees.end) }
            this.runWave4Right(wave4, oldChoose.index)

            if (distance < this.bottleBase.width * 1.5) {
                distance += this.bottleBase.width * 1.3
            } else distance += this.bottleBase.width
        } else {
            radians = { start: -degrees_to_radians(degrees.start), end: -degrees_to_radians(degrees.end) }
            this.runWave4Left(wave4, oldChoose.index)
            if (distance < this.bottleBase.width * 1.1) {
                distance += this.bottleBase.width * 1.6
            }
        }
        var timeMove = (distance / this.speed.a) / 1000
        var timeMove1 = (distance / this.speed.b) / 1000
        var timeRot = 0.7 * amount_water_poured

        // var timeWait = timeMove + timeRot
        gsap.timeline()
            .to(containerBottle0, {
                x: azimuth.lead_Point.x,
                y: azimuth.lead_Point.y,
                onComplete: () => { },
                duration: timeMove, ease: "none"
            })
            .to(containerBottle0, {
                x: azimuth.change_pivot ? this.bottleBase.startX[oldChoose.index] + widthBottleMask0 : this.bottleBase.startX[oldChoose.index], //#
                y: oldChoose.index >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0],
                duration: timeMove1, ease: "none"
            }, "+=" + timeRot)
            .eventCallback("onComplete", () => {
                //#
                if (azimuth.change_pivot) {
                    containerBottle0.pivot.x = 0
                    containerBottle0.x = this.bottleBase.startX[oldChoose.index]
                    containerBottleMask0.pivot.x = 0
                    containerBottleMask0.x = 0
                    containerColor0.pivot.x = 0
                    containerColor0.x = containerBottleMask0.x
                }
                this.listBottles[oldChoose.index].status = true;
            });

        gsap.timeline()
            //Nghiêng bình lần 1
            .to(containerBottleMask0, {
                rotation: radians.start,
                duration: timeMove, ease: "none",
                onUpdate: () => { this.tilt1(containerBottleMask0, containerColor0, radians, listColorWater0, wave4) },
                onComplete: () => {
                    this.updateColorWave(wave, oldChoose.color)
                    if (this.listBottles[newChoose.index].num == 1) {
                        if (!this.listBottles[newChoose.index].runWave) {
                            wave.alpha = 1
                            this.listBottles[newChoose.index].runWave = true
                            this.runWave(wave, newChoose.index)
                            this.listBottles[newChoose.index].instance = pourWater.play()
                        }
                    }
                }
            })
            // nghiêng bình lần 2
            .to(containerBottleMask0, {
                rotation: radians.end,
                duration: timeRot, ease: "none",
                onUpdate: () => {
                    this.showColWater(colWater1, oldChoose.color, azimuth.change_pivot);
                    this.tilt2(containerBottleMask0, containerColor0, radians, amount_water_poured, listColorWater0)
                    var bottleRadians = containerBottleMask0.rotation - radians.start;
                    var progress = bottleRadians / (radians.end - radians.start)
                    for (let i = 0; i < this.listBottles[newChoose.index].new.length; i++) {
                        const element = this.listBottles[newChoose.index].new[i];
                        if (element.id == oldChoose.index) element.progress = progress * amount_water_poured
                    }
                    const total_num = this.listBottles[newChoose.index].new.reduce((t, { num }) => t + num, 0)
                    const total_progress = (this.listBottles[newChoose.index].new.reduce((t, { progress }) => t + progress, 0)) / total_num

                    this.upWaterBottle(this.listBottles[newChoose.index].new[0].listColor, total_num, total_progress, containerColor1, oldChoose.color, wave)
                },
                onComplete: () => {
                    this.hideColWater(colWater1);
                    this.stopWave4(oldChoose.index, wave4);
                    this.listBottles[newChoose.index].num -= 1;
                    if (this.listBottles[newChoose.index].num == 0 && this.listBottles[newChoose.index].runWave) {
                        this.stopWave(newChoose.index, wave);
                        this.listBottles[newChoose.index].instance.stop()
                        if (bottleComplete) this.setFirework(containerBottle1.x + this.bottleBase.width / 2,
                            containerBottle1.y + this.bottleBase.height * 1.35, iscomplete)
                        //  this.setConfetti(containerBottle1.x + this.bottleBase.width / 2,
                        // containerBottle1.y + this.bottleBase.height,
                        // this.app.screen.width * 0.25)

                        console.log('---------- rot xong --------');
                    }
                }
            })
            // xoay trả về 
            .to(containerBottleMask0, {
                rotation: 0,
                duration: timeMove1, ease: "none",
                onUpdate: () => { this.tilt3(containerBottleMask0, containerColor0, radians, oldChoose, wave4) },
                onComplete: () => {
                    var map = this.data.map
                    var indexWaterExist = map[oldChoose.index].lastIndexOf(0) + 1
                    if (indexWaterExist < 3) {
                        wave4.y = containerColor0.children[indexWaterExist].y - wave4.getBounds().height * 0.7 + this.bottleBase.empty
                        wave0.y = containerColor0.children[indexWaterExist].y - wave0.getBounds().height * 0.8 + this.bottleBase.empty
                    } else {
                        wave4.y = containerColor0.children[3].y + containerColor0.children[3].getBounds().height - wave4.getBounds().height * 0.7 + this.bottleBase.empty
                        wave0.y = containerColor0.children[3].y + containerColor0.children[3].getBounds().height - wave0.getBounds().height * 0.8 + this.bottleBase.empty
                    }

                    if (this.listBottles[newChoose.index].status) {
                        this.listBottles[newChoose.index].new = []
                    }
                    containerBottle0.zIndex = 0
                }
            })


    }
    tilt1(containerBottleMask0, containerColor, radians, listColorWater0, wave4) {
        var emptyWater = listColorWater0.lastIndexOf(0) + 1
        var bottleRadians = containerBottleMask0.rotation;
        var progress = bottleRadians / radians.start
        var heightContainerColorDefaut = this.colorBase.height * 9
        var heightContainer = Math.cos(Math.abs(bottleRadians)) * heightContainerColorDefaut

        var heightContainerUse = heightContainer - emptyWater * this.colorBase.height * (1 - progress)

        for (let i = 0; i < containerColor.children.length; i++) {
            let indexColor = listColorWater0[i]
            let color = getColor(indexColor)
            let water = containerColor.children[i]
            var heightwater = i < emptyWater ? this.colorBase.height * (1 - progress) : heightContainerUse / (9 - emptyWater)
            if (i == 3) heightwater = this.colorBase.height * 6

            water.clear();
            water.beginFill(color);
            water.drawRect(0, 0, this.colorBase.width, heightwater);
            water.y = i == 0 ? 0 : containerColor.children[i - 1].y + containerColor.children[i - 1].getBounds().height
            if (i == emptyWater) {
                wave4.y = water.y + this.bottleBase.empty * (1 - progress) - wave4.getBounds().height * 0.7
            }
        }
        containerColor.y = this.bottleBase.empty * (1 - progress)
    }
    tilt2(containerBottleMask0, containerColor, radians, amount_water_poured, listColorWater0) {
        containerColor.y = 0
        var emptyWater = listColorWater0.lastIndexOf(0) + 1
        var bottleRadians = containerBottleMask0.rotation - radians.start;
        var progress = bottleRadians / (radians.end - radians.start)
        var heightContainerColorDefaut = Math.cos(Math.abs(radians.start)) * this.colorBase.height * 9
        var heightColorDefaut = heightContainerColorDefaut / (9 - emptyWater)
        var heightContainer = Math.cos(Math.abs(containerBottleMask0.rotation)) * this.colorBase.height * 9

        var heightContainerUse = heightContainer - amount_water_poured * heightColorDefaut * (1 - progress)
        var newHeightWaterDefaut = heightContainerUse / (9 - emptyWater - amount_water_poured)
        for (let i = 0; i < containerColor.children.length; i++) {
            let indexColor = listColorWater0[i]
            let color = getColor(indexColor)
            let water = containerColor.children[i]
            var heightwater = newHeightWaterDefaut
            if (i < emptyWater + amount_water_poured) {
                heightwater = i < emptyWater ? 0 : heightColorDefaut * (1 - progress)
                if (i == 3) heightwater += heightColorDefaut
            } else if (i == 3) heightwater = heightColorDefaut * 6
            water.clear();
            water.beginFill(color);
            water.drawRect(0, 0, this.colorBase.width, heightwater);
            water.y = i == 0 ? 0 : containerColor.children[i - 1].y + containerColor.children[i - 1].getBounds().height
        }
    }
    tilt3(containerBottleMask0, containerColor, radians, oldChoose, wave4) {
        var listColorWater0 = this.data.map[oldChoose.index].slice()
        var bottleRadians = containerBottleMask0.rotation;
        var heightContainer = Math.cos(Math.abs(bottleRadians)) * this.colorBase.height * 9
        var newHeightWaterDefaut = heightContainer / 9
        var progress = bottleRadians / (radians.end)

        var emptyWaterEnd = listColorWater0.lastIndexOf(0) + 1
        for (let i = 0; i < containerColor.children.length; i++) {
            let indexColor = listColorWater0[i]
            let color = getColor(indexColor)
            let water = containerColor.children[i]
            var heightwater = newHeightWaterDefaut
            if (i < emptyWaterEnd) {
                heightwater = newHeightWaterDefaut * (1 - progress)
                water.alpha = 0
            } else if (i == 3) heightwater = newHeightWaterDefaut * 6
            water.clear();
            water.beginFill(color);
            water.drawRect(0, 0, this.colorBase.width, heightwater);
            water.y = i == 0 ? 0 : containerColor.children[i - 1].y + containerColor.children[i - 1].getBounds().height
            if (i == emptyWaterEnd) wave4.y = water.y + this.bottleBase.empty * (1 - progress) - wave4.getBounds().height * 0.7
        }
        containerColor.y = this.bottleBase.empty * (1 - progress)
    }
    upWaterBottle(listColor, total_num, total_progress, containerColor1, indexColor, wave) {

        var water_empty = listColor.lastIndexOf(0) + 1
        var water_exist = 4 - water_empty
        var emptyWaterEnd = 4 - total_num - water_exist
        var newArrColor = listColor.slice(water_empty)
        while (containerColor1.children[0]) {
            containerColor1.removeChild(containerColor1.children[0]);
        }
        var heightEmpty = this.colorBase.height * emptyWaterEnd + total_num * this.colorBase.height * (1 - total_progress)
        var heightVariability = this.colorBase.height * total_num * total_progress

        let color = getColor(indexColor)
        let water = new PIXI.Graphics();
        water.beginFill(color);
        water.drawRect(0, 0, this.colorBase.width, heightVariability);
        water.y = heightEmpty
        containerColor1.addChild(water)
        for (let i = 0; i < newArrColor.length; i++) {
            const indexColor1 = newArrColor[i];
            var heightwater = this.colorBase.height
            if (i == newArrColor.length - 1) heightwater = this.colorBase.height * 6
            let color1 = getColor(indexColor1)
            let water = new PIXI.Graphics();
            water.beginFill(color1);
            water.drawRect(0, 0, this.colorBase.width, heightwater);
            water.y = i == 0 ? (emptyWaterEnd + total_num) * this.colorBase.height : containerColor1.children[i].y + this.colorBase.height
            containerColor1.addChild(water)
        }
        wave.y = heightEmpty + this.bottleBase.empty - wave.getBounds().height * 0.8
    }
    showColWater(colWater, indexColor, change_pivot) {
        var color = getColor(indexColor)
        colWater.alpha = 1
        colWater.clear();
        colWater.beginFill(color);
        colWater.drawRect(0, 0, this.bottleBase.width * 0.08, this.bottleBase.height * 1.2);
        colWater.x = change_pivot ? this.bottleBase.width * 0.24 : this.bottleBase.width * 0.67
    }
    hideColWater(colWater) {
        colWater.alpha = 0
    }
    getWaterEmpty(index) {
        var map = this.data.map
        var arrcolor = map[index]
        var color = null;
        var indexEmpty = arrcolor.lastIndexOf(0)
        if (indexEmpty == 3) return { index: index, color: color, num: indexEmpty + 1 }
        else {
            color = arrcolor[indexEmpty + 1]
            return { index: index, color: color, num: indexEmpty + 1 }
        }

    }
    getWaterChoose(index) {
        var map = this.data.map
        var arrcolor = map[index]
        var indexEmpty = arrcolor.lastIndexOf(0)
        var color = arrcolor[indexEmpty + 1]
        var num = 1;
        for (let i = indexEmpty + 2; i < arrcolor.length; i++) {
            const newColor = arrcolor[i]

            if (newColor == color) {
                num += 1
            } else break;
        }
        return { index: index, color: color, num: num }
    }
    getAngle(min, max) {
        var start, end
        switch (min) {
            case 0: start = 43;
                break;
            case 1: start = 63;
                break;
            case 2: start = 75;
                break;
            case 3: start = 84;
                break;
        }
        switch (max) {
            case 0: end = 63;
                break;
            case 1: end = 75;
                break;
            case 2: end = 84;
                break;
            case 3: end = 90;
                break;
        }
        return { start: start, end: end }

    }
    setButton() {
        const btn_setting = new PIXI.Sprite(this.resources.setting.textures["btn_setting.png"]);
        btn_setting.name = 'btn_setting'
        const scale_btn_setting = (this.screenSize.width * 0.15) / btn_setting.getBounds().width
        btn_setting.scale.set(scale_btn_setting, scale_btn_setting);
        btn_setting.position.set(this.screenSize.width * 0.05, btn_setting.height / 2.5);

        const btn_ads = new PIXI.Sprite(this.resources.setting.textures["btn_ads.png"]);
        btn_ads.name = 'btn_ads'
        btn_ads.scale.set(scale_btn_setting, scale_btn_setting);
        btn_ads.position.set(this.screenSize.width - this.screenSize.width * 0.05 - btn_ads.width, btn_ads.height / 2.5);

        const separator_line = new PIXI.Sprite(this.resources.separator_line.texture);
        const scale_separator_line = this.screenSize.width / separator_line.width
        separator_line.scale.set(scale_separator_line, scale_separator_line);
        separator_line.position.set(0, btn_setting.height * 1.5);


        const btn_retry = new PIXI.Sprite(this.resources.setting.textures["btn_retry.png"]);
        btn_retry.name = 'btn_retry'
        btn_retry.scale.set(scale_btn_setting, scale_btn_setting);
        btn_retry.position.set(this.screenSize.width * 0.1, (this.screenSize.height * 9.3 / 10) - btn_retry.height * 1.5);

        const btn_back = new PIXI.Sprite(this.resources.setting.textures["Layer 87 copy1.png"]);
        btn_back.name = 'btn_back'
        btn_back.scale.set(scale_btn_setting, scale_btn_setting);
        btn_back.position.set(this.screenSize.width - this.screenSize.width * 0.1 - btn_back.width, btn_retry.y);

        this.containerButton.addChild(btn_setting, btn_ads, separator_line, btn_retry, btn_back);


        btn_setting.interactive = true;
        btn_ads.interactive = true;
        btn_retry.interactive = true;
        btn_back.interactive = true;


        btn_setting.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            this.openSetting()
        });
        btn_ads.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            var isActive = this.bottleIsActive(this.listBottles)
            if(isActive == 0)this.addBottle()
            
        });
        btn_retry.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            var isActive = this.bottleIsActive(this.listBottles)
            if(isActive == 0)this.replayGame()
        });
        btn_back.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            var isActive = this.bottleIsActive(this.listBottles)
            if(isActive == 0)this.previousStep()
        });

        this.drawSetting()
        this.drawTextBack()
    }
    //setting
    drawSetting() {
        var bg_setting = new PIXI.Sprite(this.resources.setting.textures["Bar_setting.png"]);
        var scale_bg_setting = (this.screenSize.width * 0.8) / bg_setting.width
        bg_setting.scale.set(scale_bg_setting, scale_bg_setting);
        bg_setting.position.set(0, 0);


        var logo = new PIXI.Sprite(this.resources.setting.textures["dino_flip.png"]);
        var scale_logo = (this.screenSize.width / 3) / logo.width
        logo.scale.set(scale_logo, scale_logo);
        logo.position.set((bg_setting.width - logo.width) / 1.8, bg_setting.y + bg_setting.height / 4.5);

        var btn_close = new PIXI.Sprite(this.resources.setting.textures["btn_close.png"]);
        btn_close.scale.set(scale_bg_setting * 1.05, scale_bg_setting * 1.05);
        btn_close.position.set(bg_setting.x + bg_setting.width - btn_close.width * 1.03, bg_setting.y + btn_close.height / 4);

        var btn_setting = new PIXI.Sprite(this.resources.setting.textures["setting.png"]);
        btn_setting.scale.set(scale_bg_setting, scale_bg_setting);
        btn_setting.position.set((bg_setting.width - btn_setting.width) / 2, bg_setting.y + bg_setting.height / 25);

        var police = new PIXI.Sprite(this.resources.setting.textures["police.png"]);
        police.scale.set(scale_bg_setting, scale_bg_setting);
        police.position.set((bg_setting.width - police.width) / 2, bg_setting.y + bg_setting.height * 0.875);

        var btn_device_vibrate = new PIXI.Sprite(this.resources.setting.textures["btn_device.png"]);
        btn_device_vibrate.scale.set(scale_bg_setting * 0.95, scale_bg_setting * 0.95);
        btn_device_vibrate.position.set(bg_setting.width / 2 - btn_device_vibrate.width * 1.1, logo.y + logo.height * 1.15);

        var vibration_on = new PIXI.Sprite(this.resources.setting.textures["vibration_on.png"]);
        vibration_on.name = 'vibration_on.png'
        vibration_on.scale.set(scale_bg_setting, scale_bg_setting);
        vibration_on.position.set(btn_device_vibrate.x + (btn_device_vibrate.width - vibration_on.width) / 2,
            btn_device_vibrate.y + (btn_device_vibrate.height - vibration_on.height) / 2);

        var vibration_off = new PIXI.Sprite(this.resources.setting.textures["vibration_off.png"]);
        vibration_off.name = 'vibration_off.png'
        vibration_off.scale.set(scale_bg_setting, scale_bg_setting);
        vibration_off.position.set(btn_device_vibrate.x + (btn_device_vibrate.width - vibration_off.width) / 2,
            btn_device_vibrate.y + (btn_device_vibrate.height - vibration_off.height) / 2);


        var btn_device_sound = new PIXI.Sprite(this.resources.setting.textures["btn_device.png"]);
        btn_device_sound.scale.set(scale_bg_setting * 0.95, scale_bg_setting * 0.95);
        btn_device_sound.position.set(bg_setting.width / 2 + btn_device_sound.width * 0.1, logo.y + logo.height * 1.15);


        var sound_on = new PIXI.Sprite(this.resources.setting.textures["sound_on.png"]);
        sound_on.name = 'sound_on.png'
        sound_on.scale.set(scale_bg_setting, scale_bg_setting);
        sound_on.position.set(btn_device_sound.x + (btn_device_sound.width - sound_on.width) / 2,
            btn_device_sound.y + (btn_device_sound.height - sound_on.height) / 2);

        var sound_off = new PIXI.Sprite(this.resources.setting.textures["sound_off.png"]);
        sound_off.name = 'sound_off.png'
        sound_off.scale.set(scale_bg_setting, scale_bg_setting);
        sound_off.position.set(btn_device_sound.x + (btn_device_sound.width - sound_off.width) / 2,
            btn_device_sound.y + (btn_device_sound.height - sound_off.height) / 2);

        if (this.sound) sound_off.alpha = 0
        else sound_on.alpha = 0
        if (this.vibration) vibration_off.alpha = 0
        else vibration_on.alpha = 0

        this.containerSettings.addChild(bg_setting, logo, btn_close, btn_setting, police, btn_device_vibrate, btn_device_sound, vibration_on, vibration_off, sound_on, sound_off)
        this.containerSettings.x = (this.screenSize.width - this.containerSettings.getBounds().width) / 2
        // this.containerSettings.y = this.containerSettings.getBounds().height / 3
        this.containerSettings.y = - this.containerSettings.getBounds().height


        btn_close.interactive = true;
        btn_device_vibrate.interactive = true;
        btn_device_sound.interactive = true;

        btn_close.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            this.closeSetting()
        });
        btn_device_vibrate.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            if (this.vibration) {
                this.vibration = false
                vibration_off.alpha = 1
                vibration_on.alpha = 0
            } else {
                this.vibration = true
                vibration_off.alpha = 0
                vibration_on.alpha = 1
            }
        });
        btn_device_sound.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            if (this.sound) {
                sound.toggleMuteAll(false);
                this.sound = false
                sound_off.alpha = 1
                sound_on.alpha = 0
            } else {
                sound.toggleMuteAll(true);
                this.sound = true
                sound_off.alpha = 0
                sound_on.alpha = 1
            }
        });
    }
    openSetting() {
        this.containerPlaying.interactiveChildren = false;
        this.containerButton.interactiveChildren = false
        this.diaphragm.alpha = 0.7
        gsap.timeline()
            .to(this.containerSettings, { y: this.containerSettings.getBounds().height / 3, duration: 0.55, ease: "back.out(2.5)" })
    }
    closeSetting() {
        this.diaphragm.alpha = 0
        gsap.timeline()
            .to(this.containerSettings, { y: - this.containerSettings.getBounds().height, duration: 0.5, ease: "back.in(2)" })
        this.containerPlaying.interactiveChildren = true;
        this.containerButton.interactiveChildren = true;
    }
    drawTextLevel() {
        while (this.containerLevel.children[0]) {
            this.containerLevel.removeChild(this.containerLevel.children[0]);
        }
        // this.app.stage.removeChild(this.containerLevel)
        this.containerLevel = new Container();
        this.containerLevel.name = 'container Level'
        this.containerLevel.zIndex = 1
        this.app.stage.addChild(this.containerLevel)

        var levelCr = this.level + ''
        var percent = levelCr.length == 1 ? 1.5 : levelCr.length == 2 ? 1.7 : 2
        var btn_ads = this.containerButton.getChildByName('btn_ads')
        var btn_setting = this.containerButton.getChildByName('btn_setting')

        var widthLevel = (btn_ads.x - btn_setting.x - btn_setting.width) * percent / 3
        var level = new PIXI.Sprite(this.resources.number.textures["Level.png"]);

        this.containerLevel.addChild(level)
        for (let i = 0; i < levelCr.length; i++) {
            var num = 'LV_' + levelCr.charAt(i) + '.png'
            var txtNum = new PIXI.Sprite(this.resources.number.textures[num]);
            txtNum.x = i == 0 ? this.containerLevel.width * 1.1 : this.containerLevel.width
            this.containerLevel.addChild(txtNum)
        }

        var scaleContainer = widthLevel / this.containerLevel.getBounds().width
        this.containerLevel.scale.set(scaleContainer, scaleContainer);

        this.containerLevel.position.set((this.app.screen.width - this.containerLevel.width) / 2,
            btn_setting.y + btn_setting.height - this.containerLevel.height * 1.5);
    }
    drawTextBack() {
        var temp = this.containerButton.getChildByName('textBack')
        if (temp) {
            this.containerButton.removeChild(temp);
        }
        var btn_back = this.containerButton.getChildByName('btn_back')

        var num = 'number_' + this.back + '.png'
        var text_back = new PIXI.Sprite(this.resources.number.textures[num]);
        text_back.name = 'textBack'

        var scale_text_back = (btn_back.width / 8) / text_back.width;

        text_back.scale.set(scale_text_back, scale_text_back);
        text_back.position.set(
            btn_back.x + (btn_back.width - text_back.width) / 1.8,
            btn_back.y + btn_back.height - text_back.height * 1.5)

        this.containerButton.addChild(text_back)
    }

    //level
    getBackData(backLevel) {
        loaderBackData
            .reset()
            .add('map', "assets/levels/Lv_" + backLevel + ".json")
            .load(() => {
                this.player.level -= 1
                this.game.nextLevel()
                this.player.map = loaderBackData.resources.map.data.ids
                this.game.init()
                this.getNextLevelData()
                this.sendDataFacebook()
            });
    }

    getNextLevelData() {
        loaderNextData.resources = {}
        this.dataLevelNextLoad = false;
        let nextLevel = this.level + 1
        loaderNextData
            .reset()
            .add('map', "assets/levels/Lv_" + nextLevel + ".json")
            .load(() => {
                this.dataLevelNextLoad = true;
            });
        loaderNextData.onError.add(() => { this.dataLevelNextLoad = null });
    }

    //event
    replayGame() {
        this.back = 5
        this.setDefautBack()
        this.drawTextBack()
        this.removeChildContainerPlaying()
        this.data.bottle -= numBottleAdd
        numBottleAdd = 0
        this.clearDataLevel();
        this.data = converLevel(this.resources.map.data.ids)

        this.setLCBottle(this.data.bottle)
        this.setBottle()
        this.drawTextLevel()
    }

    previousStep() {
        if (this.listBottleB.length != 0 && this.back > 0) {
            var map = this.data.map
            this.back--
            this.drawTextBack()
            let oldChoose = this.listBottleA[this.listBottleA.length - 1];
            let newChoose = this.listBottleB[this.listBottleB.length - 1];

            let oldColorArr = map[oldChoose.index].slice()
            let newColorArr = map[newChoose.index].slice()

            var num = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num
            while (num > 0) {
                num -= 1
                newColorArr.splice(newColorArr.lastIndexOf(0) + 1, 1, 0);
                oldColorArr.splice(oldColorArr.lastIndexOf(0), 1, oldChoose.color);
            }

            map.splice(oldChoose.index, 1, oldColorArr);
            map.splice(newChoose.index, 1, newColorArr);
            this.listBottleA.pop()
            this.listBottleB.pop()
            this.listBottle = [];
            this.removeChildContainerPlaying()

            this.setLCBottle(this.data.bottle)
            this.setBottle()
            this.drawTextLevel()
        }
        //  else if (this.back <= 0 && this.plus && this.adSupport) this.ads_facebook.showvideoBack()
    }

    addBottle() {
        if (this.data.bottle <= 15) {
            this.data.map.push([0, 0, 0, 0]);
            numBottleAdd++
            this.data.bottle += 1
            this.listBottle = [];
            this.removeChildContainerPlaying()
            // var preMap = this.map.slice()

            this.setLCBottle(this.data.bottle)
            this.setBottle()
            this.drawTextLevel()

            const btn_ads = this.containerButton.getChildByName("btn_ads")
            btn_ads.alpha = 0.5;
            btn_ads.interactive = false;
        }
    }


    setDefautBack() {
        // this.plus = true
        var btn_back = this.containerButton.getChildByName('btn_back')
        btn_back.alpha = 1;
        btn_back.interactive = true
    }
    clearDataLevel() {
        // this.pixiRemoveAllChildren(this.confettiContainer)
        this.listBottle = [];
        this.listBottleA = [];
        this.listBottleB = [];
        this.complete = true;
    }


    setConfetti(x, y, width) {
        var confetti = new Spine(this.resources.confetti.spineData);
        confetti.skeleton.setToSetupPose();
        confetti.update(0);
        const win = new PIXI.Container();
        win.addChild(confetti);
        const localRect = confetti.getLocalBounds();

        confetti.position.set(-localRect.x, -localRect.y);

        win.scale.set(width / win.width, width / win.width);
        win.position.set(x - win.width * 0.45, y - win.height * 0.8);
        this.confettiContainer.addChild(win);

        confetti.state.setAnimation(0, 'animation', false);
        confetti.state.timeScale = 1.3
    }

    drawWin() {
        // this.PlaySound('win')
        this.resources.show_Victory.sound.play()
        this.diaphragm.alpha = 0.7

        this.setCheerBelow()
        this.setFireworkBelow()
        // this.setConfettiWin('left', true)
        // this.setConfettiWin('right', false)

        const btn_next = new PIXI.Sprite(this.resources.setting.textures["btn_next.png"]);
        btn_next.scale.set((this.screenSize.width * 0.36) / btn_next.width, (this.screenSize.width * 0.35) / btn_next.width);
        btn_next.position.set(-btn_next.width, this.app.screen.height * 0.57);
        this.containerWin.addChild(btn_next)
        btn_next.interactive = true;

        var tl = gsap.timeline();
        tl.delay(1)
        tl.to(btn_next, { duration: 0.4, x: (this.app.screen.width - btn_next.width) / 2, ease: "back.out(2)" })

        btn_next.on('pointerdown', () => {
            this.resources.button_Click.sound.play()
            this.nextLevel()
        });

        setTimeout(() => {
            this.setFireworkLeft()
            this.setFireworkRight()
        }, 600);

    }

    setCheerBelow() {
        var highscore = new Spine(this.resources.Highscore.spineData);
        highscore.skeleton.setToSetupPose();
        highscore.update(0);
        const win = new PIXI.Container();
        win.addChild(highscore);
        const localRect = highscore.getLocalBounds();

        highscore.position.set(-localRect.x, -localRect.y);

        const scale = Math.min((this.screenSize.width * 1.23) / win.width, (this.screenSize.height) / win.height);
        win.scale.set(scale, scale);
        win.position.set((this.screenSize.width - win.width * 1.08) * 0.5, this.screenSize.height);

        this.containerWin.addChild(win);
        highscore.state.setAnimation(0, 'animation', true);
    }
    setFireworkBelow() {
        var fireworkBelow = new Spine(this.resources.winscr.spineData);
        fireworkBelow.skeleton.setToSetupPose();
        fireworkBelow.update(0);
        const win = new PIXI.Container();
        win.addChild(fireworkBelow);
        const localRect = fireworkBelow.getLocalBounds();

        fireworkBelow.position.set(-localRect.x, -localRect.y);

        const scale = Math.min((this.screenSize.width * 1.2) / win.width, (this.screenSize.height) / win.height,);
        win.scale.set(scale, scale);
        win.position.set((this.screenSize.width - win.width) / 2, -win.height * 0.15);

        this.containerWin.addChild(win);

        fireworkBelow.state.setAnimation(0, 'Appear', false);
        fireworkBelow.state.addAnimation(0, 'Idle', true, 0);
    }
    // setConfettiWin(position, status) {
    //     var confetti = new Spine(this.resources.confetti.spineData);
    //     confetti.skeleton.setToSetupPose();
    //     const win = new PIXI.Container();
    //     win.addChild(confetti);
    //     const localRect = confetti.getLocalBounds();
    //     confetti.position.set(-localRect.x, -localRect.y);
    //     confetti.update(0);
    //     if (position == 'left') {
    //         win.scale.set((this.screenSize.width * 0.3) / win.width, (this.screenSize.width * 0.3) / win.width);
    //         win.position.set(-win.width / 2.5, win.height);
    //     } else {
    //         confetti.skeleton.scaleX = -1;
    //         win.scale.set((this.screenSize.width * 0.3) / win.width, (this.screenSize.width * 0.3) / win.width);
    //         win.position.set(this.screenSize.width - win.width / 2.5, win.height * 1.1);
    //     }
    //     this.containerWin.addChild(win);
    //     confetti.state.setAnimation(0, 'animation2', status);
    // }
    setFireworkLeft() {

        this.resources.sound_firework.sound.play()
        var firework00 = this.resources["winleftfirework00"].spritesheet.animations["firework"]
        var firework01 = this.resources["winleftfirework01"].spritesheet.animations["firework"]
        var firework02 = this.resources["winleftfirework02"].spritesheet.animations["firework"]
        var firework03 = this.resources["winleftfirework03"].spritesheet.animations["firework"]
        var firework04 = this.resources["winleftfirework04"].spritesheet.animations["firework"]
        var texture = firework00.concat(firework01, firework02, firework03, firework04)
        var firework = new PIXI.AnimatedSprite(texture);
        firework.zIndex = 5
        firework.name = 'FireworkLeft'
        this.containerWin.addChild(firework)

        var scaleFirework = this.screenSize.width * 0.9 / firework.getBounds().width
        firework.scale.set(scaleFirework, scaleFirework);
        firework.y = - firework.getBounds().height * 0.1

        firework.animationSpeed = 0.7
        firework.play()
        firework.onLoop = () => {
            this.resources.sound_firework.sound.play()
        };
    }
    setFireworkRight() {
        this.resources.sound_firework.sound.play()
        var firework00 = this.resources["winrightfirework00"].spritesheet.animations["firework"]
        var firework01 = this.resources["winrightfirework01"].spritesheet.animations["firework"]
        var firework02 = this.resources["winrightfirework02"].spritesheet.animations["firework"]
        var firework03 = this.resources["winrightfirework03"].spritesheet.animations["firework"]
        var texture = firework00.concat(firework01, firework02, firework03)
        var firework = new PIXI.AnimatedSprite(texture);
        firework.zIndex = 5
        firework.name = 'FireworkRight'
        this.containerWin.addChild(firework)
        var scaleFirework = this.screenSize.width * 0.9 / firework.getBounds().width
        firework.scale.set(scaleFirework, scaleFirework);
        firework.x = this.screenSize.width - firework.getBounds().width
        firework.y = - firework.getBounds().height * 0.1
        firework.animationSpeed = 0.7
        firework.play()
        firework.onLoop = () => {
            this.resources.sound_firework.sound.play()
        };
    }
    removeWin() {
        var fireworkLeft = this.containerWin.getChildByName('FireworkLeft')
        var fireworkRight = this.containerWin.getChildByName('FireworkRight')
        fireworkLeft.stop()
        fireworkRight.stop()
        while (this.containerWin.children[0]) {
            this.containerWin.removeChild(this.containerWin.children[0]);
        }
    }

    setFirework(x, y, iscomplete) {
        var playWin = false
        if (iscomplete && this.complete) {
            this.complete = false; 
            this.containerPlaying.interactiveChildren = false;
            this.containerButton.interactiveChildren = false;
            playWin = true
        }
        this.resources.containerFinish.sound.play()
        var firework00 = this.resources["firework00"].spritesheet.animations["firework"]
        var firework01 = this.resources["firework01"].spritesheet.animations["firework"]
        var firework02 = this.resources["firework02"].spritesheet.animations["firework"]
        var firework03 = this.resources["firework03"].spritesheet.animations["firework"]
        var firework04 = this.resources["firework04"].spritesheet.animations["firework"]
        var texture = firework00.concat(firework01, firework02, firework03, firework04)
        var firework = new PIXI.AnimatedSprite(texture);
        firework.zIndex = 2
        this.app.stage.addChild(firework)

        var scaleFirework = this.screenSize.width * 0.8 / firework.getBounds().width
        firework.scale.set(scaleFirework, scaleFirework);
        firework.x = x
        firework.y = y
        firework.loop = false
        firework.anchor.set(0.5, 1);
        firework.animationSpeed = 0.7
        firework.play()
        firework.onComplete = () => { this.app.stage.removeChild(firework) };
        firework.onFrameChange = () => {
            if (firework.currentFrame == Math.round(firework.totalFrames * 2 / 3) && playWin) this.drawWin()
        };

    }

    checkWin() {
        var win = 0;
        for (let i = 0; i < this.data.map.length; i++) {
            const listColor = this.data.map[i];
            const color0 = listColor[0];
            let isWin = listColor.every(function (item) {
                return item == color0;
            });
            if (isWin) win++;
        }
        if (win == this.data.bottle) return true;
        // if (win == this.player.bottle) return true;
        else return false;
    }
    nextLevel() {
        this.diaphragm.alpha = 0
        while (!this.dataLevelNextLoad) {
            if (this.dataLevelNextLoad == null) {
                this.getNextLevelData()
            } else console.error('no data level next');
        }
        if (this.dataLevelNextLoad) {
            this.level += 1

            this.containerPlaying.interactiveChildren = true;
            this.containerButton.interactiveChildren = true
            this.removeChildContainerPlaying()
            this.removeWin()
            this.clearDataLevel();
            this.resources.map = loaderNextData.resources.map
            this.data = converLevel(loaderNextData.resources.map.data.ids)
            this.setLCBottle(this.data.bottle)
            this.setBottle()
            this.drawTextLevel()

            this.getNextLevelData()
            this.sendDataFacebook()
        }
    }
    removeChildContainerPlaying() {
        while (this.containerPlaying.children[0]) {
            this.containerPlaying.removeChild(this.containerPlaying.children[0]);
        }
    }
    sendDataFacebook() {
        var player = { level: this.level }
        FBInstant.player
            .setDataAsync(player)
            .then(function () {
                console.log('data is set: ', player);
            });
    }
    bottleIsActive(array) {
        return array.filter(item => item.status === false).length;
    }
}

function getColor(param) {
    switch (param) {
        case 0: return "0xffffff"
        case 1: return "0x88aaff"
        case 2: return "0x3f4482"
        case 3: return "0x145def"
        case 4: return "0xf27914"
        case 5: return "0xf4c916"
        case 6: return "0x6c7490"
        case 7: return "0xbc245e"
        case 8: return "0xbf3cbf"
        case 9: return "0xff94d1"
        case 10: return "0x008160"
        case 11: return "0x809917"
        case 12: return "0xB3D666"
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
function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
function getDistance(p1, p2) {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
    return Math.sqrt(a * a + b * b);
}

function checkCompleteItem(arr) {
    const color0 = arr[0];
    let isWin = arr.every(function (item) {
        return item == color0;
    });
    return isWin;
}