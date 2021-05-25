//author: Rohan Juneja
//filename: 09-rohan.js
//purpose: a useful base for threejs applications
let Shaders = {}
Shaders.BasicShader9B0 = {

	name: 'BasicShader9B0', //for debugging
   
	uniforms: {

		'time': { type: 'f', value: 0.0 }

	},
	
	vertexShader:
        `varying vec2 vUv;
        uniform float time;
        uniform sampler2D textureA;
        void main() {
            vUv = uv;
            vec4 color = texture2D(textureA, vUv);
            vec3 pos = position;
           
            pos.z += abs(sin(color.r *10.0+time*2.0));
            pos.x += sin( position.z );
            pos.z += sin( position.y );
            
            pos.y += tan(color.r *2.0+2.0);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,


	fragmentShader:

	`varying vec2 vUv;

	// vec3 color = vec3(1.0, 1.0, 0.0);         //local variable red

	void main() {

		gl_FragColor = vec4( vec3(vUv, 1.0),  1.0 );    //alpha is 0.75

	}`
};

Shaders.BasicShader9B1 = {

	name: 'BasicShader9B1', //for debugging

	uniforms: {

		'time': { type: 'f', value: 0.0 },
		'textureA' : {value:null},
		'textureB' : {value:null},
        
		

	},
	
	vertexShader: 
	
	`uniform float time;

	uniform sampler2D textureA;
	uniform sampler2D textureB;

	varying vec2  vUv;

	void main() {

		vec3 pos = position;

		vUv = uv;
		
       	//molten lava effect
		vec4 color = texture2D(textureA, uv*time);

		pos.z +=color.r;


		gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

	}`,


	fragmentShader:

	`
	uniform sampler2D textureB;
	varying vec2 vUv;

	// vec3 color = vec3(1.0, 1.0, 0.0);         //local variable red

	void main() {

		//gl_FragColor = vec4( vec3(vUv, 1.0),  1.0 );    //alpha is 0.75
		gl_FragColor = texture2D(textureB, vUv);  //alpha is 0.75

	}`
};


//author: Narendra Pershad March 30, 2020
//filename: 11-vretex-shader.js
//purpose: a useful base for threejs applications

let renderer, scene, camera;

const clock = new THREE.Clock();
const __shader = Shaders.BasicShader9B1;
const __shader2 = Shaders.BasicShader9B0;
// const __shader = Shaders.CustomBitShader;
let light;
let orbitControls, controls, shaderMaterial,shaderMaterial2;

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
            wireframe: false
        }
    );

    shaderMaterial2 = new THREE.ShaderMaterial(
        {
            uniforms: __shader2.uniforms,
            vertexShader: __shader2.vertexShader,
            fragmentShader: __shader2.fragmentShader,
            transparent: true,
            wireframe: true
        }
    );



    let plane = new THREE.Mesh(

        new THREE.PlaneGeometry(100, 70, 256, 256), shaderMaterial
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

    let torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(5, 2, 50, 16),
        shaderMaterial2
    );
    torusKnot.position.set(-20, 10, 10);
    torusKnot.rotation.set(Math.PI * 0.6, 0, Math.PI * 0.3);
    torusKnot.castShadow = true;
    scene.add(torusKnot);

    let box2 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(10, 10, 10, 128, 128),
        shaderMaterial2
    );
    box2.position.set(10, 10, -10);
    box2.rotation.set(Math.PI * 0.6, 0, Math.PI * 0.3);
    box2.castShadow = true;
    scene.add(box2);

    // __shader.uniforms.textureA.value = new THREE.TextureLoader().load('assets/textures/general/stone-bump.jpg');
    __shader.uniforms.textureB.value = new THREE.TextureLoader().load('../assets/textures/general/lava.png');
    //__shader2.uniforms.textureA.value = new THREE.TextureLoader().load('../assets/textures/general/floor-wood.jpg');
	// __shader.uniforms.textureB.value = new THREE.TextureLoader().load('assets/textures/alpha/partial-transparency.png');
    __shader.uniforms.textureA.value = new THREE.TextureLoader().load('../assets/textures/general/lava.png');
    //__shader2.uniforms.textureB.value = new THREE.TextureLoader().load('../assets/textures/general/lava.png');
  

    let ball = new THREE.Mesh( new THREE.SphereBufferGeometry( 3, 128, 128 ), shaderMaterial );
    ball.position.set(-10,10,-10);
    ball.castShadow = true;
    scene.add( ball );
    
    console.log(`Using : ${__shader.name}`);

}

function setupDatGui() {

    controls = new function() {

        this.speed = 0.00;
        this.shaderWireframe = false;
        this.shaderWireframe2 = true;
        this.shaderTransparency = false;
        this.shaderTransparency2 = false;
     
        this.checkBoxDirectional = true;
        this.directionalIntensity = light.intensity; 
        this.directionalColor = '#ffffff';

    }

    let gui = new dat.GUI();
    gui.add(controls, 'speed', -0.05, 0.05, 0.01).onChange((e) => speed = e);
    
    
    // Subfolder for Directional Light
    let folderDirectionalLight = gui.addFolder("Directional Light");
    folderDirectionalLight.add(controls, "checkBoxDirectional").name('Visibility: ')
            .onChange((e) =>{light.visible = e;});
    folderDirectionalLight.addColor(controls, 'directionalColor').name('Color: ')
            .onChange(function() {light.color.set(controls.directionalColor)});
    folderDirectionalLight.add(controls, 'directionalIntensity').min(0).max(2).step(0.01).name('Intensity')
            .onChange(function() {light.intensity = controls.directionalIntensity});

    let shaderMaterial1Folder = gui.addFolder("Shader 1 Properties");
    shaderMaterial1Folder.add(controls, "shaderWireframe")
    .onChange((w) => {shaderMaterial.wireframe = w;});
    shaderMaterial1Folder.add(controls, "shaderTransparency")
    .onChange((w) => {shaderMaterial.transparent = w;});


    let shaderMaterial2Folder =  gui.addFolder("Shader 2 Properties");
    shaderMaterial2Folder.add(controls, "shaderWireframe2")
    .onChange((w) => {shaderMaterial2.wireframe = w;});
    shaderMaterial2Folder.add(controls, "shaderTransparency2")
    .onChange((w) => {shaderMaterial.transparent = w;});

}

function render() {

    requestAnimationFrame(render);
    scene.rotation.y += controls.speed;                           //rotates the scene
     __shader.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);

}

window.onload = () => {

    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();

}
