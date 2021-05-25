//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 05-rohan.js
// Feb 26, 2021


//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let stats;
//lights
let directionalLight;
let hemiSphereSkyLight;
let hemiSphereGroundLight;
//lights' colors
let directionalLightColor = 0x404040;
let hemiSphereSkyLightColor = 0x0000ff;
let hemiSphereGroundLightColor = 0x00ff00;


let axesHelper;
let control;

//Geometry
let wheel1,wheel2,wheel3,wheel4,wheel5,wheel6;

let plane;
let cube;

//rotation angle
let angle = 0;
let sceneAngle = 0;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x00ff00);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

//createCameraAndLights
function createCameraAndLights() {
    //create the camera
    camera = new THREE.PerspectiveCamera(
        60,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        10000                                         //far point
    );
    //set its position
    camera.position.set(0, 30, 50);
    //point the camera
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    //lights

    //Directional light
    directionalLight = new THREE.DirectionalLight(directionalLightColor, 3.0);
    directionalLight.position.set(20, 30, 0);
    directionalLight.castShadow = true
    let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    directionalLight.add(directionalLightHelper)
    directionalLight.visible = true;
    scene.add(directionalLight);


    //hemisphere light
    hemiSphereLight = new THREE.HemisphereLight(hemiSphereSkyLightColor, hemiSphereGroundLightColor, 0.5, 4);
    hemiSphereLight.position.set(50, 20, 0);
}

//createGeometry
function createGeometry() {
   //plane
   let mat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
   let geo = new THREE.PlaneGeometry(100, 100);
   plane = new THREE.Mesh(geo, mat);
   plane.rotation.x = -0.5 * Math.PI;
   plane.castShadow = true;
   plane.receiveShadow = true;
   scene.add(plane);
   plane.add(hemiSphereLight);

//creates wheels and attaches them to variable after created
    createWheel(12,10,9,2,0,15,15,0,0,0);
    wheel1 = container;
    createWheel(12,10,9,2,0,15,-15,0,0,0);
    wheel2 = container;
    createWheel(12,10,9,2,15,15,0,0,Math.PI/2,0);
    wheel3 = container;
    createWheel(12,10,9,2,-15,15,0,0,Math.PI/2,0);
    wheel4 = container;
    createWheel(12,10,9,2,0,5,0,Math.PI/2,0,0);
    wheel5 = container;
    createWheel(12,10,9,2,0,25,0,Math.PI/2,0,0);
    wheel6 = container;
   
}
//function that creates Spokes
function createSpokes(rotationAngle){
    var geometry = new THREE.CylinderGeometry( 1, 1, 10, 32 );
    geometry.translate(0.5,5,0);
    var material = new THREE.MeshNormalMaterial();
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(0,0,0)
    cylinder.rotation.z = rotationAngle;
    container.add( cylinder );
}


function createWheel(numberOfSpokes,outerRadius,innerRadius,axleRadius,xAxisPosition,yAxisPosition,zAxisPosition,
                    xRotationAxis,yRotationAxis,zRotationAxis){
     
      //Create the container to hold the objects
      container = new THREE.Object3D();
      container.position.set(xAxisPosition, yAxisPosition, zAxisPosition);
      container.rotation.x = xRotationAxis;
      container.rotation.y = yRotationAxis;
      container.rotation.z = zRotationAxis;
      scene.add(container);
  
      //create absellipse
      let absellipse = new THREE.Shape();
      absellipse.absellipse(0, 0, outerRadius, outerRadius);
      //create hole on the absellipse
      let absellipseHole = new THREE.Shape();
      absellipseHole.absellipse(0, 0, innerRadius, innerRadius)
      absellipse.holes.push(absellipseHole);
      //create the cylinder for the wheel
      let sylinder = new THREE.Shape();
      sylinder.absellipse(0, 0, axleRadius, axleRadius)
  
      //define settings for extrudegeometry
      let extrudeSettings = {
          steps: 2,
          depth: 1,
          bevelEnabled: true,
          bevelThickness: 2,
          bevelSize: 1,
          bevelOffset: 0,
          bevelSegments: 15
      };
  //create the ExtrudeGeometry
      geo = new THREE.ExtrudeGeometry(absellipse, extrudeSettings);
      mat = new THREE.MeshLambertMaterial({ color: 0x0000ff });
      let ringMesh = new THREE.Mesh(geo, mat);
      ringMesh.castShadow = true;
      ringMesh.receiveShadow = true;
      container.add(ringMesh);
      //create the cylinder for the wheel
      geo = new THREE.CylinderGeometry( 1.5, 1.5, 4, 32 );
      mat = new THREE.MeshStandardMaterial({ color: 0xbb0000 });
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

   
    gui.add(control, "ToggleSceneRotation");
}

//render
function render() {
   
 
    //Rotation of the wheels//
    wheel1.rotation.z = angle +=0.01;
    wheel2.rotation.z = angle +=0.01;
    wheel3.rotation.x = angle +=0.01;
    wheel4.rotation.x = angle +=0.01;
    wheel5.rotation.z = angle +=0.01;
    wheel6.rotation.z = angle +=0.01;
    if (control.ToggleSceneRotation) {
        scene.rotation.y = sceneAngle += 0.02;
    }
    // render using requestAnimationFrame
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    this.render();
}