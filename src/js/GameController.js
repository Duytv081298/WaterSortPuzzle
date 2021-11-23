import { Application, Sprite, Container } from 'pixi.js'

import { gsap } from "gsap";
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
        this.listBottle = [];
        this.listBottleA = [];
        this.listBottleB = [];

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
        console.log(this.data);


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
        var unusedArea = this.app.screen.width - (this.bottleW * quantity)
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

        this.listBottle = [];
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


            var listWater = [];
            for (let j = 0; j < map[i].length; j++) {
                const color = map[i][j];
                if (color <= 0) {
                    let water = new PIXI.Graphics();
                    water.beginFill(0xffffff);
                    water.drawRect(0, 0, this.colorBase.width, this.colorBase.height);
                    water.y = this.colorBase.height * j
                    water.alpha = 0
                    containerColor.addChild(water)
                    listWater.push(water)
                } else if (j == map[i].length - 1) {
                    var color1 = getColor(color)
                    let water = new PIXI.Graphics();
                    water.beginFill(color1);
                    water.drawRect(0, 0, this.colorBase.width, this.colorBase.height * 6);
                    water.y = this.colorBase.height * j
                    containerColor.addChild(water)
                    listWater.push(water)
                } else {
                    var water = this.getWater(color)
                    water.y = this.colorBase.height * j
                    containerColor.addChild(water)
                    listWater.push(water)
                }
            }
            containerColor.y = this.bottleBase.empty
            containerColor.x = bottle.x
            this.listBottle.push({ listWater: listWater, status: true });

            var colWater = this.getColWater(3)
            colWater.name = 'colWater_' + i
            colWater.x = this.bottleBase.width * 0.22
            colWater.y = -this.bottleBase.height * 0.225
            colWater.alpha = 0
            var wave = this.getWave()
            wave.name = 'wave_' + i
            wave.y = this.bottleBase.empty - wave.getBounds().height * 0.8
            wave.alpha = 0
            wave.mask = bottle_fill
            containerColor.mask = bottle_fill

            containerBottle.addChild(colWater, containerColor, wave, containerBottleMask)
            containerBottle.x = this.bottleBase.startX[i]
            containerBottle.y = i >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0]
        }

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
        // water.pivot.x = this.bottleBase.height * 1.3;
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
    clickBottle(param) {
        var map = this.data.map
        console.log('click Bottle ', param);
        const indexChoose = param
        if (indexChoose != null) {
            if (this.listBottleA.length == this.listBottleB.length) {
                if (map[indexChoose].lastIndexOf(0) != 3) {
                    if (this.listBottle[indexChoose].status == true) {
                        var choose = this.getWaterChoose(indexChoose);
                        console.log(choose);
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
                        console.log(111111);
                        this.downBottle(oldChoose);
                        if (this.listBottle[indexChoose].status == true) {
                            var choose = this.getWaterChoose(indexChoose);
                            this.listBottleA.push(choose);
                            this.upBottle(indexChoose);
                        };
                    }
                } else if (indexChoose == oldChoose) {
                    this.downBottle(indexChoose);
                } else {
                    console.log('else');
                    // this.downBallChoose();
                    // if (this.listBottle[indexChoose].status == true) {
                    //     var choose = this.getBallChoose(indexChoose);
                    //     this.listBottleA.push(choose);
                    //     this.upBallChoose();
                    // };
                    // console.log(this.listBottleA.length);
                }
            }
        }
    }

    upBottle(indexChoose) {

        this.listBottle[indexChoose].status = false;
        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + indexChoose)
        this.upZindexBottle(containerBottle)
        var temp = this.bottleBase.indexRow.numR1
        var y = indexChoose < temp ? this.bottleBase.startY[0] - this.bottleBase.up : this.bottleBase.startY[1] - this.bottleBase.up;
        gsap.to(containerBottle, { y: y, duration: 0.15, ease: "none" })
            .eventCallback("onComplete", () => {
                this.listBottle[indexChoose].status = true;
            });
    }
    downBottle(indexChoose) {
        this.listBottle[indexChoose].status = false;
        this.listBottleA.pop();
        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + indexChoose)
        var temp = this.bottleBase.indexRow.numR1
        var y = indexChoose < temp ? this.bottleBase.startY[0] : this.bottleBase.startY[1];

        gsap.to(containerBottle, { y: y, duration: 0.15, ease: "none" })
            .eventCallback("onComplete", () => {
                this.listBottle[indexChoose].status = true;
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
        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];
        var listColorWater0 = this.data.map[oldChoose.index].slice()
        var listColorWater1 = this.data.map[newChoose.index].slice()

        this.convertMap(oldChoose, newChoose)

        var emptyWater = listColorWater0.lastIndexOf(0) + 1

        var containerBottle0 = this.containerPlaying.getChildByName('container_bottle_' + oldChoose.index)
        var containerBottleMask0 = containerBottle0.getChildByName('container_bottle_mask_' + oldChoose.index)
        var containerColor = containerBottle0.getChildByName('container_color_' + oldChoose.index)
        // console.log(listColorWater0.lastIndexOf(0));

        var containerBottle1 = this.containerPlaying.getChildByName('container_bottle_' + newChoose.index)
        var colWater1 = containerBottle1.getChildByName('colWater_' + newChoose.index)
        // console.log(colWater1);

        this.listBottle[oldChoose.index].status = false;
        this.listBottle[newChoose.index].status = false;

        var amount_water_poured = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num
        var startWater = listColorWater0.lastIndexOf(0) + 1
        var endWater = startWater + amount_water_poured - 1
        // console.log({ startWater: startWater, endWater: endWater });
        var degrees = this.getAngle(startWater, endWater)
        // console.log(degrees);

        var temp = this.bottleBase.indexRow.numR1
        var x0 = this.bottleBase.startX[newChoose.index] + this.bottleBase.width * 0.2
        var y0 = newChoose.index < temp ? this.bottleBase.startY[0] - this.bottleBase.height * 0.1 : this.bottleBase.startY[1] - this.bottleBase.height * 0.1;

        if (x0 > this.screenSize.width / 2) {
            console.log(containerBottle0.children);
            var widthBottleMask0 = containerBottleMask0.getBounds().width
            var radians = { start: degrees_to_radians(degrees.start), end: degrees_to_radians(degrees.end) }
            containerBottle0.pivot.x = widthBottleMask0
            containerBottle0.x = this.bottleBase.startX[oldChoose.index] + widthBottleMask0
            console.log('width: ', widthBottleMask0);

            containerBottleMask0.pivot.x = widthBottleMask0
            containerBottleMask0.x = widthBottleMask0

            containerColor.pivot.x = containerColor.getBounds().width
            containerColor.x = containerBottleMask0.x
            gsap.timeline()
                .to(containerBottle0, {
                    x: containerBottle1.x + this.bottleBase.width * 0.33,
                    y: containerBottle1.y - this.bottleBase.height * 0.225,
                    onComplete: () => { this.showColWater(colWater1, oldChoose.color) },
                    duration: 1, ease: "none"
                })
                .to(containerBottle0, {
                    x: this.bottleBase.startX[oldChoose.index] + widthBottleMask0,
                    y: oldChoose.index >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0],
                    duration: 1, ease: "none"
                }, "+=2")
                .eventCallback("onComplete", () => {
                    containerBottle0.pivot.x = 0
                    containerBottle0.x = this.bottleBase.startX[oldChoose.index]
                    containerBottleMask0.pivot.x = 0
                    containerBottleMask0.x = 0
                    containerColor.pivot.x = 0
                    containerColor.x = containerBottleMask0.x
                });

            gsap.timeline()
                .to(containerBottleMask0, {
                    rotation: radians.start,
                    duration: 1, ease: "none",
                    onUpdate: () => { this.tilt1(containerBottleMask0, containerColor, radians, emptyWater, listColorWater0) }
                })
                .to(containerBottleMask0, {
                    rotation: radians.end,
                    duration: 2, ease: "none",
                    onUpdate: () => { this.tilt2(containerBottleMask0, containerColor, radians, emptyWater, amount_water_poured, listColorWater0) },
                    onComplete: () => { this.hideColWater(colWater1); },
                })
                .to(containerBottleMask0, {
                    rotation: 0,
                    duration: 1, ease: "none",
                    onUpdate: () => { this.tilt3(containerBottleMask0, containerColor, radians, oldChoose) }
                })
            console.log(containerBottleMask0.getBounds());
            setTimeout(() => {
                console.log("--------- if ------");
            }, 1000);
        }
        else {
            var radians = { start: -degrees_to_radians(degrees.start), end: -degrees_to_radians(degrees.end) }
            gsap.timeline()
                .to(containerBottle0, {
                    x: containerBottle1.x + this.bottleBase.width * 0.19,
                    y: containerBottle1.y - this.bottleBase.height * 0.225,
                    onComplete: () => { this.showColWater(colWater1, oldChoose.color) },
                    duration: 1, ease: "none"
                })
                .to(containerBottle0, {
                    x: this.bottleBase.startX[oldChoose.index],
                    y: oldChoose.index >= this.bottleBase.indexRow.numR1 ? this.bottleBase.startY[1] : this.bottleBase.startY[0],
                    duration: 5, ease: "none"
                }, "+=2")
                .eventCallback("onComplete", () => {
                });
            gsap.timeline()
                .to(containerBottleMask0, {
                    rotation: radians.start,
                    duration: 1, ease: "none",
                    onUpdate: () => { this.tilt1(containerBottleMask0, containerColor, radians, emptyWater, listColorWater0) }
                })
                .to(containerBottleMask0, {
                    rotation: radians.end,
                    duration: 2, ease: "none",
                    onUpdate: () => { this.tilt2(containerBottleMask0, containerColor, radians, emptyWater, amount_water_poured, listColorWater0) },
                    onComplete: () => { this.hideColWater(colWater1) },
                })
                .to(containerBottleMask0, {
                    rotation: 0,
                    duration: 5, ease: "none",
                    onUpdate: () => { this.tilt3(containerBottleMask0, containerColor, radians, oldChoose) }
                })
                .eventCallback("onComplete", () => {
                    // this.hideColWater(colWater1)
                    // console.log(containerBottleMask0.getBounds());
                })
            // console.log('containerBottleMask: ', containerBottleMask0.getBounds());
            // console.log('containerBottle: ', containerBottle0.getBounds());
            setTimeout(() => {
                console.log("--------- else ------");
            }, 1000);
        }

    }
    tilt1(containerBottleMask0, containerColor, radians, emptyWater, listColorWater0) {
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
            } else if (i == 3) heightwater = heightColorDefaut * 6
            water.clear();
            water.beginFill(color);
            water.drawRect(0, 0, this.colorBase.width, heightwater);
            water.y = i == 0 ? 0 : containerColor.children[i - 1].y + containerColor.children[i - 1].getBounds().height
        }
    }
    tilt3(containerBottleMask0, containerColor, radians, oldChoose) {
        var listColorWater0 = this.data.map[oldChoose.index].slice()
        var bottleRadians = containerBottleMask0.rotation;
        var heightContainer = Math.cos(Math.abs(bottleRadians)) * this.colorBase.height * 9
        var newHeightWaterDefaut = heightContainer / 9
        var progress = bottleRadians / (radians.end)

        var emptyWater = listColorWater0.lastIndexOf(0) + 1
        for (let i = 0; i < containerColor.children.length; i++) {
            let indexColor = listColorWater0[i]
            let color = getColor(indexColor)
            let water = containerColor.children[i]
            var heightwater = newHeightWaterDefaut
            if (i < emptyWater) {
                heightwater = newHeightWaterDefaut * (1 - progress)
                water.alpha = 0
            } else if (i == 3) heightwater = newHeightWaterDefaut * 6
            water.clear();
            water.beginFill(color);
            water.drawRect(0, 0, this.colorBase.width, heightwater);
            water.y = i == 0 ? 0 : containerColor.children[i - 1].y + containerColor.children[i - 1].getBounds().height
        }
        containerColor.y = this.bottleBase.empty * (1 - progress)
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

        console.log(containerBottle2);

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
        case 0: return 0xffffff
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
function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}