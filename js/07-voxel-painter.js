
let size = 100;
let number =20;
const cell = size/number;
const half_cell = cell *0.5
const cubeTexture = new THREE.TextureLoader().load('"../assets/textures/square.png');
const raycaster = new THREE.Raycaster();
let tops = [];

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

   gui.add(control, "name");
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