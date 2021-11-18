export default class GameController{
    constructor(app, resources,screenSize ){
        this.app = app;
        this.resources = resources;
        this.screenSize = screenSize;
        
        console.log({app: app,resources: resources, screenSize: screenSize});
    }
}