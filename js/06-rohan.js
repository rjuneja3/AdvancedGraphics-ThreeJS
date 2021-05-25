//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 06-rohan.js
// March14, 2021

let scene, renderer, camera, controls, stats;
let control;
let baseCon, wheelCon, wheelConPlaceholder,ferWheelCont, spokeContainer,spokeContainerChild,
    casketContainer,casketContainerChild, axle,plane,spoke,rimMesh,casketHolderSpoke, casket;
let spokeArray = [];
let casketArray = [];
let rimArray = [];
let rimOuterRadius = 10;
let rimInnerRadius = 9;
let xPosition = 0;
let yPosition = 0; 
let zPosition = 0;
let ferrishWheelArr = [];
let axleArray = [];
let numSpokes = 14;
let axleRadius = 2;
let spokeLength = 13.5;
let wheelRadius = 20;
let sceneAngle = 0;
let spotLight;
let spotLightColor = 0x404040;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf2edd7);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(
        60,                                        
        window.innerWidth / window.innerHeight,   
        0.1,                                        
        1000                                         
    );

    camera.position.set(0, 40, 80);
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    spotLight = new THREE.SpotLight(spotLightColor, 3.0);
    spotLight.position.set(10, 50, 5);
    spotLight.receiveShadow = true;
    spotLight.castShadow = true
    spotLight.visible = true;
    scene.add(spotLight);
    
}

function createGeometry() {
    let mat = new THREE.MeshLambertMaterial({ color: 0x709fb0 });
    let geo = new THREE.PlaneGeometry(100, 100);
    plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);
    createContainers();
    createWheel(numSpokes,rimOuterRadius,rimInnerRadius,xPosition,yPosition,zPosition);
}

function createContainers(){
    baseCon = new THREE.Object3D();
    baseCon.position.set(0, 25, 0);
    baseCon.rotation.x = Math.PI;
    baseCon.rotation.y =Math.PI;
    scene.add(baseCon);
    wheelCon = new THREE.Object3D();
    wheelCon.position.set(0, 0, 0);
    baseCon.add(wheelCon);
}

function createWheel(numSpokes,rimOuterRadius,rimInnerRadius,rimXPosition,rimYPosition,rimZPosition){
   
    wheelConPlaceholder = new THREE.Object3D();
    wheelConPlaceholder.position.set(0, 0, 0);
    wheelCon.add(wheelConPlaceholder);

        ferWheelCont = new THREE.Object3D();
        ferWheelCont.position.set(0,0,0);
        wheelConPlaceholder.add(ferWheelCont);
        ferrishWheelArr.push(ferWheelCont);

        let geo = new THREE.CylinderGeometry( axleRadius, axleRadius, 8, 32 );
        let mat = new THREE.MeshLambertMaterial({ color: 0xbb0000 });
        axle = new THREE.Mesh(geo, mat);
        axle.position.set(0,0,4.5);
        axle.rotation.x=Math.PI*0.5;
        axle.castShadow = true;
        axle.receiveShadow = true;
        ferWheelCont.add(axle);
        axleArray.push(axle);
        let absellipse = new THREE.Shape();
        absellipse.absellipse(0, 0, rimOuterRadius, rimOuterRadius);

        let absellipseHole = new THREE.Shape();
        absellipseHole.absellipse(0, 0, rimInnerRadius, rimInnerRadius)
        absellipse.holes.push(absellipseHole);

        let extrudeSettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        geo = new THREE.ExtrudeGeometry(absellipse, extrudeSettings);
        mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        rimMesh = new THREE.Mesh(geo, mat);
        rimMesh.castShadow = true;
        rimMesh.receiveShadow = true;
        ferWheelCont.add(rimMesh);
        rimMesh.position.set(rimXPosition,rimYPosition,rimZPosition+1);

         geo = new THREE.ExtrudeGeometry(absellipse, extrudeSettings);
         mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
         rimMesh2 = new THREE.Mesh(geo, mat);
         rimMesh2.castShadow = true;
         rimMesh2.receiveShadow = true;
         ferWheelCont.add(rimMesh2);
         rimMesh2.position.set(rimXPosition,rimYPosition,rimZPosition+6);

        rimArray.push(rimMesh2);

        let rotationMultiplier = 1;
        for(let y = 0; y<numSpokes; y++){
            createRimSpokesAndCaskets(Math.PI*rotationMultiplier,rimXPosition,rimYPosition,rimZPosition+1);
            rotationMultiplier -= 2/numSpokes;
           
        }
        let rotationMultiplier2 = 1;
        for(let y = 0; y<numSpokes; y++){
           createRimSpokes(Math.PI*rotationMultiplier2,rimXPosition,rimYPosition,rimZPosition+6);
            rotationMultiplier2 -= 2/numSpokes;
        }
    
    
}
function createRimSpokes(rotationAngle,xPositionSpoke,yPositionSpoke,zPositionSpoke){

    spokeContainer = new THREE.Object3D();
    spokeContainer.position.set(0, 0, 0);
    ferWheelCont.add(spokeContainer);

    spokeContainerChild = new THREE.Object3D();
    spokeContainerChild.position.set(0,0,0);
    spokeContainer.add(spokeContainerChild);

    let geometry = new THREE.BoxGeometry( 1, spokeLength, 0.5, 32,32,32 );
    geometry.translate(0.5,5,0);
    let material = new THREE.MeshNormalMaterial();
    spoke = new THREE.Mesh( geometry, material );
    spoke.position.set(xPositionSpoke,yPositionSpoke,zPositionSpoke+0.5)
    spoke.rotation.z = rotationAngle;
    spoke.castShadow = true;
    spoke.receiveShadow = true;
    spokeContainerChild.add(spoke);
    spokeArray.push(spoke);
}

function createRimSpokesAndCaskets(rotationAngle,xPositionSpoke,yPositionSpoke,zPositionSpoke){

    spokeContainer = new THREE.Object3D();
    spokeContainer.position.set(0, 0, 0);
    ferWheelCont.add(spokeContainer);

    spokeContainerChild = new THREE.Object3D();
    spokeContainerChild.position.set(0,0,0);
    spokeContainer.add(spokeContainerChild);

    let geometry = new THREE.BoxGeometry( 1, spokeLength, 0.5, 32,32,32 );
    geometry.translate(0.5,5,0);
    let material = new THREE.MeshNormalMaterial();
    spoke = new THREE.Mesh( geometry, material );
    spoke.position.set(xPositionSpoke,yPositionSpoke,zPositionSpoke+0.5)
    spoke.rotation.z = rotationAngle;
    spoke.castShadow = true;
    spoke.receiveShadow = true;
    spokeContainerChild.add(spoke);
    spokeArray.push(spoke);
    
    geometry = new THREE.BoxGeometry( 0.5, 5, 0.5, 32,32,32 );
    material = new THREE.MeshNormalMaterial();
    casketSpoke = new THREE.Mesh( geometry, material );
    casketSpoke.position.set(0.5, yPositionSpoke+11.5,2.5)
    casketSpoke.rotation.x = Math.PI*0.5;
    casketSpoke.rotation.y = -rotationAngle;
    casketSpoke.castShadow = true;
    casketSpoke.receiveShadow = true;
    spoke.add(casketSpoke);
    
    geometry = new THREE.BoxGeometry( 0.5, 3, 0.5, 32,32,32 );
    material = new THREE.MeshNormalMaterial();
    casketHolderSpoke = new THREE.Mesh( geometry, material );
    casketHolderSpoke.position.set(0, 0,-1.5)
    casketHolderSpoke.rotation.x = Math.PI*0.5;
    casketHolderSpoke.castShadow = true;
    casketHolderSpoke.receiveShadow = true;
    casketSpoke.add(casketHolderSpoke);

    geometry = new THREE.SphereGeometry(1,32,32,0,Math.PI*2,0,2)
    material = new THREE.MeshLambertMaterial({color: 0xff0000});
    casket = new THREE.Mesh(geometry, material);
    casket.position.set(0,-1,0);
    casket.rotation.x = Math.PI;
    casket.castShadow = true;
    casket.receiveShadow = true;
    casketHolderSpoke.add(casket);
    casketArray.push(casketSpoke);
   
}


function setupDatgui() {
    control = new function () {
        this.name = "Lab 06 Rohan";
        this.rimOuterRadius = rimOuterRadius;
        this.rimInnerRadius = rimInnerRadius;
        this.RimWidth = 1;
        this.AxleRadius = 1;
        this.SpokeLength = 1;
        this.numSpokes = numSpokes;
        this.ToggleSceneRotation = false;
        this.ToggleWheelRotation = false;
    }
    let gui = new dat.GUI();

   gui.add(control, "name");
    gui.add(control, "RimWidth",0.1,2,0.1).name("Rim Width")
            .onChange((e) => {
                wheelCon.scale.x = e;
                wheelCon.scale.y = e;
                wheelCon.scale.z = e;
            });;
    gui.add(control, "AxleRadius",0.1,2,0.1).name("Axle Radius")
            .onChange((e) => {
                axleArray.forEach(element => {
                    element.scale.x = e;
                    element.scale.y = e;
                    element.scale.z = e;
                });
               
            });
    gui.add(control, "rimOuterRadius",5,15,1).name("Outer Radius")
            .onChange((e) => {
                rimOuterRadius = e;
            });
    gui.add(control, "rimInnerRadius", 1,15,1).name("Inner Radius")
            .onChange((e) => {
                rimInnerRadius = e;
            });
    gui.add(control, "SpokeLength",0.5,2,0.1).name("Spoke Length")
            .onChange((e) => {
                spokeArray.forEach(element => {
                    element.scale.y = e;
                });;
            });
    gui.add(control, "numSpokes",1,20,1).name("No. Spokes")
            .onChange((e) => {
                numSpokes = e;
                wheelCon.remove(wheelConPlaceholder);
                casketArray = [];
                spokeArray = [];
                rimArray = [];
                wheelAngle = 0;
                createWheel(numSpokes,rimOuterRadius,rimInnerRadius,xPosition,yPosition,zPosition);
            });
    gui.add(control, "ToggleSceneRotation").name("Scene Rotation");
    gui.add(control, "ToggleWheelRotation").name("Wheel Rotation");
}


function render() {

    if (control.ToggleSceneRotation) {
        scene.rotation.y = sceneAngle += 0.02;
    }
    if (control.ToggleWheelRotation) {
        ferrishWheelArr.forEach(element => {
            element.rotation.z -= 0.02;  
        });
        casketArray.forEach(element => {
            element.rotation.y +=0.02;
        });
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    this.render();
}