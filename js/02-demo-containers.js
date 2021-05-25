//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 02-demo-using-dat-gui.js
//Date: January 27, 2021


//declare variable
let renderer, scene, camera, orbitalControl, box, sphere, control,speed =0.01;
let sphereColor = 0x00c4cf;
let boxColor = 0x259400;
let smallBox;
let creditsColor = 0x252525;
let backgroundColor = 0xd9dab0;
let planeColor = 0x493323;
//declare init

//initialize the three js environment
function init(){	
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(backgroundColor);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

//creates camera and lights
function setupCameraAndLight(){
	camera = new THREE.PerspectiveCamera(
		75, //fov
		window.innerWidth/window.innerHeight, //shape of screen
		0.1,	//near clipping plane
		100 	//far clipping plane
	);
	//camera.position.set(-10,13,10);
	camera.position.set(-30,40,30);
	camera.lookAt(scene.position);
	//scene.add(camera);
	
	orbitControl = new THREE.OrbitControls(camera,renderer.domElement);
    //add some ambient light
    scene.add (new THREE.AmbientLight(0x333333));

    //add some spot light
	let spotLight = new THREE.SpotLight(0xFFFFFF)
	spotLight.position.set(-10,20,-5);
	scene.add(spotLight);
}


//creates the geometry
    
function createGeometry(){
   //AxesHelper
	let axesHelper = new THREE.AxesHelper( 20 );
    scene.add( axesHelper );
    
	let planeGeometry = new THREE.PlaneBufferGeometry(
		60, //width
		20 //length
	);
	let planeMaterial = new THREE.MeshBasicMaterial({color: planeColor});
	plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x = -0.5 * Math.PI;
    //scene.add(plane);
    
    //creates a cube
    let geo = new THREE.BoxBufferGeometry(5,5,5);
    let mat = new THREE.MeshLambertMaterial({color: 0xcc5577});
    box = new THREE.Mesh(geo,mat);
    scene.add(box);

    let geo2 = new THREE.BoxBufferGeometry(2,2,2);
    let mat2 = new THREE.MeshLambertMaterial({color: 0xcc5577});
    smallBox = new THREE.Mesh(geo2,mat2);
    smallBox.position.set(5,0,0)
    scene.add(box);

    
}
function setupDatGui(){
    //creating the object that will encapsulate of the variables that we are interested in
    control = new function(){
        this.name = "Rohan";
        this.height = 0;
        this.speed =0.01;
        this.color='#784384';
        this.threatLevel = [];
    };
    let gui = new dat.GUI();

    
    gui.add(control, 'name');

    //creates a sub folder
    let rohan = gui.addFolder('Rohan is the  best');
    rohan.add(control, 'height').min(-8).max(10).step(0.25).name('height of cube');
    rohan.add(control, 'speed').min(0).max(0.2).step(0.01).name('speed of cube');
    var colorChange = rohan.addColor(control, 'color').onFinishChange((col)=> {alert(`Color of the object changed to: WWWWWWW`+ col);});
    colorChange.onChange( function( colorValue  )
    {
      //the return value by the chooser is like as: #ffff so
      //remove the # and replace by 0x
      colorValue=colorValue.replace( '#','0x' );
      //set the color in the object
      box.material.color.setHex(colorValue);
    });
    rohan.add(control, 'threatLevel', ['red','orange','blue','green', 'yellow']);
}

function render(){
    requestAnimationFrame(render);
    orbitControl.update();
    smallBox.rotation.y += control.speed;
    scene.rotation.y += control.speed;
    renderer.render(scene,camera)
}


//wireup this app after the dom is loaded
window.onload = (event) => {
	init();
	setupCameraAndLight();
    createGeometry();
    //setupDatGui();
	render();
  };
 