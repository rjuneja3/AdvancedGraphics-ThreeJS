//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: rohan.js
// March 03, 2021 

//declare global variables
let scene, camera, renderer;
let sphere, control, plane;

//lights
let directionalLight;
let ambientLight;
let pointLight;
let hemiSphereSkyLight;
let hemiSphereGroundLight;

//lights' colors
let directionalLightColor = 0xf3f57d;
let ambientLightColor = 0xf5dbc4;
let pointLightColor = 0x214359;
let hemiSphereSkyLightColor = "#987bcf";
let hemiSphereGroundLightColor = "#707070";

let axesHelper;
let pointLightContainer, lowerArmContainer, armContainer,upperArmContainer;
let globalRotationSpeed = 0.01;

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0x4B3D2A));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set( -70, 70 , 70 );
  control =  new THREE.OrbitControls( camera, renderer.domElement);

   //Directional light
   directionalLight = new THREE.DirectionalLight(directionalLightColor, 0.10);
   directionalLight.position.set(10,15,0);
   directionalLight.castShadow = true
   scene.add(directionalLight);

   //Ambient light
   ambientLight = new THREE.AmbientLight( ambientLightColor, 0.05 );
   scene.add(ambientLight);
   
   pointLightContainer = createContainer();
   //Create Point light
   pointLight = new THREE.PointLight(pointLightColor, 3.0, 10000, 0.5);
   pointLightContainer.add(pointLight);
   pointLight.position.set( 15, 40, 30 );
   pointLight.castShadow = true;

   //hemisphere light
   hemiSphereLight = new THREE.HemisphereLight(hemiSphereSkyLightColor,hemiSphereGroundLightColor, 1,0.5);
   hemiSphereLight.position.set(0,25,0);
   scene.add(hemiSphereLight);

   //cyan blobs for debugging 
    let cyanBlobGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    let cyanBlobMaterial = new THREE.MeshStandardMaterial( {color: 0x00FFFF} );
    let cyanBlobPointLight = new THREE.Mesh( cyanBlobGeometry, cyanBlobMaterial );
    
    pointLight.add( cyanBlobPointLight );
    
    scene.add(pointLightContainer);
   
  
}

function createGeometry() {
  // create the axws helper
  scene.add(new THREE.AxesHelper(20));
  // create the ground plane
  let geo = new THREE.PlaneBufferGeometry(90, 90);
  let mat = new THREE. MeshStandardMaterial ({ color: 0x808080  });
  plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -0.5 * Math.PI;
  plane.castShadow = true;
  plane.receiveShadow = true;
  scene.add(plane);


  let torusGeometry = new THREE.TorusGeometry( 5, 2.5, 16, 100 );
  let torusMaterial = new THREE.MeshStandardMaterial( { color: 0x2f589c } );
  let torus = new THREE.Mesh( torusGeometry, torusMaterial );
  torus.rotation.x = -0.5 * Math.PI;
  torus.position.set(0,2,0);
  torus.castShadow = true;
  torus.receiveShadow = true;

  scene.add( torus );

  armContainer =createContainer();
  // lowerArmContainer = createContainer();
  lowerArmContainer = new THREE.Object3D();
  lowerArmContainer.position.set(0, 16, 0);
  upperArmContainer = createContainer();

  scene.add(armContainer);
  let boxGeometry = new THREE.BoxGeometry( 3, 16, 3 );
  let boxMaterial = new THREE.MeshStandardMaterial( {color: 0x1fdbc8} );
  let upperArm = new THREE.Mesh( boxGeometry, boxMaterial );
  upperArm.position.set(0,8,0);
  upperArm.castShadow = true;
  upperArm.receiveShadow = true;

  armContainer.add( upperArmContainer );
  armContainer.add(lowerArmContainer);
  upperArmContainer.add(upperArm);

  let armJointGeometry = new THREE.SphereGeometry( 3, 32, 32 );
  let armJointMaterial = new THREE.MeshStandardMaterial( {color: 0x1fdbc8} );
  let armJoint = new THREE.Mesh( armJointGeometry, armJointMaterial );
  armJoint.position.set(0,0,0);
  armJoint.castShadow = true;
  armJoint.receiveShadow = true;
  lowerArmContainer.add( armJoint );


  let armJointCylinderGeometry = new THREE.CylinderGeometry( 3.2, 3.2, 1, 32 );
  let armJointCylinderMaterial = new THREE.MeshStandardMaterial( {color: 0xa6ad18} );
  let armJointCylinder = new THREE.Mesh( armJointCylinderGeometry, armJointCylinderMaterial );
  armJointCylinder.position.set(0,0,0);
  armJointCylinder.castShadow = true;
  armJointCylinder.receiveShadow = true;
  lowerArmContainer.add( armJointCylinder );

  let lowerArmBoxesGeo = new THREE.BoxGeometry( 0.5, 14, 0.5 );
  let lowerArmBoxesMat = new THREE.MeshStandardMaterial( {color: 0xa6ad18} );
  let lowerArm = new THREE.Mesh( lowerArmBoxesGeo, lowerArmBoxesMat );
  let lowerArm2 = new THREE.Mesh( lowerArmBoxesGeo, lowerArmBoxesMat );
  let lowerArm3 = new THREE.Mesh( lowerArmBoxesGeo, lowerArmBoxesMat );
  let lowerArm4 = new THREE.Mesh( lowerArmBoxesGeo, lowerArmBoxesMat );
  lowerArm.position.set(1,7,1);
  lowerArm2.position.set(-1,7,-1);
  lowerArm3.position.set(1,7,-1);
  lowerArm4.position.set(-1,7,1);
  lowerArm.castShadow = true;
  lowerArm2.castShadow = true;
  lowerArm3.castShadow = true;
  lowerArm4.castShadow = true;
  lowerArm.receiveShadow = true;  
  lowerArm2.receiveShadow = true;
  lowerArm3.receiveShadow = true;
  lowerArm4.receiveShadow = true;
 
  lowerArmContainer.add( lowerArm );
  lowerArmContainer.add( lowerArm2 );
  lowerArmContainer.add( lowerArm3 );
  lowerArmContainer.add( lowerArm4 );

  let handGeometry = new THREE.CylinderGeometry( 2, 2, 3, 32 );
  let handMaterial = new THREE.MeshStandardMaterial( {color: 0xa6ad18} );
  let handCylinder = new THREE.Mesh( handGeometry, handMaterial );
  handCylinder.position.set(0,16,0);
  handCylinder.rotation.x = -0.5 * Math.PI;
  handCylinder.castShadow = true;
  handCylinder.receiveShadow = true;
  lowerArmContainer.add( handCylinder );







  //textGeometry for all shapes
	var loader = new THREE.FontLoader();
	loader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
		var textCredits = new THREE.TextGeometry( "By: Rohan juneja", {
			font: font,	
			size: 2,
			height: 1,
			curveSegments: 12,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: true
		} )

    var textCreditsMat = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var textCred = new THREE.Mesh( textCredits, textCreditsMat );
    textCred.position.set( -10,1,10 );
    
    scene.add( textCred );
   
    })
    
}


function createContainer(){
    let container = new THREE.Object3D();
    container.position.set(0, 0, 0);
    
    return container;
    }

function setupDatGui(){
    //the object that is used by dat.GUI
    control = new function () {
        this.checkBoxAmbient = true;
        this.ambientIntensity = ambientLight.intensity; 
        this.ambientColor = ambientLightColor;

        this.checkBoxPoint = true;
        this.pointIntensity = pointLight.intensity; 
        this.pointColor = pointLightColor;
        this.pointCastShadow = true;
        

        this.checkBoxDirectional = true;
        this.directionalIntensity = directionalLight.intensity; 
        this.directionalColor = directionalLightColor;

        this.checkBoxHemiSphere = true;
        this.hemisphereIntensity = hemiSphereLight.intensity; 
        this.hemiSphereSkyColor = hemiSphereSkyLightColor;
        this.hemiSphereGroundColor = hemiSphereGroundLightColor;
        
        this.raiseUpperArm = 0;
                
        this.raiseLowerArm =  0;
                
        this.swivelArm =  0;
        
        this.rotateLight = true;
        
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

      
        // Subfolder for Point Light
        let folderPointLight = gui.addFolder("Point Light"); 
        folderPointLight.add(control, "checkBoxPoint").name('Visibility: ')
                .onChange((e) =>{pointLight.visible = e;});
        folderPointLight.addColor(control, 'pointColor').name('Color: ')
                .onChange(function() {pointLight.color.set(control.pointColor)});
        folderPointLight.add(control, 'pointIntensity').min(0).max(2).step(0.01).name('Intensity')
                .onChange(function() {pointLight.intensity = control.pointIntensity});
        gui.add(control, 'pointCastShadow').name('Cast Shadow')
                .onChange(function() {pointLight.castShadow = control.pointCastShadow});
                pointLight.castShadow = true;
        gui.add(control, 'rotateLight').name('Rotate Light')
                
        // Subfolder for Directional Light
        let folderDirectionalLight = gui.addFolder("Directional Light");
        folderDirectionalLight.add(control, "checkBoxDirectional").name('Visibility: ')
                .onChange((e) =>{directionalLight.visible = e;});
        folderDirectionalLight.addColor(control, 'directionalColor').name('Color: ')
                .onChange(function() {directionalLight.color.set(control.directionalColor)});
        folderDirectionalLight.add(control, 'directionalIntensity').min(0).max(2).step(0.01).name('Intensity')
                .onChange(function() {directionalLight.intensity = control.directionalIntensity});

 
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

        gui.add(control, 'raiseUpperArm').min(-0.7).max(0.3).step(0.1).name('Raise Upper Arm')
                .onChange(function() {armContainer.rotation.x = control.raiseUpperArm});
        gui.add(control, 'raiseLowerArm').min(-1.7).max(1.7).step(0.1).name('Raise Lower Arm')
                .onChange(function() {lowerArmContainer.rotation.x = control.raiseLowerArm});
        gui.add(control, 'swivelArm').min(-2.8).max(2.9).step(0.1).name('Swivel Arm')
                .onChange(function() {armContainer.rotation.y = control.swivelArm});

}

function rotateLight() {
  //light rotation code goes here
    pointLightContainer.rotation.y +=0.01;
}

function render() {
 
  renderer.shadowMap.enabled = true;
  if(control.rotateLight == true){
    rotateLight();
    }

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
