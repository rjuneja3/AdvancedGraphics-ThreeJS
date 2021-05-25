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

let sunRadius = 696;;
let sunWidthSeg = 20;
let sundHeightSeg = 32;
let sunColor = 0xFF7F00;
let sunXPosition = 0;
let sunYPosition = 0;
let sunZPosition = 0;
let sunXRotation = 0;
let sunYRotation = 0;
let sunZRotation = 0;
let sunEmissive = 0xF8CE3B;

let globalRotationSpeed = 0.01;

let axesHelper;

let sun, mercury, venus, earth, earthMoon, mars, jupiter,
    jupiterMoon1, jupiterMoon2, jupiterMoon3, jupiterMoon4, jupiterMoon5,
    saturnMoon1, saturnMoon2, saturnMoon3, 
    saturn, saturnRing, uranus, neptune, pluto,
    sunCon,mercuryCon, venusCon, earthCon, marsCon, jupiterCon, 
    saturnCon, uranusCon, neptuneCon, plutoCon;

let planets = [];
let orbitLineArr = [];

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0x36382d));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
        camera = new THREE.PerspectiveCamera(
                90,                                         
                window.innerWidth / window.innerHeight,     
                0.1,                                        
                1000000                                        
                );
        camera.position.set(-30, 3000, 30);
        camera.lookAt(scene.position);
        controls = new THREE.OrbitControls( camera, renderer.domElement );
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
   pointLight.position.set( 0, 2000, 10 );
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
  scene.add(pointLight);
  scene.add(spotLight);        
  

  
    //Sun
    sun = createPlanet(sunRadius,sunWidthSeg,sundHeightSeg,sunColor, sunXPosition,sunYPosition,sunZPosition,sunEmissive);
    sunCon = createContainer();
    scene.add(sunCon);
    sunCon.add(sun);
    rectAreaLight.lookAt( sun.position );
    //Mercury
    mercury = createPlanet(4.8*2,20,32,0xC0C0C0, (sunXPosition+57.9*20),0,0);
    mercuryCon = createContainer();
    scene.add(mercuryCon);
    mercuryCon.add(mercury);
    planets.push(mercury);
    //Venus
    venus = createPlanet(12.1*2,20,32,0xebe939, (sunXPosition+108.1*20),0,0);
    venusCon = createContainer();
    scene.add(venusCon);
    venusCon.add(venus);
    planets.push(venus);
    //Earth
    earth = createPlanet(12.7*2,20,32,0x0000ff, (sunXPosition+149.6*20),0,0);
    earthCon = createContainer();
    scene.add(earthCon);
    earthCon.add(earth);
    planets.push(earth);
    //Earth moon
    earthMoon = createPlanet(4*2,20,32,0xC0C0C0, (earth.scale.x+10)*5,0,0);
    earth.add(earthMoon);
    
    //Mars
    mars = createPlanet(6.7*2,20,32,0xE27B58, (sunXPosition+227.9*20),0,0);
    marsCon = createContainer();
    scene.add(marsCon);
    marsCon.add(mars);
    planets.push(mars);
    //Jupiter
    jupiter = createPlanet(142.9*3,20,32,0xFF7F00, (sunXPosition+778.3*20),0,0);
    jupiterCon = createContainer();
    scene.add(jupiterCon);
    jupiterCon.add(jupiter);
    planets.push(jupiter);
    //Jupiter's moons
    jupiterMoon1 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x-50)*10,-200,-245);
    jupiter.add(jupiterMoon1);
    jupiterMoon2 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x-50)*10,-100,-50);
    jupiter.add(jupiterMoon2);
    jupiterMoon3 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x+50)*10,0,0);
    jupiter.add(jupiterMoon3);
    jupiterMoon4 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x+50)*10,200,50);
    jupiter.add(jupiterMoon4);
    jupiterMoon5 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x+50)*10,400,185);
    jupiter.add(jupiterMoon5);
    //Saturn
    saturn = createPlanet(120.5*3,20,32,0xc2bd60, (sunXPosition+1427*20),0,0);
    saturnRing = createRing(600,750,32,0xc2bd60);
    
    saturnCon = createContainer();
    scene.add(saturnCon);
    saturnCon.add(saturn);
    saturn.add(saturnRing);
    planets.push(saturn);
    //Saturn's moons
    saturnMoon1 = createPlanet(4*2,20,32,0xC0C0C0, (saturn.scale.x+10)*5,0,0);
    saturn.add(saturnMoon1);
    saturnMoon2 = createPlanet(4*2,20,32,0xC0C0C0, (saturn.scale.x+10)*5,0,0);
    saturn.add(saturnMoon2);
    saturnMoon3 = createPlanet(4*2,20,32,0xC0C0C0, (saturn.scale.x+10)*5,0,0);
    saturn.add(saturnMoon3);
    //Uranus
    uranus = createPlanet(51.1*2,20,32,0x000080, (sunXPosition+2870*20),0,0);
    uranusCon = createContainer();
    scene.add(uranusCon);
    uranusCon.add(uranus);
    planets.push(uranus);
    //Neptune
    neptune = createPlanet(49.5*2,20,32,0x000090, (sunXPosition+4496.9*20),0,0);
    neptuneCon = createContainer();
    scene.add(neptuneCon);
    neptuneCon.add(neptune);
    planets.push(neptune);
    //Pluto
    pluto = createPlanet(2.3*5,20,32,0xc89357, (sunXPosition+5906.4*20),0,0);
    plutoCon = createContainer();
    scene.add(plutoCon);
    plutoCon.add(pluto);
    planets.push(pluto);
}

function createPlanet(radius,widthSegments, heightSegments,color,xPosition, yPosition, zPosition,emissive){

    
    //create the planet
    let mat = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
    let geo = new THREE.SphereBufferGeometry(radius,widthSegments,heightSegments);
    let planet = new THREE.Mesh(geo, mat);
    planet.position.set(xPosition,yPosition,zPosition);
    
    let segments = 64;
    let lineMat = new THREE.LineBasicMaterial( { color: 0xffffff } );
    let lineGeo = new THREE.CircleGeometry( xPosition, segments );
    lineGeo.vertices.shift();

    let orbitLine = new THREE.LineLoop( lineGeo, lineMat );
    orbitLine.rotation.x = Math.PI * 0.5; 
    scene.add( orbitLine );
    orbitLineArr.push(orbitLine);
    

    return planet;
    
}

function createContainer(){
let container = new THREE.Object3D();
container.position.set(0, 0, 0);

return container;
}

function createRing(ringInnerRadius, ringOuterRadius, ringThetaSegments, ringColor){
let ringGeo = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, ringThetaSegments);
let ringMat = new THREE.MeshBasicMaterial({color: ringColor});
let ringMesh = new THREE.Mesh(ringGeo, ringMat);

ringMesh.material.side = THREE.DoubleSide;
ringMesh.rotation.x = Math.PI*0.5;

return ringMesh;
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

        this.planetRotation = false;
            this.planetScales = 1;
            this.lineBoolean = true;
            this.rotationSpeedGlobal = 0.01;
        
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
        
        
        gui.add(control, "planetRotation");
        gui.add(control, "planetScales", 1, 10, 0.2)
                .onChange((e) => {scalePlanets(e);});
        gui.add(control, "lineBoolean")
                .onChange((e) => {showOrbitLines(e);});
        gui.add(control, "rotationSpeedGlobal",0.01,0.10,0.01)
                .onChange((e) => {globalRotationSpeed = e;})
}


function scalePlanets(planetRadius){
    for(let i = 0; i<planets.length;i++){
        planets[i].scale.x = planetRadius;
        planets[i].scale.y = planetRadius;
        planets[i].scale.z = planetRadius;
    }
}
function showOrbitLines(visibleBool){
    for(let i = 0; i<orbitLineArr.length; i++){
        orbitLineArr[i].visible = visibleBool;
        console.log("Showing Orbital Lines")
    }
}

function rotatePlanets(){
    sun.rotation.y += globalRotationSpeed;
    mercury.rotation.y += globalRotationSpeed*0.08;
    venus.rotation.y += globalRotationSpeed*0.01;
    earth.rotation.y += globalRotationSpeed;
    mars.rotation.y += globalRotationSpeed;
    jupiter.rotation.y += globalRotationSpeed*2.3;
    saturn.rotation.y += globalRotationSpeed*2.2;
    uranus.rotation.y += globalRotationSpeed*1.5;
    neptune.rotation.y += globalRotationSpeed*1.6;
    pluto.rotation.y += globalRotationSpeed*0.16;
    sunCon.rotation.y += globalRotationSpeed;
    mercuryCon.rotation.y += globalRotationSpeed*4;
    venusCon.rotation.y += globalRotationSpeed*3;
    earthCon.rotation.y += globalRotationSpeed;
    marsCon.rotation.y += globalRotationSpeed*0.5;
    jupiterCon.rotation.y += globalRotationSpeed*0.4;
    saturnCon.rotation.y += globalRotationSpeed*0.3;
    uranusCon.rotation.y += globalRotationSpeed*0.2;
    neptuneCon.rotation.y += globalRotationSpeed*0.1;
    plutoCon.rotation.y += globalRotationSpeed*0.08;
}

//render
function render() {
       
        if(control.planetRotation == true){
            rotatePlanets();
        }
        if(control.lineBoolean == false){
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
