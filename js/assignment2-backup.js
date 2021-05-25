//the physijs

Physijs.scripts.worker = 'physijs_worker.js'; 
Physijs.scripts.ammo = 'ammo.js';                        
//declare variables
let scene, renderer, camera, controls, axesHelper;
//lights
let spotLight, ambientLight;
//lights' colors
let spotLightColor = 0x404040, ambientLightColor = 0x404040;
//datGui
let control;
//Scene rotation angle
let sceneAngle = 0;
//server port
let serverPort;
//current level
let currentLevelString = "Level 1";
let currentLevelInt = 1;

//Scoreboard variables
let level1Cleared = 0,level2Cleared = 0,level3Cleared = 0,
    level4Cleared = 0,level5Cleared = 0;
let level1Tries = 0,level2Tries = 0,level3Tries = 0,
    level4Tries = 0,level5Tries = 0;

//scoreboard elements
let currentLevelpara
let levelClearedPara;
let clicksPara;
let resetsPara;

//level click limit
let clickLimit;
//temp variable for level reseted
let resetedLevel = 0;

//materials
let gamePlaneMat, clearPlaneMat;
//geometries
let gamePlaneGeo,clearPlaneGeo;
//meshes
let gamePlane,clearPlane;
//array of cubes
let boxArray = [];

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    window.addEventListener('click', this.mouseDownHandler,false);
    this.render();
}

function init(){
    //create the scene
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -20, 0));
    console.log(scene);
    scene.allowSleep = true;
    //create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //set the color
    renderer.setClearColor(0x008800);
    renderer.shadowMap.enabled = true;
    //add it to the DOM
    document.body.appendChild(renderer.domElement);

    //get current server port
    serverPort = window.location.href;
    serverPort = serverPort.split("/");
    serverPort = serverPort[2].split(":");
    serverPort = serverPort[1];
    //references to paragraphs
    currentLevelpara = document.getElementById("currentLevelpara");
    levelClearedPara = document.getElementById("levelClearedPara");
    clicksPara = document.getElementById("clicksPara");
    resetsPara = document.getElementById("resetsPara");
};
function createCameraAndLights(){
    //create the camera
    camera = new THREE.PerspectiveCamera(
        50,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        1000                                         //far point
    );
    //set its position
    camera.position.set(0, 20, 50);
    //point the camera
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    //lights
    spotLight = new THREE.SpotLight(spotLightColor, 2.0);
    spotLight.position.set(0, 35, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(ambientLightColor, 1.0);
    ambientLight.position.set(0, 45, 0);
    scene.add(ambientLight);
};
function createGeometry(){
   //game plane
    gamePlaneMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xaa00ff
    }),
        0.25,       
        0.5); 
    gamePlaneGeo = new THREE.BoxGeometry(20, 0.2, 30);
    gamePlane = new Physijs.BoxMesh(gamePlaneGeo, gamePlaneMat, 0);
    gamePlane.receiveShadow = true;
    scene.add(gamePlane);

    //destroying plane
    clearPlaneMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0x000000,transparent: true, opacity: 0.0
    }),
        0.8,       
        0.2); 
    clearPlaneGeo = new THREE.BoxGeometry(60, 0.2, 90);
    clearPlane = new Physijs.BoxMesh(clearPlaneGeo, clearPlaneMat, 0);
    clearPlane.receiveShadow = true;
    clearPlane.position.set(0, -3, 0);
    //check the collision
    clearPlane.addEventListener( 'collision', function(other_object ) {
        console.log(`object ${other_object.name}`);
        if(other_object.name == "yellowBox"){
            levelCleared();
        }
        //remove the collided object
    	scene.remove(other_object);
	});
    scene.add(clearPlane);

    //Load the level 1 and start the game
    readFile(serverPort, "samuli1")
    
};
function setupDatgui(){
 //the object that is used by dat.GUI
    control = new function () {
        this.ToggleSceneRotation = false;
        this.SpotLight = true;
        this.AmbientLight = true;
        this.Levels = "level"
        this.Reset = () => {        //count the level resets and load the level again
            resetedLevel++;
            saveResets();
            readFile(serverPort,`samuli${currentLevelInt}`)
        };
    }
    let gui = new dat.GUI();
    gui.add(control, "ToggleSceneRotation");
    gui.add(control, "SpotLight").onChange((e) => {
        spotLight.visible = e;
    })
    gui.add(control, "AmbientLight").onChange((e) => {
        ambientLight.visible = e;
    })
    gui.add(control, 'Levels', { Level1: '1', Level2: '2', Level3: '3',Level4: '4',Level5: '5' })
            .onChange((level) => {                      //Load the selected level
                currentLevelString = `Level ${level}`;
                currentLevelInt = parseInt(level);
                levelChange();                          //update the scoreboard
                readFile(serverPort,`samuli${level}`)
            });
    gui.add(control, 'Reset');
};

function render(){
    controls.update();
    //Rotation of the scene//
     if (control.ToggleSceneRotation) {
         scene.rotation.y = sceneAngle += 0.02;
     }
     
     // render using requestAnimationFrame
     requestAnimationFrame(render);
     renderer.render(scene, camera);
     scene.simulate(undefined, 1);
};
//Read the selected json level file and pass it to createGame function
function readFile(serverPort, filename) {
    let url = 'http://localhost:' +
    serverPort + //port number from data.gui
    '/js/assets/game/' + //url path
    filename + //file name from dat.gui
    '.json'; //extension
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'text';
    request.send();
    request.onload = () => {
    let data = request.responseText;
    let parsedJSON = JSON.parse(data)
    createGame(parsedJSON);
    }
};
//create the selected gamelevel
function createGame(levelRules){
    //set te gravity -20
    scene.setGravity(new THREE.Vector3(0, -20, 0));
    //get the amount of cubes, json files creates
    let jsonObjLength = Object.keys(levelRules.box).length;
    //clear the scene
    if(boxArray.length > 0){
        boxArray.forEach(element => {
            scene.remove(element);
            });
        boxArray = [];
    }
    //set the click limit for the level
    clickLimit = levelRules.clicks;
    //clear html elements
    currentLevelpara.innerHTML  = `Current Level: ${currentLevelString}`;
    clicksPara.innerHTML  = `Clicks: ${clickLimit}`;
    
    for(let i = 0; i<jsonObjLength; i++){
        //get the rules for each box
        let boxSizeX = levelRules.box[i].size.x;
        let boxSizeY = levelRules.box[i].size.y;
        let boxSizeZ = levelRules.box[i].size.z;

        let boxColor = levelRules.box[i].color;
        let boxTransparency = levelRules.box[i].transparency;
        let boxOpacity = levelRules.box[i].opacity;

        let boxPositionX = levelRules.box[i].position.x;
        let boxPositionY = levelRules.box[i].position.y;
        let boxPositionZ = levelRules.box[i].position.z;

        let boxFriction = levelRules.boxFriction;
        let boxRestitution = levelRules.boxRestitution;
        let boxMass = levelRules.box[i].boxMass;

        let boxGeo = new THREE.BoxGeometry(boxSizeX,boxSizeY,boxSizeZ);
        let boxMat = new THREE.MeshStandardMaterial({color: boxColor,transparent:boxTransparency,opacity: boxOpacity});

        let boxMatPhy = Physijs.createMaterial(boxMat, boxFriction, boxRestitution);
        let box = new Physijs.BoxMesh(boxGeo, boxMatPhy, boxMass);
        //position the box
        box.position.set(boxPositionX,boxPositionY,boxPositionZ);
        box.name = `${levelRules.box[i].name}`
        scene.add(box);
        boxArray.push(box);
    }
}
//Save level clear and update the scoreboard
function levelCleared(){
    switch(currentLevelInt){
        case 1:
            level1Cleared++;
            levelClearedPara.innerHTML  = `Level cleared: ${level1Cleared}`;
        break;
        case 2:
            level2Cleared++;
            levelClearedPara.innerHTML  = `Level cleared: ${level2Cleared}`;
        break;
        case 3:
            level3Cleared++;
            levelClearedPara.innerHTML  = `Level cleared: ${level3Cleared}`;
        break;
        case 4:
            level4Cleared++;
            levelClearedPara.innerHTML  = `Level cleared: ${level4Cleared}`;
        break;
        case 5:
            level5Cleared++;
            levelClearedPara.innerHTML  = `Level cleared: ${level5Cleared}`;
        break;
        default:
            break;
    }
}
//update the scoreboard when loading levels
function levelChange(){
    switch(currentLevelInt){
        case 1:
            
            resetedLevel = level1Tries;
            levelClearedPara.innerHTML  = `Level cleared: ${level1Cleared}`;
            resetsPara.innerHTML  = `Resets: ${level1Tries}`;
        break;
        case 2:
            resetedLevel = level2Tries;
            levelClearedPara.innerHTML  = `Level cleared: ${level2Cleared}`;
            resetsPara.innerHTML  = `Resets: ${level2Tries}`;
        break;
        case 3:
            resetedLevel = level3Tries;
            levelClearedPara.innerHTML  = `Level cleared: ${level3Cleared}`;
            resetsPara.innerHTML  = `Resets: ${level3Tries}`;
        break;
        case 4:
            resetedLevel = level4Tries;
            levelClearedPara.innerHTML  = `Level cleared: ${level4Cleared}`;
            resetsPara.innerHTML  = `Resets: ${level4Tries}`;
        break;
        case 5:
            resetedLevel = level5Tries;
            levelClearedPara.innerHTML  = `Level cleared: ${level5Cleared}`;
            resetsPara.innerHTML  = `Resets: ${level5Tries}`;
        break;
        default:
            break;
    }
}
//Save the level reseted amounts
function saveResets() {
    switch(currentLevelInt){
        case 1:
            level1Tries = resetedLevel;
            resetsPara.innerHTML  = `Resets: ${level1Tries}`;
        break;
        case 2:
            level2Tries = resetedLevel;
            resetsPara.innerHTML  = `Resets: ${level2Tries}`;
        break;
        case 3:
            level3Tries = resetedLevel;
            resetsPara.innerHTML  = `Resets: ${level3Tries}`;
        break;
        case 4:
            level4Tries = resetedLevel;
            resetsPara.innerHTML  = `Resets: ${level4Tries}`;
        break;
        case 5:
            level5Tries = resetedLevel;
            resetsPara.innerHTML  = `Resets: ${level5Tries}`;
        
        break;
        default:
            break;
    }
}

//function to handle mouse click
function mouseDownHandler(event){
    //setup raycast and mouse position
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth)*2-1;
    mouse.y = -(event.clientY / window.innerHeight)*2+1;
    mouse.z = 0;
    raycaster.setFromCamera(mouse, camera);
// get intersections and loop through them
    let intersections = raycaster.intersectObjects(boxArray);
    if(clickLimit > 0){             //check if click limit allows box deletions
        if(intersections[0]){
            // Reactivate all boxes
            for (i = 0; i < boxArray.length; i++) {
                boxArray[i].applyCentralImpulse(new THREE.Vector3(0, 0, 0));
            }
            //set the gravity to -40
            scene.setGravity(new THREE.Vector3(0, -80, 0));
            //loop through all boxes and remove the clicked box
            boxArray.forEach(element => {
                if(element.name == intersections[0].object.name){
                    clickLimit--;
                    clicksPara.innerHTML  = `Clicks: ${clickLimit}`;
                    scene.remove(element);
                }
            });
        }
    }
}