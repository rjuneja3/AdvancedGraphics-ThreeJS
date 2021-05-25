//author:Narendra Pershad
//filename: 07-demo-voxel-painter.js
//date: February 26, 2021

const views = [
    {
        left: 0,
        bottom: 0,
        width :0.5,
        height: 1.0,
        background : new THREE.Color(0x8080bb),
        eye : [0,20,20],
        up:[0,1,0],
        fov:45
    },
    {
        left: 0.5,
        bottom: 0,
        width :0.5,
        height: 0.5,
        background : new THREE.Color(0x80bb80),
        eye : [0,20,20],
        up:[0,1,0],
        fov:60
    },
    {
        left: 0.5,
        bottom: 0.5,
        width :0.5,
        height: 0.5,
        background : new THREE.Color(0xbb8080),
        eye : [20,10,20],
        up:[0,1,0],
        fov:75
    }
];

let renderer, scene;
let pointLight, spotLight;
let windowWidth, windowHeight;

function init(){
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( 0x227700 );
    renderer.shadowMap.enabled = true;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize( windowWidth, windowHeight );
    document.body.appendChild( renderer.domElement );

    for (let i=0; i<views.length; i++){
        const view = views[i];
        const camera = new THREE.PerspectiveCamera(view.fov, windowWidth/windowHeight,1,1000 );
        camera.up.fromArray(view.up);
        camera.position.fromArray(view.eye);
        view.camera=camera; // adвы a new property to the view
        view.orbitConrtol = new THREE.OrbitControls(camera, renderer.domElement ); // adвы a new property to the view
    }
}

function setupCameraAndLight(){
    scene.add(new THREE.AmbientLight( 0x222222 , 0.3));

    pointLight = new THREE.PointLight( 0x77ffff, 2, 50 );
    pointLight.position.set( -5, 5, -5 );
    pointLight.castShadow = true;
    scene.add( pointLight );

    spotLight = new THREE.SpotLight( 0xffaaff );
    spotLight.position.set( 5, 10, -5 );
    spotLight.castShadow=true;
    scene.add( spotLight );

    let directionalLight = new THREE.DirectionalLight( 0xffaa77, 0.5 );
    directionalLight.position.set( 0, 10, 3 );
    directionalLight.castShadow=true;
    scene.add( directionalLight );
}

function createGeometry(){
    scene.add( new THREE.AxesHelper( 20) );
    // create the ground plane
    let geo = new THREE.PlaneBufferGeometry(20, 20);
    let mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let mesh = new THREE.Mesh( geo, mat );
      mesh.rotation.x=-0.5 * Math.PI;
      mesh.receiveShadow=true;
    scene.add(mesh);

    //box
     geo2 = new THREE.BoxBufferGeometry(4,2,10);
     mat2 = new THREE.MeshLambertMaterial({ color: 0xee77888, transparent:true, opacity:0.7 });
     mesh2 = new THREE.Mesh( geo2, mat2 );
     mesh2.receiveShadow=true;
     mesh2.position.set(0,1,0);
    scene.add(mesh2);

    //egg
    geo3 = new THREE.SphereBufferGeometry(1,32,32);
    mat3 = new THREE.MeshLambertMaterial({ color: 0x55ee77, transparent:true, opacity:0.7 });
    mesh3 = new THREE.Mesh( geo3, mat3 );
    mesh3.rotation.x=-0.5 * Math.PI;
    mesh3.receiveShadow=true;
    mesh3.position.set(0,3,0);
    mesh3.scale.set(2,1,1);
   scene.add(mesh3);
}

function render(){
    requestAnimationFrame( render );    
    for (let i=0; i<views.length; i++){
        const view=views[i];
        const camera=view.camera;
        const left=Math.floor(windowWidth*view.left);
        const bottom=Math.floor(windowHeight*view.bottom);
        const width=Math.floor(windowWidth*view.width);
        const height=Math.floor(windowHeight*view.height);

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);
        renderer.setScissorTest(true);

        renderer.setClearColor(view.background);
        camera.aspect=width/height;
        camera.updateProjectionMatrix();
        renderer.render(scene,camera);
        view.orbitConrtol.update();

    }

}

window.onload = () => {
    init();
    setupCameraAndLight();
    createGeometry();
    render();
}