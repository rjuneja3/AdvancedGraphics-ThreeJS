
//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: rohan.js
// Feb 19, 2021 

let scene;
let renderer;
let camera;
let controls;
let stats;
let directionalLight;
let sun, mercury, venus, earth, mars, jupiter,saturn,uranus, neptune, pluto;
let earthMoon, jupiterMoon1, jupiterMoon2, jupiterMoon3, jupiterMoon4, jupiterMoon5,
    saturnMoon1, saturnMoon2, saturnMoon3, saturnRing;
let globalMoonRotationSpeed = 0.001;
let pointLightColor = 0x40404;
let sunRadius = 696;;
let sunWidthSeg = 20;
let sundHeightSeg = 32;
let sunColor = 0xFF7F00;
let sunEmissive = 0xF8CE3B;
let planetEmissive = 0xFFFFFF;
let rotationSpeed = 0.001;
let axesHelper,
    control;
let sunContainer,mercuryContainer, venusContainer, earthContainer, marsContainer, jupiterContainer, 
    saturnContainer, uranusContainer, neptuneCon, plutoContainer;
let planets = [];
let orbitLineArr = [];

function init() {
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x2b2d2e);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);
}


function createCameraAndLights() {
        camera = new THREE.PerspectiveCamera(
        90,                                         
        window.innerWidth / window.innerHeight,     
        0.1,                                        
        100000                                        
        );
     
        camera.position.set(-200, 5000, 200);
        camera.lookAt(scene.position);
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.update();
        pointLight = new THREE.PointLight(pointLightColor, 150);
        pointLight.position.set( 0, 200, 10 );
        pointLight.castShadow = true;
        scene.add(pointLight);

}

function createGeometry() {
    //Sun
    sun = createPlanet(sunRadius,sunWidthSeg,sundHeightSeg,sunColor, 0,0,0,sunEmissive);
    sunContainer = createContainer();
    //mercuty
    mercury = createPlanet(49*2,20,32,0xC0C0C0, (57.9*20),0,0, 0, true);
    mercuryContainer = createContainer();
    //Venus
    venus = createPlanet(120*2,20,32,getRandomColor(), (108.1*20),0,0,  0, true);
    venusContainer = createContainer();
    //Earth
    earth = createPlanet(127*2,20,32,0x0000ff, (149.6*20),0,0,  0, true);
    earthContainer = createContainer();
    //Earth moon
    earthMoon = createPlanet(40*1,20,32,0xC0C0C0, (earth.scale.x+100)*5,0,0);
    //Mars
    mars = createPlanet(67*2,20,32,0xE27B58, (227.9*20),0,0,  0, true);
    marsContainer = createContainer();
    //Jupiter
    jupiter = createPlanet(142.9*8,20,32,0xFF7F00, (778.3*20),0,0,  0, true);
    jupiterContainer = createContainer();
    //Jupiter's moons
    jupiterMoon1 = createPlanet(80*2,20,32,0xC0C0C0, (jupiter.scale.x-180)*10,-400,-245);
    jupiterMoon2 = createPlanet(80*2,20,32,0xC0C0C0, (jupiter.scale.x-180)*10,-10,0);
    jupiterMoon3 = createPlanet(80*2,20,32,0xC0C0C0, (jupiter.scale.x+180)*10,0,0);
    jupiterMoon4 = createPlanet(80*2,20,32,0xC0C0C0, (jupiter.scale.x+180)*10,500,50);
    jupiterMoon5 = createPlanet(80*2,20,32,0xC0C0C0, (jupiter.scale.x+180)*10,1000,185);
    //Saturn
    saturn = createPlanet(120.5*8,20,32,0xc2bd60, (1427*20),0,0,  0, true);
    saturnRing = createRing(1400,1950,32,0xc2bd60);
    saturnContainer = createContainer();
    //Saturn's moons
    saturnMoon1 = createPlanet(40*2,20,32,0xC0C0C0, (saturn.scale.x+200)*5,200,-100);
    saturnMoon2 = createPlanet(40*2,20,32,0xC0C0C0, -(saturn.scale.x+200)*5,150,300);
    saturnMoon3 = createPlanet(40*2,20,32,0xC0C0C0, (saturn.scale.x+200)*5,-850,400);
    //Uranus
    uranus = createPlanet(51.1*7,20,32,getRandomColor(), (2870*20),0,0,  0, true);
    uranusContainer = createContainer();
    //Neptune
    neptune = createPlanet(49.5*8,20,32,getRandomColor(), (4496.9*20),0,0,  0, true);
    neptuneCon = createContainer();
    //Pluto
    pluto = createPlanet(23*20,20,32,getRandomColor(), (5906.4*20),0,0,  0, true);
    plutoContainer = createContainer();

    scalePlanets(5);
    // Adding all to scene
    scene.add(sunContainer);
    scene.add(mercuryContainer);
    scene.add(venusContainer);
    scene.add(earthContainer);
    scene.add(marsContainer);
    scene.add(jupiterContainer);
    scene.add(uranusContainer);
    scene.add(neptuneCon);
    scene.add(plutoContainer);
    scene.add(saturnContainer);

    // Containers
    sunContainer.add(sun);
    mercuryContainer.add(mercury);
    venusContainer.add(venus);
    earthContainer.add(earth);
    jupiterContainer.add(jupiter);
    marsContainer.add(mars);
    saturnContainer.add(saturn);
    uranusContainer.add(uranus);
    neptuneCon.add(neptune);
    plutoContainer.add(pluto);

    //Moons
    earth.add(earthMoon);
    jupiter.add(jupiterMoon1);
    jupiter.add(jupiterMoon2);
    jupiter.add(jupiterMoon3);
    jupiter.add(jupiterMoon4);
    jupiter.add(jupiterMoon5);

    //Moons and ring
    saturn.add(saturnRing);
    saturn.add(saturnMoon1);
    saturn.add(saturnMoon2);
    saturn.add(saturnMoon3);

   //Adding planets 
    planets.push(mercury);
    planets.push(venus);
    planets.push(earth);
    planets.push(mars);
    planets.push(jupiter);
    planets.push(pluto);
    planets.push(saturn);
    planets.push(uranus);
    planets.push(neptune);

}
function createPlanet(radius,widthSegments, heightSegments,color,xPosition, yPosition, zPosition,emissive, orbitLines){

    
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
      console.log(true);
        if(orbitLines==true)
        {
            scene.add( orbitLine );
            orbitLineArr.push(orbitLine);
        }
        
       
        

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

function setupDatgui() {
    //the object that is used by dat.GUI
        control = new function () {
            this.allowRotation = true;
            this.planetSize = 5;
            this.viewOrbitLines = true;
            this.rotationSpeedGlobal = 0.01;
            this.moonRotationSpeed = 0.01;
        
        }
        let gui = new dat.GUI();
        gui.add(control, "allowRotation").name('Allow Rotation:');
        gui.add(control, "viewOrbitLines").name('View Orbital Lines:')
        .onChange((e) => {showOrbitLines(e);});
        gui.add(control, "planetSize", 0.1, 2.5, 0.01).name('Planet Size: ')
                .onChange((e) => {scalePlanets(e);});
       
        gui.add(control, "rotationSpeedGlobal",0.01,0.10,0.01).name('Rotation Speed:')
                .onChange((e) => {rotationSpeed = e;})
       
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
    }
}

function getRandomColor(){
    return (0xffffff * Math.random());
  }
function rotatePlanets(){
    sun.rotation.y += rotationSpeed;
    mercury.rotation.y += rotationSpeed*0.09;
    venus.rotation.y += rotationSpeed*0.009;
    earth.rotation.y += rotationSpeed;
    saturn.rotation.y += rotationSpeed*2.2;
    uranus.rotation.y += rotationSpeed*1.6;
    neptune.rotation.y += rotationSpeed*1.8;
    pluto.rotation.y += rotationSpeed*0.19;
    mars.rotation.y += rotationSpeed;
    jupiter.rotation.y += rotationSpeed*2.0;
   

    sunContainer.rotation.y += rotationSpeed;
    mercuryContainer.rotation.y += rotationSpeed*4;
    venusContainer.rotation.y += rotationSpeed*3;
    saturnContainer.rotation.y += rotationSpeed*0.3;
    uranusContainer.rotation.y += rotationSpeed*0.2;
    neptuneCon.rotation.y += rotationSpeed*0.1;
    earthContainer.rotation.y += rotationSpeed;
    marsContainer.rotation.y += rotationSpeed*0.5;
    jupiterContainer.rotation.y += rotationSpeed*0.4;
    plutoContainer.rotation.y += rotationSpeed*0.08;

    
}

function render() {
       
        if(control.allowRotation == true){
            rotatePlanets();
        }
        if(control.viewOrbitLines == false){
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