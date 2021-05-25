//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 02-rohan.js
// Feb 07, 2021 (my birthday)

//declare global variables
let scene, camera, renderer;
let sphere, control, plane;

//lights
let directionalLight;
let ambientLight;
let pointLight;
let spotLight;
let rectAreaLight;
let hemiSphereSkyLight;
let hemiSphereGroundLight;

//lights' colors
let directionalLightColor = 0xf3f57d;
let ambientLightColor = 0xf5dbc4;
let pointLightColor = 0x214359;
let spotLightColor = 0x942690;
let rectAreaLightColor = 0x662694;
let hemiSphereSkyLightColor = "#6dbabd";
let hemiSphereGroundLightColor = "#2f8f1a";

let axesHelper;


function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0x36382d));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set( -30, 40 , 30 );
  control =  new THREE.OrbitControls( camera, renderer.domElement);

   //Directional light
   directionalLight = new THREE.DirectionalLight(directionalLightColor, 0.10);
   directionalLight.position.set(10,15,0);
   directionalLight.castShadow = true
   scene.add(directionalLight);

   //Ambient light
   ambientLight = new THREE.AmbientLight( ambientLightColor, 0.05 );
   scene.add(ambientLight);

   //Create Point light
   pointLight = new THREE.PointLight(pointLightColor, 3.0, 10000, 0.5);
   pointLight.position.set( 3, 10, 9 );
   pointLight.castShadow = true;
   scene.add(pointLight);

   //SpotLight
   spotLight = new THREE.SpotLight(spotLightColor, 1.5);
   spotLight.position.set( 3, 3, 0 );
   spotLight.castShadow = true;
   scene.add(spotLight);

   //Rect area light
   rectAreaLight = new THREE.RectAreaLight( rectAreaLightColor, 10, 8, 10 );
   rectAreaLight.position.set( 22, 8, 0 );
   rectAreaLight.rotation.set
   scene.add( rectAreaLight );

   //hemisphere light
   hemiSphereLight = new THREE.HemisphereLight(hemiSphereSkyLightColor,hemiSphereGroundLightColor, 1,0.5);
   hemiSphereLight.position.set(0,25,0);
   scene.add(hemiSphereLight);

   //cyan blobs for debugging 
    let cyanBlobGeometry = new THREE.SphereGeometry( 1, 32, 32 );
    let cyanBlobMaterial = new THREE.MeshBasicMaterial( {color: 0x00FFFF} );
    let cyanBlogSpotLight = new THREE.Mesh( cyanBlobGeometry, cyanBlobMaterial );
    let cyanBlobRectAreaLight = new THREE.Mesh( cyanBlobGeometry, cyanBlobMaterial );
    let cyanBlobPointLight = new THREE.Mesh( cyanBlobGeometry, cyanBlobMaterial );
    let cyanBlobDirectionalLight = new THREE.Mesh( cyanBlobGeometry, cyanBlobMaterial );
    let cyanBlobHemiSphereLight = new THREE.Mesh( cyanBlobGeometry, cyanBlobMaterial );

    spotLight.add( cyanBlogSpotLight );
    rectAreaLight.add( cyanBlobRectAreaLight );
    pointLight.add( cyanBlobPointLight );
    directionalLight.add( cyanBlobDirectionalLight ); hemiSphereLight
    hemiSphereLight.add( cyanBlobHemiSphereLight ); 
  
}

function createGeometry() {
  // create the axws helper
  scene.add(new THREE.AxesHelper(20));
  // create the ground plane
  let geo = new THREE.PlaneBufferGeometry(60, 30);
  let mat = new THREE. MeshPhongMaterial ({ color: 0x808080  });
  plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -0.5 * Math.PI;
  plane.castShadow = true;
  plane.receiveShadow = true;
  scene.add(plane);

  createBox(0,1,0,4,Math.random() * 0xffffff);
  createBox(0,1,4,4,Math.random() * 0xffffff);
  createBox(0,1,8,4,Math.random() * 0xffffff);
  createBox(0,1,12,4,Math.random() * 0xffffff);
  createBox(0,1,15,2,Math.random() * 0xffffff);

  createBox(0,3,-1,2,Math.random() * 0xffffff);
  createBox(0,3,2,4,Math.random() * 0xffffff);
  createBox(0,3,6,4,Math.random() * 0xffffff);
  createBox(0,3,10,4,Math.random() * 0xffffff);
  createBox(0,3,14,4,Math.random() * 0xffffff);

  createBox(0,5,0,4,Math.random() * 0xffffff);
  createBox(0,5,4,4,Math.random() * 0xffffff);
  createBox(0,5,8,4,Math.random() * 0xffffff);
  createBox(0,5,12,4,Math.random() * 0xffffff);
  createBox(0,5,15,2,Math.random() * 0xffffff);


  createBox(0,7,-1,2,Math.random() * 0xffffff);
  createBox(0,7,2,4,Math.random() * 0xffffff);
  createBox(0,7,6,4,Math.random() * 0xffffff);
  createBox(0,7,10,4,Math.random() * 0xffffff);
  createBox(0,7,14,4,Math.random() * 0xffffff);

  createBox(0,9,0,4,Math.random() * 0xffffff);
  createBox(0,9,4,4,Math.random() * 0xffffff);
  createBox(0,9,8,4,Math.random() * 0xffffff);
  createBox(0,9,12,4,Math.random() * 0xffffff);
  createBox(0,9,15,2,Math.random() * 0xffffff);

  createBox(0,11,-1,2,Math.random() * 0xffffff);
  createBox(0,11,2,4,Math.random() * 0xffffff);
  createBox(0,11,6,4,Math.random() * 0xffffff);
  createBox(0,11,10,4,Math.random() * 0xffffff);
  createBox(0,11,14,4,Math.random() * 0xffffff);

  createBox(0,13,0,4,Math.random() * 0xffffff);
  createBox(0,13,4,4,Math.random() * 0xffffff);
  createBox(0,13,8,4,Math.random() * 0xffffff);
  createBox(0,13,12,4,Math.random() * 0xffffff);
  createBox(0,13,15,2,Math.random() * 0xffffff);

 
}
function createBox(cordinateX,cordinateY,cordinateZ,width,color){
   geo = new THREE.BoxGeometry(2,width,2);
   mat = new THREE.MeshBasicMaterial({color: color});
   mesh = new THREE.Mesh(geo, mat);
   mesh.rotation.x = -0.5 * Math.PI;
   mesh.position.set(cordinateX,cordinateY, cordinateZ);
   scene.add(mesh);
}


function setupDatGui(){
    //the object that is used by dat.GUI
    control = new function () {
        this.checkBoxAmbient = true;
        this.ambientIntensity = ambientLight.intensity; 
        this.ambientColor = ambientLightColor;

        this.checkBoxSpot = true;
        this.spotIntensity = spotLight.intensity; 
        this.spotColor = spotLightColor;

        this.checkBoxPoint = true;
        this.pointIntensity = pointLight.intensity; 
        this.pointColor = pointLightColor;

        this.checkBoxDirectional = true;
        this.directionalIntensity = directionalLight.intensity; 
        this.directionalColor = directionalLightColor;

        this.checkBoxRectArea = true;
        this.rectAreaIntensity = rectAreaLight.intensity; 
        this.rectAreaColor = rectAreaLightColor;

        this.checkBoxHemiSphere = true;
        this.hemisphereIntensity = hemiSphereLight.intensity; 
        this.hemiSphereSkyColor = hemiSphereSkyLightColor;
        this.hemiSphereGroundColor = hemiSphereGroundLightColor;
        
        }
        let gui = new dat.GUI();

    // Subfolder for Ambient Light
        let folderAmbientLight = gui.addFolder("Ambient Light");
        folderAmbientLight.add(control, "checkBoxAmbient").name('Visibility: ')
                .onChange((e) =>{ambientLight.visible = e;});
        folderAmbientLight.addColor(control, 'ambientColor').name('Color: ')
                .onChange(function() {ambientLight.color.set(control.ambientColor)});
        folderAmbientLight.add(control, 'ambientIntensity').min(0.00).max(2).step(0.01).name('Intensity')
                .onChange(function() {ambientLight.intensity = control.ambientIntensity});

        // Subfolder for Ambient Light
        let folderSpotLight = gui.addFolder("Spot Light");
        folderSpotLight.add(control, "checkBoxSpot").name('Visibility: ')
                .onChange((e) =>{spotLight.visible = e;});
        folderSpotLight.addColor(control, 'spotColor').name('Color: ')
                .onChange(function() {spotLight.color.set(control.spotColor)});
        folderSpotLight.add(control, 'spotIntensity').min(0).max(2).step(0.01).name('Intensity: ')
                .onChange(function() {spotLight.intensity = control.spotIntensity});

        // Subfolder for Point Light
        let folderPointLight = gui.addFolder("Point Light"); 
        folderPointLight.add(control, "checkBoxPoint").name('Visibility: ')
                .onChange((e) =>{pointLight.visible = e;});
        folderPointLight.addColor(control, 'pointColor').name('Color: ')
                .onChange(function() {pointLight.color.set(control.pointColor)});
        folderPointLight.add(control, 'pointIntensity').min(0).max(2).step(0.01).name('Intensity')
                .onChange(function() {pointLight.intensity = control.pointIntensity});

        // Subfolder for Directional Light
        let folderDirectionalLight = gui.addFolder("Directional Light");
        folderDirectionalLight.add(control, "checkBoxDirectional").name('Visibility: ')
                .onChange((e) =>{directionalLight.visible = e;});
        folderDirectionalLight.addColor(control, 'directionalColor').name('Color: ')
                .onChange(function() {directionalLight.color.set(control.directionalColor)});
        folderDirectionalLight.add(control, 'directionalIntensity').min(0).max(2).step(0.01).name('Intensity')
                .onChange(function() {directionalLight.intensity = control.directionalIntensity});

        // Subfolder for Rectangle Area Light
        let folderRectLight = gui.addFolder("Rectangle Area Light");
        folderRectLight.add(control, "checkBoxRectArea").name('Visibility: ')
                .onChange((e) =>{rectAreaLight.visible = e;});
        folderRectLight.addColor(control, 'rectAreaColor').name('Color: ')
                .onChange(function() {rectAreaLight.color.set(control.rectAreaColor)});
        folderRectLight.add(control, 'rectAreaIntensity').min(0).max(20).step(0.01).name('Intensity')
                .onChange(function() {rectAreaLight.intensity = control.rectAreaIntensity});

        // Subfolder for Hemisphere Light
        let folderHemisphereLight = gui.addFolder("Hemisphere Light");
        folderHemisphereLight.add(control, "checkBoxHemiSphere").name('Visibility: ')
                .onChange((e) =>{hemiSphereLight.visible = e;});
        folderHemisphereLight.addColor(control, 'hemiSphereSkyColor').name('Sky Color: ')
                .onChange(function() {hemiSphereLight.color.set(control.hemiSphereSkyColor)});
        folderHemisphereLight.addColor(control, 'hemiSphereGroundColor').name('Ground Color: ')
                .onChange(function() {hemiSphereLight.groundColor.set(control.hemiSphereGroundColor)});
        folderHemisphereLight.add(control, 'hemisphereIntensity').min(0).max(2).step(0.1).name('Intensity')
                .onChange(function() {hemiSphereLight.intensity = control.hemisphereIntensity});

}



function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
 
}
//javascript function to drive your scene
window.onload = (event) => {
  init();
  createCameraAndLights();
  createGeometry();
  setupDatGui();
  render();
}
