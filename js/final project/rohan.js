// Author: Rohan Juneja
// Filename: rohan.js
// Date: april 10, 2021

Physijs.scripts.worker = 'physijs_worker.js'; 
Physijs.scripts.ammo = 'ammo.js';                        
let scene, renderer, camera, controls, axesHelper, control, spotLight, ambientLight;
let spotLightColor = 0x404040, ambientLightColor = 0xffffff;
let sceneAngle = 0;
let serverPort;
let playingLevelString = "Level 1";
let currentLevelInt = 1;
let levelOneRetries = 0,levelTwoRetries = 0,levelThreeRetries = 0, levelFourRetries = 0,levelFiveRetries = 0;
let currentLevelpara, levelClearedScoreboard, clickScoreboard, resetScoreboard, allowedClicks, resetLevel = 0;
let tableMaterial, scoreScoreboard, floorMaterial, tableGeometry,floorGeometry, tableTop,floor,texture,errorId;
let level1Cleared = 0,level2Cleared = 0,level3Cleared = 0,level4Cleared = 0,level5Cleared = 0, scoreCounter =0;
let boxArray = [];

window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    window.addEventListener('click', this.mouseDownHandler,false);
    this.render();
}

function init(){
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -20, 0));
    scene.allowSleep = true;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xeeebdd);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    serverPort = window.location.href;
    serverPort = serverPort.split("/");
    serverPort = serverPort[2].split(":");
    serverPort = serverPort[1];
 
    currentLevelpara = document.getElementById("currentLevelpara");
    clickScoreboard = document.getElementById("clickScoreboard");
    resetScoreboard = document.getElementById("resetScoreboard");
    scoreScoreboard = document.getElementById("scoreScoreboard");
    levelClearedScoreboard = document.getElementById("levelClearedScoreboard");
    errorId = document.getElementById("error");
};
function createCameraAndLights(){
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight,  0.1,  1000 );
    camera.position.set(0, 10, 35);
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);
    
    spotLight = new THREE.SpotLight(spotLightColor, 2.0);
    spotLight.position.set(0, 35, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(ambientLightColor, 0.8);
    ambientLight.position.set(0, 45, 0);
    scene.add(ambientLight);
};
function createGeometry(){
    texture = new THREE.TextureLoader().load( 'rohan1.jpg' );
    textureFloor = new THREE.TextureLoader().load( 'rohan2.jpg' );
    tableMaterial = Physijs.createMaterial(
        new THREE.MeshBasicMaterial( { map: texture } ),  0.25,       
        0.5); 
    tableGeometry = new THREE.BoxGeometry(15, 0.2, 25);
    tableTop = new Physijs.BoxMesh(tableGeometry, tableMaterial, 0);
    tableTop.receiveShadow = true;
    scene.add(tableTop);
    const geometry = new THREE.BoxGeometry( 1, 5, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(-7,-2.5,-12);
    scene.add( cube );
    const cube2 = new THREE.Mesh( geometry, material );
    cube2.position.set(7,-2.5,-12);
    scene.add( cube2 );
    const cube3 = new THREE.Mesh( geometry, material );
    cube3.position.set(-7,-2.5,12);
    scene.add( cube3 );
    const cube4 = new THREE.Mesh( geometry, material );
    cube4.position.set(7,-2.5,12);
    scene.add( cube4 );

    floorMaterial = Physijs.createMaterial(
        new THREE.MeshBasicMaterial( { map: textureFloor, transparent: true, opacity: 0.2} ),  0.25,       
        0.5,
       
        0.8,       
        0.2); 
    floorGeometry = new THREE.BoxGeometry(60, 0.2, 90);
    floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0);
    floor.receiveShadow = true;
    floor.position.set(0, -5, 0);
 

    floor.addEventListener( 'collision', function(other_object ) {
        if(other_object.name == "yellowBox" || other_object.name ==  "pinkBox"){
            scoreCounter += 100;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
           
            console.log("Total Score" + scoreCounter);
            if(other_object.name ==  "pinkBox"){
                console.log("Yes");
                levelCleared();
            }
        }

	});
    scene.add(floor);

    readFile(serverPort, "rohan1")
    
};

function setupDatgui(){

    control = new function () {
        this.ToggleSceneRotation = false;
        this.AmbientLight = true;
        this.SpotLight = true;
        this.Levels = "level"
        this.ResetThisLevel = () => {       
            resetLevel++;
            scoreCounter-=20;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            saveResets();
            readFile(serverPort,`rohan${currentLevelInt}`)
        };
        this.RestartGame = () =>{
            resetLevel++;
            scoreCounter=0;
            errorId.hidden = true;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            currentLevelInt = parseInt(1);
            setTimeout(levelChange,1000);                         
            readFile(serverPort,`rohan${1}`)
        }
    }
    let gui = new dat.GUI();
    gui.add(control, "SpotLight").onChange((e) => {
        spotLight.visible = e;
    })
    gui.add(control, "ToggleSceneRotation");
   
    gui.add(control, "AmbientLight").onChange((e) => {
        ambientLight.visible = e;
    })
    gui.add(control, 'Levels', { Level1: '1', Level2: '2', Level3: '3',Level4: '4',Level5: '5' }).name("Level Selector:")
            .onChange((level) => {                     
                playingLevelString = `Level ${level}`;
                currentLevelInt = parseInt(level);
                levelChange();                     
                readFile(serverPort,`rohan${level}`)
            });
    gui.add(control, 'ResetThisLevel').name("Reset this level only");
    gui.add(control, 'RestartGame').name("Restart the game");
};

function render(){
    controls.update();
     if (control.ToggleSceneRotation) {
         scene.rotation.y = sceneAngle += 0.02;
     }
     
     requestAnimationFrame(render);
     renderer.render(scene, camera);
     scene.simulate(undefined, 1);
};
//Read the selected json level file and pass it to createGame function
function readFile(serverPort, filename) {
    let url = 'http://localhost:' +
    serverPort + //port number from data.gui
    '/js/' + //url path
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

function createGame(levelConfig){
    scene.setGravity(new THREE.Vector3(0, -20, 0));
    let jsonObjLength = Object.keys(levelConfig.box).length;
    if(boxArray.length > 0){
        boxArray.forEach(element => {
            scene.remove(element);
            });
        boxArray = [];
    }
    allowedClicks = levelConfig.clicks;  
    clickScoreboard.innerHTML  = `Clicks: ${allowedClicks}`;
    for(let i = 0; i<jsonObjLength; i++){
        let boxX = levelConfig.box[i].size.x;
        let boxY = levelConfig.box[i].size.y;
        let boxZ = levelConfig.box[i].size.z;
        let boxColor = levelConfig.box[i].color;
        let boxTransparency = levelConfig.box[i].transparency;
        let boxOpacity = levelConfig.box[i].opacity;

        let boxPosX = levelConfig.box[i].position.x;
        let boxPosY = levelConfig.box[i].position.y;
        let boxPosZ = levelConfig.box[i].position.z;

        let boxFriction = levelConfig.boxFriction;
        let boxRestitution = levelConfig.boxRestitution;
        let boxMass = levelConfig.box[i].boxMass;

        let boxGeo = new THREE.BoxGeometry(boxX,boxY,boxZ);
        let boxMat = new THREE.MeshStandardMaterial({color: boxColor,transparent:boxTransparency,opacity: boxOpacity});

        let boxMatPhy = Physijs.createMaterial(boxMat, boxFriction, boxRestitution);
        let box = new Physijs.BoxMesh(boxGeo, boxMatPhy, boxMass);
        box.position.set(boxPosX,boxPosY,boxPosZ);
        box.name = `${levelConfig.box[i].name}`
        scene.add(box);
        boxArray.push(box);
    }
}

function levelCleared(){
    switch(currentLevelInt){
        case 1:
            level1Cleared++;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            console.log(scoreCounter);
            levelClearedScoreboard.innerHTML  = `<p>Success! Level 1 Cleared! <br>Level 2 loaded.</p>`;
            currentLevelInt = parseInt(2);
            setTimeout(levelChange,3000);   
            readFile(serverPort,`rohan${2}`);                
            
        break;
        case 2:
            level2Cleared++;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            console.log(scoreCounter);
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            levelClearedScoreboard.innerHTML  = `<p>Success! Level 2 Cleared!  <br>Level 3 loaded.</p>`;
            currentLevelInt = parseInt(3);
            setTimeout(levelChange,3000);                  
            readFile(serverPort,`rohan${3}`);
        break;
        case 3:
            level3Cleared++;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            levelClearedScoreboard.innerHTML  = `<p>Success! Level 3 Cleared!</p>  <br>Level 4 loaded.`;
            currentLevelInt = parseInt(4);
            setTimeout(myFunction, 3000);            
            readFile(serverPort,`rohan${4}`);
        break;
        case 4:
            level4Cleared++;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            levelClearedScoreboard.innerHTML  = `<p>Success! Level 4 Cleared!</p>  <br>Level 5 loaded.`;
            currentLevelInt = parseInt(5);
            setTimeout(levelChange,3000);                  
            readFile(serverPort,`rohan${5}`);
        break;
        case 5:
            level5Cleared++;
            scoreScoreboard.innerHTML = `<p>Score: ${scoreCounter}`;
            levelClearedScoreboard.innerHTML  = `<p>Level 5 Done! You won the game!</p>`;
        break;
        default:
            break;
    }
}

function levelChange(){
    switch(currentLevelInt){
        case 1:
            
            resetLevel = levelOneRetries;
            levelClearedScoreboard.innerHTML  = `<p> Level: 1</p>`;
            resetScoreboard.innerHTML  = `Resets: ${levelOneRetries}`;
        break;
        case 2:
            resetLevel = levelTwoRetries;
            levelClearedScoreboard.innerHTML  = `Level: 2`;
            resetScoreboard.innerHTML  = `Resets: ${levelTwoRetries}`;
        break;
        case 3:
            resetLevel = levelThreeRetries;
            levelClearedScoreboard.innerHTML  = `Level: 3`;
            resetScoreboard.innerHTML  = `Resets: ${levelThreeRetries}`;
        break;
        case 4:
            resetLevel = levelFourRetries;
            levelClearedScoreboard.innerHTML  = `Level: 4`;
            resetScoreboard.innerHTML  = `Resets: ${levelFourRetries}`;
        break;
        case 5:
            resetLevel = levelFiveRetries;
            levelClearedScoreboard.innerHTML  = `Level: 5`;
            resetScoreboard.innerHTML  = `Resets: ${levelFiveRetries}`;
        break;
        default:
            break;
    }
}

function mouseDownHandler(event){

    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth)*2-1;
    mouse.y = -(event.clientY / window.innerHeight)*2+1;
    mouse.z = 0;
    raycaster.setFromCamera(mouse, camera);

    let intersections = raycaster.intersectObjects(boxArray);
    if(allowedClicks > 0 ){           
        if(intersections[0]){
            for (i = 0; i < boxArray.length; i++) {
                boxArray[i].applyCentralImpulse(new THREE.Vector3(0, 0, 0));
            }
            scene.setGravity(new THREE.Vector3(0, -80, 0));

            boxArray.forEach(element => {
                if(element.name == intersections[0].object.name && element.name!="yellowBox" && element.name!="pinkBox"){
                    allowedClicks--;
                    clickScoreboard.innerHTML  = `Clicks: ${allowedClicks}`;
                    scene.remove(element);
                    errorId.hidden = true;
                }
                if(element.name=="yellowBox"   && element.name == intersections[0].object.name ){
                    errorId.hidden = false;
                    errorId.innerHTML = `<b>You cannot remove yellow box</b>`;
                }
                if(element.name=="pinkBox"   && element.name == intersections[0].object.name ){
                    errorId.hidden = false;
                    errorId.innerHTML = `<b>You cannot remove pink box</b>`;
                }
            });
        }
    }
}
function saveResets() {
    switch(currentLevelInt){
        case 1:
            levelOneRetries = resetLevel;
            resetScoreboard.innerHTML  = `Resets: ${levelOneRetries}`;
        break;
        case 2:
            levelTwoRetries = resetLevel;
            resetScoreboard.innerHTML  = `Resets: ${levelTwoRetries}`;
        break;
        case 3:
            levelThreeRetries = resetLevel;
            resetScoreboard.innerHTML  = `Resets: ${levelThreeRetries}`;
        break;
        case 4:
            levelFourRetries = resetLevel;
            resetScoreboard.innerHTML  = `Resets: ${levelFourRetries}`;
        break;
        case 5:
            levelFiveRetries = resetLevel;
            resetScoreboard.innerHTML  = `Resets: ${levelFiveRetries}`;
        
        break;
        default:
            break;
    }
}
