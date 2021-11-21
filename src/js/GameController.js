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
                if (color <= 0) continue;
                var water = this.getWater(color)
                // this.setAnchor(water, 1)
                water.y = bottle.y + this.bottleBase.empty + this.colorBase.height * j
                water.x = bottle.x
                containerColor.addChild(water)
                listWater.push(water)
            }

            this.listBottle.push({ listWater: listWater, status: true });
            var wave = this.getWave()
            wave.name = 'wave_' + i
            wave.y = this.bottleBase.empty - wave.getBounds().height * 0.8
            wave.alpha = 0
            wave.mask = bottle_fill
            containerColor.mask = bottle_fill

            containerBottle.addChild(containerColor, wave, containerBottleMask)
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
                console.log(newColor);
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


    moveBottle() {



        let oldChoose = this.listBottleA[this.listBottleA.length - 1];
        let newChoose = this.listBottleB[this.listBottleB.length - 1];

        var containerBottle = this.containerPlaying.getChildByName('container_bottle_' + oldChoose.index)
        var containerBottleMask = containerBottle.getChildByName('container_bottle_mask_' + oldChoose.index)

        this.listBottle[oldChoose.index].status = false;
        this.listBottle[newChoose.index].status = false;
        console.table({ oldChoose: oldChoose, newChoose: newChoose });

        var amount_water_poured = oldChoose.num >= newChoose.num ? newChoose.num : oldChoose.num

        console.log('containerBottle: ', containerBottle);
        console.log('containerBottleMask: ', containerBottleMask);
        console.log(4 - this.listBottle[oldChoose.index].listWater.length);
        var startWater = 4 - this.listBottle[oldChoose.index].listWater.length
        var endWater = startWater + amount_water_poured - 1
        var degrees = this.getAngle(startWater, endWater)
        console.table({ startWater: startWater, endWater: endWater, degrees: degrees });

        console.log('amount_water_poured: ', amount_water_poured);
        console.log(this.listBottle);
        var temp = this.bottleBase.indexRow.numR1
        console.log(this.bottleBase.startX);
        var x0 = this.bottleBase.startX[newChoose.index] + this.bottleBase.width * 0.2
        var y0 = newChoose.index < temp ? this.bottleBase.startY[0] - this.bottleBase.height * 0.1 : this.bottleBase.startY[1] - this.bottleBase.height * 0.1;

        console.table({ x: x0, y: y0 });
        console.log(this.screenSize);
        console.log(x0 > this.screenSize.width / 2);
        if (x0 > this.screenSize.width / 2) {
            containerBottleMask.rotation = degrees_to_radians(degrees.start)
            setTimeout(() => {
                console.log("--------- if ------");
            }, 1000);
        } else {
            // console.log(containerBottle.getBounds());

            containerBottleMask.rotation = -degrees_to_radians(degrees.start)
            setTimeout(() => {
                console.log("--------- else ------");
            }, 1000);
        }



        // var ball = this.listBottle[oldChoose.index].listBall[0];
        // var target = this.listBottle[oldChoose.index].listBall.shift();
        // this.listBottle[newChoose.index].listBall.unshift(target);
        // var child2 = this.containerMain.getChildAt(max_index - i)
        // this.containerMain.swapChildren(ball, child2)
        // if (y1 > y0) { y0 -= this.ballBase.height * 0.3 }
        // else if (y1 < y0) { y1 -= this.ballBase.height * 0.3 }
        // gsap.timeline()
        //     .to(ball, { x: x1, y: y1, duration: timeRight, ease: "none" })
        //     .to(ball, { y: y2, duration: TIMEMOVEDOWN, ease: "none" })
        //     .eventCallback("onComplete", () => { if (num == 1) this.leapBall(ball, newChoose.index, x1, y1, bottleComplete) });
        // setTimeout(() => { this.PlaySound("ball_fall_" + num) }, timeRight + TIMEMOVEDOWN / 2);

        // complete++
        // i++
        // if (i < num) {
        //     var myInterval = setInterval(() => { test() }, 50);
        //     const test = () => {
        //         y2 = newChoose.index < temp ? this.ballBase.startY1[maxIndexNew - i] : this.ballBase.startY2[maxIndexNew - i];
        //         ball = this.listBottle[oldChoose.index].listBall[0];
        //         target = this.listBottle[oldChoose.index].listBall.shift();
        //         this.listBottle[newChoose.index].listBall.unshift(target);

        //         var child2 = this.containerMain.getChildAt(max_index - i)
        //         this.containerMain.swapChildren(ball, child2)

        //         gsap.timeline()
        //             .to(ball, { y: y0, duration: TIMEMOVEUP, ease: "none" })
        //             .to(ball, { x: x1, y: y1, duration: timeRight, ease: "none" })
        //             .to(ball, { y: y2, duration: TIMEMOVEDOWN, ease: "none" })
        //             .eventCallback("onComplete", () => {
        //                 complete++
        //                 if (complete == num) { this.leapBall(ball, newChoose.index, x1, y1, bottleComplete) }
        //             });
        //         i++
        //         if (i == num) clearInterval(myInterval);
        //     }
        //     test()
        // }
        // this.convertMap();

        // var bottleComplete = checkCompleteItem(this.map[newChoose.index])
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
            case 2: end = 84;;
                break;
            case 3: end = 90;
                break;
        }
        return { start: start, end: end }

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