//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 01-template.js
//Date: January 22, 2021


//declare variable
let renderer, scene, camera, orbitalControl;
let sphereColor = 0x00c4cf;
let cubeColor = 0x259400;
let torusColor = 0x7600bf;
let ringColor = 0x611f00;
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
	camera.position.set(0,13,43)
	camera.lookAt(scene.position);
	scene.add(camera);
	
	orbitControl = new THREE.OrbitControls(camera,renderer.domElement);
	
	let pointLight = new THREE.PointLight(0xFFFFFF, 40, 60)
	pointLight.position.set(-2,20,0);
	scene.add(pointLight);
}

//creates the geometry
function createGeometry(){
	let geo = new THREE.PlaneBufferGeometry(
		70, //width
		70 //length
	);
	let mat = new THREE.MeshLambertMaterial({color: planeColor});
	let mesh = new THREE.Mesh(geo,mat);
	mesh.rotation.x = -0.5 * Math.PI;
	scene.add(mesh);

	//AxesHelper
	let axesHelper = new THREE.AxesHelper( 100 );
	scene.add( axesHelper );

	//Sphere
	let sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 ); //width, widthSegments, HeightSehments
	let sphereMaterial = new THREE.MeshBasicMaterial( {color: sphereColor} );
	let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	sphere.position.set(15,5,0);
	scene.add( sphere );

	//cube 
	let cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 ); // width,  height, depth
	let cubeMaterial = new THREE.MeshBasicMaterial( {color: cubeColor} );
	let cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	cube.position.set(-15,2,0);
	scene.add( cube );

	//torusknot
	let torusGeometry = new THREE.TorusKnotGeometry( 7, 0.5, 100, 16 ); //radius, tube, tubularSegments, radialSegments, 
	let torusMaterial = new THREE.MeshBasicMaterial( { color: torusColor } );
	let torusKnot = new THREE.Mesh( torusGeometry, torusMaterial );
	torusKnot.position.set(0,10,-15);
	scene.add( torusKnot );

	//ringGeometry
	const ringGeometry = new THREE.RingGeometry( 1, 5, 10 ); //innterRadius, //outerRadius, ThetaSegments
	const ringMaterial = new THREE.MeshBasicMaterial( { color: ringColor, side: THREE.DoubleSide } );
	const ringMesh = new THREE.Mesh( ringGeometry, ringMaterial);
	ringMesh.position.set(0,5,15);
	scene.add( ringMesh );

	//textGeometry for all shapes
	var loader = new THREE.FontLoader();
	loader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
	
		var textSphere = new THREE.TextGeometry( "Sphere", {
			font: font,	
			size: 2,
			height: 1,
			curveSegments: 12,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: true
		} );
		var textTorus = new THREE.TextGeometry( "TorusKnot", {
			font: font,	
			size: 2,
			height: 1,
			curveSegments: 12,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: true
		} );
		var textCube = new THREE.TextGeometry( "Cube", {
			font: font,	
			size: 2,
			height: 1,
			curveSegments: 12,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: true
		} );
		var textRing = new THREE.TextGeometry( "Ring", {
			font: font,	
			size: 2,
			height: 1,
			curveSegments: 12,
			bevelThickness: 0.5,
			bevelSize: 0,
			bevelEnabled: false

		} );

		var textCredits = new THREE.TextGeometry("Created by: Rohan Juneja", {
			font: font,
			size: 3,
			height:1,
			curveSegments: 12,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: true

		})
		var textMaterialSphere = new THREE.MeshBasicMaterial( { color: sphereColor } );
		var textMaterialTorus = new THREE.MeshBasicMaterial( { color: torusColor } );
		var textMaterialCube = new THREE.MeshBasicMaterial( { color: cubeColor } );
		var textMaterialRing = new THREE.MeshBasicMaterial( { color: ringColor } );
		var textRohanJuneja = new THREE.MeshMatcapMaterial( { color: creditsColor } );
		
		var meshSphere = new THREE.Mesh( textSphere, textMaterialSphere );
		meshSphere.position.set( 11.2,11,0 );

		var meshTorus = new THREE.Mesh( textTorus, textMaterialTorus );
		meshTorus.position.set( -6,20,-15 );

		var meshCube = new THREE.Mesh( textCube, textMaterialCube );
		meshCube.position.set( -18,5,0 );

		var meshRing = new THREE.Mesh( textRing, textMaterialRing );
		meshRing.position.set( -3,11,15 );

		var meshRohan = new THREE.Mesh( textCredits, textRohanJuneja );
		meshRohan.position.set( -24,1,28 );
		
		scene.add( meshSphere );
		scene.add( meshTorus );
		scene.add( meshRing );
		scene.add( meshCube );
		scene.add(meshRohan);
	} );


}

//to render the three js scene
function render(){
	requestAnimationFrame(render);
	orbitControl.update();
	renderer.render (scene, camera);
}

//wireup this app after the dom is loaded
window.onload = (event) => {
	init();
	setupCameraAndLight();
	createGeometry();
	render();
  };
 