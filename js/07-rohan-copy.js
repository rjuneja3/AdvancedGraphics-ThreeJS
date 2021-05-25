// Author: Rohan Juneja
// Filename: 07-rohan.js
// Date: March 18, 2021

let size = 100;
let number =20;
const cell = size/number;
const half_cell = cell *0.5
const cubeTexture = new THREE.TextureLoader().load('../assets/textures/square.png');
const raycaster = new THREE.Raycaster();
let tops = [];

//declare global variables
let scene, camera, renderer;
let sphere, control, plane;

//lights
let directionalLight;
let ambientLight;


//lights' colors
let directionalLightColor = 0xf3f57d;
let ambientLightColor = 0xf5dbc4;


let axesHelper;



function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x808080);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(
        50,                                        
        window.innerWidth / window.innerHeight,    
        0.1,                                        
        1000                                        
    );
    camera.position.set(15, 40, 50);
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    
    
   //Directional light
   directionalLight = new THREE.DirectionalLight(directionalLightColor, 0.10);
   directionalLight.position.set(10,15,0);
   directionalLight.castShadow = true
   scene.add(directionalLight);

   //Ambient light
   ambientLight = new THREE.AmbientLight( ambientLightColor, 0.05 );
   scene.add(ambientLight);

}

function createGeometry() {
    const axesHelper = new THREE.AxesHelper(50);
    scene.add( axesHelper );
    let geoPlane = new THREE.PlaneBufferGeometry( cell, cell);
    let matPlane = new THREE.MeshLambertMaterial({color: 0xffffff, map: cubeTexture});
    plane = new THREE.Mesh(geoPlane, matPlane);
    plane.rotation.x = Math.PI *0.5;
    plane.receiveShadow = true;
    addGrid();
}

function setupDatgui() {
    control = new function () {
        this.name = "Lab 07 Rohan";
        this.number = number;

        this.checkBoxAmbient = true;
        this.ambientIntensity = ambientLight.intensity; 
        this.ambientColor = ambientLightColor;

    }
    let gui = new dat.GUI();

   gui.add(control, "name");
    // Subfolder for Ambient Light
    let folderAmbientLight = gui.addFolder("Ambient Light");
    folderAmbientLight.add(control, "checkBoxAmbient").name('Visibility: ')
            .onChange((e) =>{ambientLight.visible = e;});
    folderAmbientLight.addColor(control, 'ambientColor').name('Color: ')
            .onChange(function() {ambientLight.color.set(control.ambientColor)});
    folderAmbientLight.add(control, 'ambientIntensity').min(0.00).max(2).step(0.01).name('Intensity')
            .onChange(function() {ambientLight.intensity = control.ambientIntensity});

    
  
   
}

function onMouseDown(event){
    let mousePos = new THREE.Vector2(
        (event.clientX / window.innerWidth)*2-1,
    -(event.clientY / window.innerHeight)*2+1);
   raycaster.setFromCamera(mousePos, camera);

   let intersects = raycaster.intersectObjects(tops);
   if(intersects.length>0){ 
       let obj = intersects[0].object;
       let positionX = obj.position.x;
       let positionY = obj.position.y+half_cell;
       let positionZ = obj.position.z;
       let box  = new THREE.Mesh(
        new THREE.BoxBufferGeometry(cell,cell,cell),
        new THREE.MeshBasicMaterial({color: 0xffffff, map: cubeTexture})
       );
       box.position.set(positionX, positionY, positionZ);
       scene.add(box);
       obj.position.y += cell;
       
   }
}


function addGrid(){
    let mat = new THREE.MeshLambertMaterial({ color: 0xffffff, map: cubeTexture}); 
    let geo = new THREE.PlaneBufferGeometry(cell,cell);
   let meshPlane = new THREE.Mesh(geo, mat);
   meshPlane.rotation.x = Math.PI *-0.5;
     for(let z = -number/2; z<number/2; z++){
        for(let x =  -number/2; x< number/2; x++){
           let clone = meshPlane.clone();
           clone.position.set(x*cell, 0, z*cell);
           tops.push(clone);
           scene.add(clone);
        }
    }
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.onload = function () {
    this.init();

   
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    window.addEventListener('click',onMouseDown, false);
    this.render();
}