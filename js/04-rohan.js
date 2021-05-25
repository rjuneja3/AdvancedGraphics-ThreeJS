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
let directionalLightHelper;
let spotLightHelper;
let axesHelper;
let side = ['THREE.FrontSide', 'THREE.BackSide', 'THREE.DoubleSide'];

let torusKnotColor = 0x1191ff

let torusKnotGeometry, materialSide;

const mat = new THREE.MeshPhysicalMaterial({color:torusKnotColor});;
const sideEnum = Object.freeze({"Front Side":THREE.FrontSide, "Back Side": THREE.BackSide, "Both Sides": THREE.DoubleSide});


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
   directionalLight = new THREE.DirectionalLight(directionalLightColor, 0.1);
   directionalLight.position.set(10,15,0);
   directionalLight.castShadow = true
   directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
   scene.add(directionalLightHelper);
   
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
   spotLight.position.set( 3, 15, 0 );
   spotLight.castShadow = true;
   scene.add(spotLight);
   spotLightHelper = new THREE.SpotLightHelper( spotLight, 5 );
   scene.add(spotLightHelper);

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
    directionalLight.add( cyanBlobDirectionalLight ); 
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

  
   //DodecahedronGeometry
   
   geo = new THREE.TorusKnotGeometry( 7, 2, 50, 16 );
   torusKnotGeometry = new THREE.Mesh(geo, mat);
   torusKnotGeometry.position.set(-5,11,0);
   torusKnotGeometry.castShadow = true;
   torusKnotGeometry.receiveShadow = true;
   scene.add(torusKnotGeometry);
    
   torusKnotGeometry.add(pointLight);
   torusKnotGeometry.add(spotLight);        
    rectAreaLight.lookAt( torusKnotGeometry.position );
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

        this.materialClearcoat = 0.3;
        this.materialClearcoatRoughness = 0.02;
        this.materialRoughness = 0.1;
        this.materialEmmissive = '#458389';
        this.materialEmissiveIntensity = 1;
        this.materialColor = '#458389';
        this.materialScale = 1;
        this.materialFlatShading = true;
        this.materialMetalness = 30;
        this.materialVisible = true;
        this.materialTransparent = false;
        this.materialOpacity = 0.5;
        this.materialWireframe = false;

        this.side = [];
        this.materialSide = function(){
                changeMaterialSide(torusKnotGeometry, this.side)
             };
        
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
                .onChange((e) =>{spotLight.visible = e; spotLightHelper.visible = e});
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
                .onChange((e) =>{directionalLight.visible = e; directionalLightHelper.visible =e});
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


        let materialPropertiesFolder = gui.addFolder('Material Properties');
        //clearcot
        materialPropertiesFolder.add(control, "materialClearcoat",0,1,0.01)
                .onChange((e) =>{torusKnotGeometry.material.clearcoat = e;});
        //clearcotRoughness
        materialPropertiesFolder.add(control, "materialClearcoatRoughness",0,1,0.01)
                .onChange((e) =>{torusKnotGeometry.material.clearcoatRoughness = e;});
        //metalness
        materialPropertiesFolder.add(control, "materialMetalness",0,1,0.01)
                .onChange((e) =>{torusKnotGeometry.material.metalness = e;});
        //roughness
        materialPropertiesFolder.add(control, "materialRoughness",0,1,0.01)
            .onChange((e) =>{torusKnotGeometry.material.roughness = e;});
        //color
        materialPropertiesFolder.addColor(control, "materialColor")
                 .onChange((c) => {torusKnotGeometry.material.color.set(c);});
        //emissive
        materialPropertiesFolder.addColor(control, "materialEmmissive")
                .onChange((e) => {torusKnotGeometry.material.emissive.set(e)});
        //emissiveIntensity
        materialPropertiesFolder.add(control, "materialEmissiveIntensity",0,10,0.1)
              .onChange((e) =>{torusKnotGeometry.material.emissiveIntensity = e;});
        //wireframe
        materialPropertiesFolder.add(control, "materialWireframe")
                .onChange((w) => {torusKnotGeometry.material.wireframe = w;});
        //opacity
        materialPropertiesFolder.add(control, "materialOpacity", 0.1,1.0,0.1)
                .onChange((o) => {torusKnotGeometry.material.opacity = o;});
        //transparent
        materialPropertiesFolder.add(control, "materialTransparent")
                .onChange((t) => {torusKnotGeometry.material.transparent = t;});
        //visible
        materialPropertiesFolder.add(control, "materialVisible")
                .onChange((e) =>{torusKnotGeometry.material.visible = e;});

        //flatShading
        materialPropertiesFolder.add(control, "materialFlatShading")
                .onChange((e) =>{torusKnotGeometry.material.flatShading = e;});

        materialPropertiesFolder.add(mat, 'side', sideEnum);

        let changeSideFolder = gui.addFolder('Change Side');
        changeSideFolder.add(control, 'side', side).name('Select Side:');
        changeSideFolder.add(control, 'materialSide').name("Change Side")
        ;

       
   
}



function changeMaterialSide( geometry, materialSide ) {
        console.log(materialSide);
        if(materialSide == 'THREE.FrontSide' ){
                geometry.material.side = 0;
                console.log(geometry.material.side);
        };
        if(materialSide == 'THREE.BackSide' ){
                geometry.material.side = 1;
                console.log(geometry.material.side);
        };
        if(materialSide == 'THREE.DoubleSide' ){
                geometry.material.side = 2;
                console.log(geometry.material.side);
        };
       

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
