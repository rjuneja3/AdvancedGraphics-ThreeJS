//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 05-rohan.js
// March 09, 2021

let scene;
let renderer;
let camera;
let controls;
let stats;
let directionalLight;
let hemiSphereSkyLight;
let hemiSphereGroundLight;
let directionalLightColor = 0x404040;
let hemiSphereSkyLightColor = 0x0000ff;
let hemiSphereGroundLightColor = 0x00ff00;

let axesHelper;
let control;
let containers = [];
let wheel1;
let plane;
let cube;
let angle = 0;
let sceneAngle = 0;

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
        10000                                         
    );

    camera.position.set(0, 30, 50);
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    directionalLight = new THREE.DirectionalLight(directionalLightColor, 3.0);
    directionalLight.position.set(20, 30, 0);
    directionalLight.castShadow = true
    let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    directionalLight.add(directionalLightHelper)
    directionalLight.visible = true;
    scene.add(directionalLight);
    hemiSphereLight = new THREE.HemisphereLight(hemiSphereSkyLightColor, hemiSphereGroundLightColor, 0.5, 4);
    hemiSphereLight.position.set(50, 20, 0);
}

function createGeometry() {
   let mat = new THREE.MeshLambertMaterial({ color: 0x3a6351 });
   let geo = new THREE.PlaneGeometry(100, 100);
   plane = new THREE.Mesh(geo, mat);
   plane.rotation.x = -0.5 * Math.PI;
   plane.castShadow = true;
   plane.receiveShadow = true;
   scene.add(plane);
   plane.add(hemiSphereLight);
    createWheel(12,10,9,2,0,15,15,0,0,0);
    wheel1 = container;
}

function createSpokes(rotationAngle){
    var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 10, 32 );
    geometry.translate(0.5,5,0);
    var material = new THREE.MeshNormalMaterial();
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(0,0,0)
    cylinder.rotation.z = rotationAngle;
    container.add( cylinder );
}

function createWheel(numberOfSpokes,outerRadius,innerRadius,axleRadius,xAxisPosition,yAxisPosition,zAxisPosition,
                    xRotationAxis,yRotationAxis,zRotationAxis){
        
      container = new THREE.Object3D();
      container.position.set(xAxisPosition, yAxisPosition, zAxisPosition);
      container.rotation.x = xRotationAxis;
      container.rotation.y = yRotationAxis;
      container.rotation.z = zRotationAxis;
        containers.push(container);
      scene.add(container);
  
      let absellipse = new THREE.Shape();
      absellipse.absellipse(0, 0, outerRadius, outerRadius);
      //create hole on the absellipse
      let absellipseHole = new THREE.Shape();
      absellipseHole.absellipse(0, 0, innerRadius, innerRadius)
      absellipse.holes.push(absellipseHole);
 
      let sylinder = new THREE.Shape();
      sylinder.absellipse(0, 0, axleRadius, axleRadius)
      let extrudeSettings = {
          steps: 5,
          depth:1,
          bevelEnabled: true,
          bevelThickness: 1.5,
          bevelSize: 0.5,
          bevelOffset: 0,
          bevelSegments: 15
      };
 
      geo = new THREE.ExtrudeGeometry(absellipse, extrudeSettings);
      mat = new THREE.MeshLambertMaterial({ color: 0x393232 });
      let ringMesh = new THREE.Mesh(geo, mat);
      ringMesh.castShadow = true;
      ringMesh.receiveShadow = true;
      container.add(ringMesh);

      geo = new THREE.CylinderGeometry( 1.5, 1.5, 4, 32 );
      mat = new THREE.MeshStandardMaterial({ color: 0xe48257 });
      let sylinderMesh = new THREE.Mesh(geo, mat);
      sylinderMesh.position.set(0,0,0);
      sylinderMesh.rotation.x=Math.PI/2;
      container.add(sylinderMesh);
      //Rotate the spokes
      let multiplier = 1;
      for(let i = 0; i<numberOfSpokes; i++){
          
          createSpokes(Math.PI*multiplier);
          multiplier -= 0.166666;
          
      }
      
  }


function setupDatgui() {
    //the object that is used by dat.GUI
    control = new function () {
        this.ToggleSceneRotation = false;
    }
    let gui = new dat.GUI();
    control = new function(){
        this.name = "Lab 05 Rohan";
        this.numberOfSpokes = 12;
        this.outerRadius = 10;
        this.innerRadius = 8;
        this.bevelThickness=0.5;
        this.xAxisPosition = 5;
        this.yAxisPosition = 4;
        this.zAxisPosition=5;
        this.ToggleSceneRotation = false;
        this.btnCreateWheel = function(){
            
            createWheel(this.numberOfSpokes,this.outerRadius,this.innerRadius,2,this.xAxisPosition,this.yAxisPosition,this.zAxisPosition,
                0,0,0)
       };
    }

    gui.add(control, 'name');
    gui.add(control, 'numberOfSpokes').min(2).max(15).step(1).name('No. of Spokes: '); 
    gui.add(control, 'outerRadius').min(2).max(15).step(1).name('Outer Radius: '); 
    gui.add(control, 'innerRadius').min(2).max(15).step(1).name('Inner Radius: '); 
    gui.add(control, 'bevelThickness').min(0.01).max(4).step(0.01).name('Thickeness: '); 
    gui.add(control, 'xAxisPosition').min(0).max(100).step(1).name('X Axis Position: '); 
    gui.add(control, 'yAxisPosition').min(2).max(100).step(1).name('Y Axis Position: '); 
    gui.add(control, 'zAxisPosition').min(2).max(100).step(1).name('Z Axis Position: '); 
    gui.add(control, 'btnCreateWheel').name('Create Wheel'); 
    gui.add(control, "ToggleSceneRotation");
}

//render
function render() {
   
    containers.forEach(element => element.rotation.z = angle +=0.01) ;

    
    if (control.ToggleSceneRotation) {
        scene.rotation.y = sceneAngle += 0.02;
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