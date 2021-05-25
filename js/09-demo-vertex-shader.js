//author: Narendra Pershad March 30, 2020
//filename: 11-vretex-shader.js
//purpose: a useful base for threejs applications

let renderer, scene, camera;

const clock = new THREE.Clock();
const __shader = Shaders.BasicShader9B1;
// const __shader = Shaders.CustomBitShader;

let orbitControls, controls, shaderMaterial;

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x004400);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);
    scene.position.set(0, -10, 0);

}

function setupCameraAndLight() {

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(-30, 10, 30);
    camera.lookAt(scene.position);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    scene.add(new THREE.AmbientLight(0x666666));

  	light = new THREE.DirectionalLight(0xeeeeee);
    light.position.set(20, 60, 10);
    light.castShadow = true;
    light.target = scene;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 200;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    let hemiSphereLight = new THREE.HemisphereLight(0x7777cc, 0x00ff00, 0.6);//skycolor, groundcolor, intensity
    hemiSphereLight.position.set(0, 100, 0);
    scene.add(hemiSphereLight);
}

function createGeometry() {

    scene.add(new THREE.AxesHelper(100));
    
    // let plane = new THREE.Mesh(
    //     new THREE.PlaneGeometry(60, 40, 50, 50),
    //     new THREE.MeshStandardMaterial({color: 0xeeeeee})
    // );
    // plane.receiveShadow = true;
    // plane.rotation.x = -Math.PI * 0.5;
    // scene.add(plane);

    shaderMaterial = new THREE.ShaderMaterial(
        {
            uniforms: __shader.uniforms,
            vertexShader: __shader.vertexShader,
            fragmentShader: __shader.fragmentShader,
            transparent: true,
            // wireframe: true
        }
    );


    let plane = new THREE.Mesh(

        new THREE.PlaneGeometry(60, 40, 256, 256), shaderMaterial
        // new THREE.PlaneGeometry(60, 40), shaderMaterial
        // new THREE.MeshStandardMaterial({color: 0xeeeeee})
    );
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);


    let box = new THREE.Mesh(
        new THREE.BoxBufferGeometry(10, 10, 10, 128, 128),
        shaderMaterial
    );
    box.position.set(10, 10, 10);
    box.rotation.set(Math.PI * 0.6, 0, Math.PI * 0.3);
    box.castShadow = true;
    scene.add(box);

    // __shader.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/general/stone-bump.jpg');
    __shader.uniforms.textureB.value = new THREE.TextureLoader().load('../assets/textures/general/stone.jpg');
	// __shader.uniforms.textureB.value = new THREE.TextureLoader().load('assets/textures/alpha/partial-transparency.png');
    __shader.uniforms.textureA.value = new THREE.TextureLoader().load('../assets/textures/general/lava.png');
  

    let ball = new THREE.Mesh( new THREE.SphereBufferGeometry( 3, 128, 128 ), shaderMaterial );
    ball.position.set(-10,10,-10);
    ball.castShadow = true;
    scene.add( ball );
    
    console.log(`Using : ${__shader.name}`);

}

function setupDatGui() {

    controls = new function() {

        this.speed = 0.00;

    }

    let gui = new dat.GUI();
    gui.add(controls, 'speed', -0.05, 0.05, 0.01).onChange((e) => speed = e);

}

function render() {

    requestAnimationFrame(render);
    scene.rotation.y += controls.speed;                           //rotates the scene
    // __shader.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);

}

window.onload = () => {

    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();

}
