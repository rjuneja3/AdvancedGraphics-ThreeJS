//Author: Rohan Juneja
//Author website: https://www.rohanjuneja.com
//File Name: 02-rohan.js
// Feb 01, 2021

//declare recurrent global variables
let scene, camera, renderer;
//declare global variables
let sphere, control, plane;

function init() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0x493323));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set( -30, 40 , 30 );

  // add the orbit control
  control =  new THREE.OrbitControls( camera, renderer.domElement);

  // add subtle ambient lighting
  scene.add( new THREE.AmbientLight({ color: 0x353535 }));

  //spotlight to see shading
  let spotlight = new THREE.SpotLight({ color: 0xffffff });
  spotlight.position.set( -10, 20, -5 );
  scene.add( spotlight );
}

function createGeometry() {
  // create the axws helper
  scene.add(new THREE.AxesHelper(20));
  // create the ground plane
  let geo = new THREE.PlaneBufferGeometry(60, 30);
  let mat = new THREE. MeshLambertMaterial ({ color: 0xffdf91 });
  plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -0.5 * Math.PI;
  scene.add(plane);

  // create the sphere plane
  geo = new THREE.SphereGeometry( 2, 24, 24 );
  mat = new THREE.MeshLambertMaterial({ color: 0x6666ff, wireframe: true });
  sphere = new THREE.Mesh(geo, mat);
  sphere.position.set( 20, 4, 2 );
  scene.add(sphere);
}

function setupDatGui(){
    //creating the object that will encapsulate of the variables that we are interested in
    control = new function(){
        this.name = "Lab 02 Rohan";
        this.size = 2;
        this.shapes =[];
        this.color='#784384';
        this.createObject = function(){
          createObject(this.shapes,this.size, this.color)
       };

        this.showVariables = function(){
          console.log(`Size of created object: ${this.size}`);
          console.log(`Shape of created object: ${this.shapes}`);
          console.log(`Color of created object: ${this.color}`);
      };
    }

    let gui = new dat.GUI();
    gui.add(control, 'name');
    gui.add(control, 'shapes', ['sphere','cube','cylinder']).name("Shape");
    //creates a sub folder
    let addGeometryFolder = gui.addFolder('Geometry Variables:');
    addGeometryFolder.add(control, 'size').min(2).max(6).step(1).name('Size: '); //Cotnrols the size of the added geometry shape, minimum 2, maximum 6, step 1
    addGeometryFolder.addColor(control, 'color').name('Color');

    /** var colorChange = rohan.addColor(control, 'color').onFinishChange((col)=> {alert(`Color of the object changed to: WWWWWWW`+ col);});
    colorChange.onChange( function( colorValue  )
    {
      //the return value by the chooser is like as: #ffff so
      //remove the # and replace by 0x
      colorValue=colorValue.replace( '#','0x' );
      //set the color in the object
      box.material.color.setHex(colorValue);
    }); */
    
    //buttons on GUI

    gui.add(control, 'createObject').name('Add Geometry'); 
    gui.add(control, 'showVariables').name('Show Variables'); 
}


//create object code
function createObject(shape, size, color){
    if(shape == "sphere"){
        console.log("Sphere created");
        let geometry = new THREE.SphereGeometry( size/2, 32, 32 );
        let material = new THREE.MeshLambertMaterial( {color: color} );
        let sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(plane.geometry.parameters.width * (0.5 - Math.random()), size/2, plane.geometry.parameters.height * (0.5 - Math.random()));
        scene.add( sphere );
        
    }
    else if(shape == "cube"){
        console.log("Cube created");
        let geometry = new THREE.BoxGeometry( size, size, size );
        let material = new THREE.MeshLambertMaterial( {color: color} );
        let cube = new THREE.Mesh( geometry, material );
        cube.position.set(plane.geometry.parameters.width * (0.5 - Math.random()), size/2, plane.geometry.parameters.height * (0.5 - Math.random()));
        scene.add( cube );

    }

    else if(shape=="cylinder"){
      console.log("Cylinder created");
      let geometry = new THREE.CylinderGeometry( size, size, 20, 32 );
      let material = new THREE.MeshBasicMaterial( {color: color} );
      let cylinder = new THREE.Mesh( geometry, material );
      cylinder.position.set(plane.geometry.parameters.width * (0.5 - Math.random()), size/2, plane.geometry.parameters.height * (0.5 - Math.random()));
      scene.add( cylinder );
    }
   

}
function render() {
  requestAnimationFrame(render);
  control.update();
  renderer.render(scene, camera);
 
}
//javascript function to drive your scene
window.onload = (event) => {
  init();
  setupDatGui();
  createCameraAndLights();
  createGeometry();
  render();
}
