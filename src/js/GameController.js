import { Application, Sprite, Container } from 'pixi.js'
import { sound } from '@pixi/sound';
import { gsap } from "gsap";
const TIMEUP = 0.15;
const TIMEMOVEMIN = 0.35

export default class GameController {
    constructor(app, resources, screenSize, level) {
        this.app = app;
        this.resources = resources;
        this.screenSize = screenSize;
        this.containerGame = new Container();
        this.level = level;
        this.data = null;
        this.bottleW = null;
        this.template_bottle_use = "bottle_1.png";
        this.setUpDefaut();
        this.listBottles = [];
        this.listBottleA = [];
        this.listBottleB = [];
        this.speed = { a: 0, b: 0 }

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
        this.data = converLevel(this.resources.map.data.ids)


    }
    start() {
        console.log('start true');
        this.setBackground()
        this.setLCBottle(this.data.bottle)
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
            wave4.y = indexWaterExist < 3 ? containerColor.children[indexWaterExist].y - wave4.getBounds().height * 0.8 + this.bottleBase.empty : containerColor.children[3].y + containerColor.children[3].getBounds().height - wave4.getBounds().height * 0.8 + this.bottleBase.empty

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
        this.speed = { a: distance / 40, b: distance / 30 }


        // var containerBottle0 = this.containerPlaying.getChildByName('container_bottle_5' )
        // var wave0 = containerBottle0.getChildByName('wave_5')

        // this.listBottles[5].runWave = true
        // // wave40.pivot.x = this.colorBase.width * 0.7*2
        // wave0.alpha = 1
        // this.runWave(wave0, 5)
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
    stopWave(index, wave, pourWater) {
        if (this.listBottles[index].num == 1) {
            var y = wave.y
            gsap.to(wave, {
                y: y + wave.getBounds().height,
                onComplete: () => {
                    this.listBottles[index].runWave = false
                    wave.alpha = 0

                    this.reDrawWater(index)
                    this.listBottles[index].new = []

                    this.listBottles[index].status = true;
                    pourWater.stop()
                },
                duration: 0.7, ease: "none"
            })
        }

        this.listBottles[index].num -= 1
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
                duration: 0.5, ease: "none"
            })
        }
    }
    runWave4Left(container, index) {
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
                duration: 0.5, ease: "none"
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
        this.listBottles[indexChoose].status = false;
        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + indexChoose)
        this.upZindexBottle(containerBottle)
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
    moveBottle() {

        var pourWater = this.resources.pourWater.sound


        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];
        var listColorWater0 = this.data.map[oldChoose.index].slice()
        var listColorWater1 = this.data.map[newChoose.index].slice()

        this.listBottles[oldChoose.index].status = false;
        this.listBottles[newChoose.index].status = false;

        this.convertMap(oldChoose, newChoose)

        var emptyWater0 = listColorWater0.lastIndexOf(0) + 1

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
        var startWater = listColorWater0.lastIndexOf(0) + 1
        var endWater = startWater + amount_water_poured - 1
        var degrees = this.getAngle(startWater, endWater)

        var x0 = this.bottleBase.startX[newChoose.index] + this.bottleBase.width * 0.2

        var point0 = { x: containerBottle0.x, y: containerBottle0.y }
        var point1 = { x: containerBottle1.x + this.bottleBase.width * 0.3, y: containerBottle1.y - this.bottleBase.height * 0.225 }
        var distance = getDistance(point0, point1);
        var timeMove = (distance / this.speed.a) / 1000
        var timeMove1 = (distance / this.speed.b) / 1000
        var timeRot = 0.7 * amount_water_poured
        var timeWait = timeMove + timeRot
        console.log(timeMove);
        wave4.alpha = 1
        this.listBottles[oldChoose.index].runWave4 = true
        wave4.pivot.x = this.colorBase.width * 0.7 * 2
        this.updateColorWave4(wave4, oldChoose.color)
        this.listBottles[newChoose.index].num += 1
        this.listBottles[newChoose.index].new.push({ color: oldChoose.color, num: amount_water_poured, progress: 0, id: oldChoose.index, listColor: listColorWater1 })
        if (x0 > this.screenSize.width / 2) {
            this.runWave4Right(wave4, oldChoose.index)
            var widthBottleMask0 = containerBottleMask0.getBounds().width
            var radians = { start: degrees_to_radians(degrees.start), end: degrees_to_radians(degrees.end) }
            containerBottle0.pivot.x = widthBottleMask0
            containerBottle0.x = this.bottleBase.startX[oldChoose.index] + widthBottleMask0

            containerBottleMask0.pivot.x = widthBottleMask0
            containerBottleMask0.x = widthBottleMask0

            containerColor0.pivot.x = containerColor0.getBounds().width
            containerColor0.x = containerBottleMask0.x
            gsap.timeline()
                .to(containerBottle0, {
                    x: containerBottle1.x + this.bottleBase.width * 0.33,
                    y: containerBottle1.y - this.bottleBase.height * 0.225,
                    onComplete: () => {

                    },
                    duration: timeMove, ease: "none"
                })
                .to(containerBottle0, {
                    x: this.bottleBase.startX[oldChoose.index] + widthBottleMask0,
                    y: oldChoose.index >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0],
                    duration: timeMove1, ease: "none"
                }, "+=" + timeRot)
                .eventCallback("onComplete", () => {
                    containerBottle0.pivot.x = 0
                    containerBottle0.x = this.bottleBase.startX[oldChoose.index]
                    containerBottleMask0.pivot.x = 0
                    containerBottleMask0.x = 0
                    containerColor0.pivot.x = 0
                    containerColor0.x = containerBottleMask0.x
                    this.listBottles[oldChoose.index].status = true;
                });

            gsap.timeline()
                .to(containerBottleMask0, {
                    rotation: radians.start,
                    duration: timeMove, ease: "none",
                    onUpdate: () => { this.tilt1(containerBottleMask0, containerColor0, radians, emptyWater0, listColorWater0, wave4) },
                    onComplete: () => {
                        this.updateColorWave(wave, oldChoose.color)
                        if (this.listBottles[newChoose.index].num == 1) {
                            if (!this.listBottles[newChoose.index].runWave) {
                                wave.alpha = 1
                                this.listBottles[newChoose.index].runWave = true
                                this.runWave(wave, newChoose.index)
                            }
                            pourWater.play()
                        }
                    }
                })
                .to(containerBottleMask0, {
                    rotation: radians.end,
                    duration: timeRot, ease: "none",
                    onUpdate: () => {
                        this.showColWater(colWater1, oldChoose.color);
                        this.tilt2(containerBottleMask0, containerColor0, radians, emptyWater0, amount_water_poured, listColorWater0)
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
                        this.stopWave4(oldChoose.index, wave4)
                        this.stopWave(newChoose.index, wave, pourWater)
                    }
                })
                .to(containerBottleMask0, {
                    rotation: 0,
                    duration: timeMove1, ease: "none",
                    onUpdate: () => { this.tilt3(containerBottleMask0, containerColor0, radians, oldChoose, wave4) },
                    onComplete: () => {
                        var map = this.data.map
                        var indexWaterExist = map[oldChoose.index].lastIndexOf(0) + 1
                        if (indexWaterExist < 3) {
                            wave4.y = containerColor0.children[indexWaterExist].y - wave4.getBounds().height * 0.8 + this.bottleBase.empty
                            wave0.y = containerColor0.children[indexWaterExist].y - wave0.getBounds().height * 0.8 + this.bottleBase.empty
                        } else {
                            wave4.y = containerColor0.children[3].y + containerColor0.children[3].getBounds().height - wave4.getBounds().height * 0.8 + this.bottleBase.empty
                            wave0.y = containerColor0.children[3].y + containerColor0.children[3].getBounds().height - wave0.getBounds().height * 0.8 + this.bottleBase.empty
                        }
                    }
                })
        }
        else {
            this.runWave4Left(wave4, oldChoose.index)
            var radians = { start: -degrees_to_radians(degrees.start), end: -degrees_to_radians(degrees.end) }
            gsap.timeline()
                .to(containerBottle0, {
                    x: containerBottle1.x + this.bottleBase.width * 0.19,
                    y: containerBottle1.y - this.bottleBase.height * 0.225,
                    onComplete: () => {

                    },
                    duration: timeMove, ease: "none"
                })
                .to(containerBottle0, {
                    x: this.bottleBase.startX[oldChoose.index],
                    y: oldChoose.index >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0],
                    duration: timeMove1, ease: "none"
                }, "+=" + timeRot)
                .eventCallback("onComplete", () => {
                    this.listBottles[oldChoose.index].status = true;
                });
            gsap.timeline()
                .to(containerBottleMask0, {
                    rotation: radians.start,
                    duration: timeMove, ease: "none",
                    onUpdate: () => { this.tilt1(containerBottleMask0, containerColor0, radians, emptyWater0, listColorWater0, wave4) },
                    onComplete: () => {
                        this.updateColorWave(wave, oldChoose.color)
                        if (this.listBottles[newChoose.index].num == 1) {
                            if (!this.listBottles[newChoose.index].runWave) {
                                wave.alpha = 1
                                this.listBottles[newChoose.index].runWave = true
                                this.runWave(wave, newChoose.index)
                            }
                            pourWater.play()
                        }
                    }
                })
                .to(containerBottleMask0, {
                    rotation: radians.end,
                    duration: timeRot, ease: "none",
                    onUpdate: () => {
                        this.showColWater(colWater1, oldChoose.color);
                        this.tilt2(containerBottleMask0, containerColor0, radians, emptyWater0, amount_water_poured, listColorWater0)
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
                        this.stopWave4(oldChoose.index, wave4)
                        this.stopWave(newChoose.index, wave, pourWater)
                    }
                })
                .to(containerBottleMask0, {
                    rotation: 0,
                    duration: timeMove1, ease: "none",
                    onUpdate: () => { this.tilt3(containerBottleMask0, containerColor0, radians, oldChoose, wave4) },
                    onComplete: () => {
                        var map = this.data.map
                        var indexWaterExist = map[oldChoose.index].lastIndexOf(0) + 1
                        if (indexWaterExist < 3) {
                            wave4.y = containerColor0.children[indexWaterExist].y - wave4.getBounds().height * 0.8 + this.bottleBase.empty
                            wave0.y = containerColor0.children[indexWaterExist].y - wave0.getBounds().height * 0.8 + this.bottleBase.empty
                        } else {
                            wave4.y = containerColor0.children[3].y + containerColor0.children[3].getBounds().height - wave4.getBounds().height * 0.8 + this.bottleBase.empty
                            wave0.y = containerColor0.children[3].y + containerColor0.children[3].getBounds().height - wave0.getBounds().height * 0.8 + this.bottleBase.empty

                        }
                    }
                })
                .eventCallback("onComplete", () => { })
        }
    }
    tilt1(containerBottleMask0, containerColor, radians, emptyWater, listColorWater0, wave4) {
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
                wave4.y = water.y + this.bottleBase.empty * (1 - progress) - wave4.getBounds().height * 0.8
            }
        }
        containerColor.y = this.bottleBase.empty * (1 - progress)
    }
    tilt2(containerBottleMask0, containerColor, radians, emptyWater, amount_water_poured, listColorWater0) {
        containerColor.y = 0
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
            if (i == emptyWaterEnd) wave4.y = water.y + this.bottleBase.empty * (1 - progress) - wave4.getBounds().height * 0.8
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
    showColWater(colWater, indexColor) {
        var color = getColor(indexColor)
        colWater.alpha = 1
        colWater.clear();
        colWater.beginFill(color);
        colWater.drawRect(0, 0, this.bottleBase.width * 0.07, this.bottleBase.height * 1.2);
    }
    hideColWater(colWater) {
        colWater.alpha = 0
    }
    upZindexBottle(containerBottle) {
        var max_index = this.containerPlaying.children.length - 1
        var containerBottle2 = this.containerPlaying.getChildAt(max_index)
        this.containerPlaying.swapChildren(containerBottle, containerBottle2)
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