//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 08-rohan.js
// March14, 2021

let scene;
let renderer;
let camera;
let controls;
let axesHelper;

let spotLight, hemisphereLight, directionalLight;
let directionalLightColor = 0x404040;
let spotLightColor = 0x404040;
let hemisphereLightSkyColor = 0x302200;
let hemisphereLightGroundColor = 0xffffff;

let control;
let cubeTexture,alpha, normal, shiny, honeyComb;
let skyboxLoader;
let planeMat, materialTransparent, materialTextured, mat_reflective;
let planeGeo, geometrysphereTransparent, shinySphereGeo,reflectiveCubeGeo,glassCubeGeo;
let plane,sphereTransparent,shinySphere,reflectiveCube,glassCube;

let sceneAngle = 0;


function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x00ff00);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
    camera = new THREE.PerspectiveCamera(
        60,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        1000                                         //far point
    );
    camera.position.set(0, 40, 80);
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    spotLight = new THREE.SpotLight(spotLightColor, 4.0);
    spotLight.position.set(0, 40, 0);
    spotLight.receiveShadow = true;
    spotLight.castShadow = true;
    spotLight.visible = false;
    scene.add(spotLight);

    directionalLight = new THREE.DirectionalLight(directionalLightColor, 1.0);
    directionalLight.position.set(0, 45, 0);
    directionalLight.receiveShadow = true;
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    hemisphereLight = new THREE.HemisphereLight(hemisphereLightSkyColor, hemisphereLightGroundColor, 1);
    hemisphereLight.position.set(0,100,0);
    scene.add(hemisphereLight);
}

function loadTextures(){
    alpha = new THREE.TextureLoader().load( 'assets/textures/transparency.png' );
    normal = new THREE.TextureLoader().load( 'assets/textures/rohan1.jpg' );
    shiny = new THREE.TextureLoader().load( 'assets/textures/rohan2.jpg' );
    honeyComb = new THREE.TextureLoader().load( 'assets/textures/rohan3.png' );
}

function skyBoxFunction(){
    skyboxLoader = new THREE.CubeTextureLoader().setPath( 'assets/textures/' );
   
    let urls = [
        'rohan_ft.png', //left
        'rohan_bk.png', //right
        'rohan_up.png', //top
        'rohan_dn.png', //bottom
        'rohan_rt.png', //back
        'rohan_lf.png' //front
    ];
    //Glass cube's images
    let urls2= [
        'rohan_bk.png',
        'rohan_ft.png',
        'rohan_dn.png',
        'rohan_up.png',
        'rohan_lf.png',
        'rohan_rt.png'
    ];
    cubeTexture = skyboxLoader.load(urls);
    cubeTexture2 = skyboxLoader.load(urls2);

    scene.background = cubeTexture;
}

function createGeometry() {

    planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    planeGeo = new THREE.PlaneGeometry(100, 100);
    plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    //transparent sphere 1
    materialTransparent = new THREE.MeshStandardMaterial({ alphaMap: alpha, alphaTest: 0.5});
    geometrysphereTransparent = new THREE.SphereGeometry(10,32,32);
    sphereTransparent = new THREE.Mesh(geometrysphereTransparent, materialTransparent);
    sphereTransparent.position.set(25,15,-20);
    sphereTransparent.castShadow = true;
    scene.add(sphereTransparent);

    //transparent sphere 2
    materialTransparent = new THREE.MeshStandardMaterial({ alphaMap: honeyComb, alphaTest: 0.1});
    geometrysphereTransparent = new THREE.SphereGeometry(10,32,32);
    sphereTransparent = new THREE.Mesh(geometrysphereTransparent, materialTransparent);
    sphereTransparent.position.set(0,15,-20);
    sphereTransparent.castShadow = true;
    scene.add(sphereTransparent);

        //transparent sphere 3
    materialTransparent = new THREE.MeshStandardMaterial({ alphaMap: alpha, alphaTest: 0.5});
    geometrysphereTransparent = new THREE.SphereGeometry(10,32,32);
    sphereTransparent = new THREE.Mesh(geometrysphereTransparent, materialTransparent);
    sphereTransparent.position.set(-25,15,-20);
    sphereTransparent.castShadow = true;
    scene.add(sphereTransparent);

      //transparent sphere 4
    materialTextured = new THREE.MeshPhongMaterial({ envMap: cubeTexture, normalMap: normal});
    materialTextured.shininessMap = shiny;
    shinySphereGeo = new THREE.SphereBufferGeometry(10,32,32);
    shinySphere = new THREE.Mesh(shinySphereGeo, materialTextured);
    shinySphere.position.set(0,15,35);
    shinySphere.castShadow = true;
    scene.add(shinySphere);

   
 //transparent cube 4
    mat_reflective = new THREE.MeshStandardMaterial({ envMap: cubeTexture, metalness: 1, roughness: 0});
    reflectiveCubeGeo = new THREE.CubeGeometry(10,10,10);
    reflectiveCube = new THREE.Mesh(reflectiveCubeGeo, mat_reflective);
    reflectiveCube.position.set(10,15,5);
    reflectiveCube.castShadow = true;
    scene.add(reflectiveCube);

    

 //transparent cube 4
    mat_reflective = new THREE.MeshPhongMaterial({ envMap: cubeTexture2, refractionRatio: 0.95, reflectivity: 0.8 });
    mat_reflective.mapping = THREE.CubeRefractionMapping;
    glassCubeGeo = new THREE.BoxBufferGeometry(10,10,10);
    glassCube = new THREE.Mesh(glassCubeGeo, mat_reflective);
    glassCube.position.set(-10,15,5);
    glassCube.castShadow = true;
    scene.add(glassCube);
}


function setupDatgui() {
    control = new function () {
        this.ToggleSceneRotation = false;
        this.SpotLight = false;
        this.spotIntensity = spotLight.intensity; 
        this.spotColor = spotLightColor;

        this.DirectionalLight = true;
        this.directionalIntensity = directionalLight.intensity; 
        this.directionalColor = directionalLightColor;

        this.HemisphereLight = true;

    }
    let gui = new dat.GUI();
    gui.add(control, "ToggleSceneRotation");
    let folderSpotLight = gui.addFolder("Spot Light");
    folderSpotLight.add(control, "SpotLight").onChange((e) => {
        spotLight.visible = e;
    })
    folderSpotLight.addColor(control, 'spotColor').name('Color: ')
    .onChange(function() {spotLight.color.set(control.spotColor)});
    folderSpotLight.add(control, 'spotIntensity').min(0).max(2).step(0.01).name('Intensity: ')
    .onChange(function() {spotLight.intensity = control.spotIntensity});

    

    let folderDirectionalLight = gui.addFolder("Directional Light");
    folderDirectionalLight.add(control, "DirectionalLight").onChange((e) => {
        directionalLight.visible = e;
    })
    folderDirectionalLight.addColor(control, 'directionalColor').name('Color: ')
            .onChange(function() {directionalLight.color.set(control.directionalColor)});
    folderDirectionalLight.add(control, 'directionalIntensity').min(0).max(2).step(0.01).name('Intensity')
            .onChange(function() {directionalLight.intensity = control.directionalIntensity});

}

function render() {
    controls.update();
    if (control.ToggleSceneRotation) {
        scene.rotation.y = sceneAngle += 0.02;
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.loadTextures();
    this.skyBoxFunction();
    this.createGeometry();
    this.setupDatgui();
    this.render();
}