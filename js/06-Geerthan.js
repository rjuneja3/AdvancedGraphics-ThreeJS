let scene, camera, renderer;
let control, plane;

const container = new THREE.Object3D();

const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 1;
const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
const directLight = new THREE.DirectionalLight({ color: skyColor });
let ferryWheelsContainer, wheelContainer, spokesContainer, rightCasketContainer, leftCasketContainer, casketContainer;
let wheelToggle = 0.001, sceneToggle = 0.001, basketsArray = [];

function init() 
{
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(new THREE.Color(0xaaffaa));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() 
{
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.set( -30, 40 , 30 );

  // add the orbit control
  control =  new THREE.OrbitControls( camera, renderer.domElement);

  // add subtle ambient lighting
  //scene.add( new THREE.AmbientLight({ color: 0x353535 }));

  directLight.position.set(0, 20, 0);
  hemiLight.position.set(0, 20, 0);
  scene.add(directLight);
  scene.add(hemiLight);

  //spotlight to see shading
  //let spotlight = new THREE.SpotLight({ color: 0xffffff });
  //spotlight.position.set( -10, 20, -5 );
  //scene.add( spotlight );
}

function setupDateGui()
{   
	control = new function()
  {
    this.numberOfSpokes = 0;
    this.wheelSize = 5;
    this.wheelWidth = 5;
    this.wheelThickness = 0.1;
    this.spokeLength = 10;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.wheelToggle = false;
    this.sceneToggle = false;
	};

  let functions = { createWheel: function()
    {
      Rim(control.numberOfSpokes, control.wheelSize, control.wheelWidth, control.wheelThickness, control.spokeLength, 
        control.x, control.y, control.z);
    }
  };

	let gui = new dat.GUI();
  gui.add(control, 'numberOfSpokes', 0, 12, 1).name('Number of Spokes');
  gui.add(control, 'wheelSize', 5, 15, 1).name('Outer Radius');
  gui.add(control, 'wheelWidth', 5, 15, 0.5).name('Inner Radius');
  gui.add(control, 'wheelThickness', 0.1, 1, 0.1).name('Wheel Thickness');
  gui.add(control, 'spokeLength', 10, 20, 1).name('Spoke Length');
  gui.add(control, 'x', -10, 10, 1).name('X Position');
  gui.add(control, 'y', -10, 10, 1).name('Y Position');
  gui.add(control, 'z', -10, 10, 1).name('Z Position');
  gui.add(functions, 'createWheel').name("Create Wheel");
  gui.add(control, 'wheelToggle');
  gui.add(control, 'sceneToggle');
}

function Rim(numberOfSpokes, outerRadius, innerRadius, size, spokeLength, xPosition, yPosition, zPosition)
{
  let absellipse = new THREE.Shape();
  absellipse.absellipse(0, 0, outerRadius, outerRadius);

  let absellipseHole = new THREE.Shape();
  absellipseHole.absellipse(0, 0, innerRadius, innerRadius)
  absellipse.holes.push(absellipseHole);

  let extrudeSettings = {
      steps: 16,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: size,
      bevelSize: 0.5,
      bevelOffset: 0,
      bevelSegments: 15
  };

  //create the ExtrudeGeometry for the left and right wheel
  geo = new THREE.ExtrudeGeometry(absellipse, extrudeSettings);
  mat = new THREE.MeshLambertMaterial({ color: 0x2b2b28 });
  let leftWheel = new THREE.Mesh(geo, mat);
  leftWheel.position.z -= 5;
  leftWheel.castShadow = true;
  leftWheel.receiveShadow = true;

  let rightWheel = new THREE.Mesh(geo, mat);
  rightWheel.rotation.x = -Math.PI;
  rightWheel.rotation.z = Math.PI;
  rightWheel.rotation.y = Math.PI;
  rightWheel.position.z += 5;
  rightWheel.castShadow = true;
  rightWheel.receiveShadow = true;
  
  //create the cylinder for the wheel
  geo = new THREE.CylinderGeometry( 2, 2, 12, 32 );
  geo.translate(0,0.5,0);
  mat = new THREE.MeshLambertMaterial({ color: 0x8a794e });
  let axle = new THREE.Mesh(geo, mat);
  axle.position.set(0,0,0);
  axle.rotation.x= Math.PI/2;
  wheelContainer.add(axle);

  //Rotate the spokes
  let multiplier = 1;
  for(let i = 0; i<numberOfSpokes; i++)
  {
    leftWheel.add(Spokes(Math.PI*multiplier, size, spokeLength, xPosition, yPosition, zPosition, true));
    rightWheel.add(Spokes(Math.PI*multiplier, size, spokeLength, xPosition, yPosition, zPosition, false));
    //casketContainer.add(Baskets(Math.PI*multiplier, size, spokeLength, xPosition, yPosition, zPosition));
    multiplier -= 0.166666;
  }

  wheelContainer.add(leftWheel);
  //leftWheel.add(leftCasketContainer);
  wheelContainer.add(rightWheel);
  //rightWheel.add(rightCasketContainer);
  wheelContainer.position.set(xPosition, yPosition, zPosition);
}

function Baskets(rotationAngle, size, height, xPosition, yPosition, zPosition)
{
  geometry = new THREE.BoxGeometry( 0.25, 10, 0.25, 32,32,32 );
  //geometry.translate(-height/2,0,-2);
  material = new THREE.MeshNormalMaterial({ color: 0xffffff });
  basket = new THREE.Mesh( geometry, material );
  basket.position.set(0, height - height/10, 3.5)
  //basket.position.set(-height/2, 0, -2)
  basket.rotation.x = Math.PI*0.5;
  basket.rotation.y = -rotationAngle;
  basket.position.z += 2;
  basket.castShadow = true;
  basket.receiveShadow = true;
  //spokesContainer.add(spoke);
  //spoke.add(basket);

  geometry = new THREE.BoxGeometry( 0.25, 2, 0.25, 32,32,32 );
  material = new THREE.MeshNormalMaterial();
  holderSpoke = new THREE.Mesh( geometry, material );
  holderSpoke.position.set(0, 0, 1)
  holderSpoke.rotation.x += Math.PI/2;
  holderSpoke.castShadow = true;
  holderSpoke.receiveShadow = true;
  basket.add(holderSpoke);
  //container.add(cylinder);

  geometry = new THREE.SphereGeometry(1,32,32,0,Math.PI*2,0,2)
  material = new THREE.MeshLambertMaterial({color: 0xd674cc});
  casket = new THREE.Mesh(geometry, material);
  casket.position.set(0,0.5,0);
  //casket.rotation.x = -Math.PI;
  casket.castShadow = true;
  casket.receiveShadow = true;
  holderSpoke.add(casket);

  basketsArray.push(basket);
  //casketContainer.add(basket);
  return basket;
}

function Spokes(rotationAngle, size, height, xPosition, yPosition, zPosition, basket)
{
  //var geometry = new THREE.CylinderGeometry( size, size, height * 2, 32 );
  var geometry = new THREE.BoxGeometry(1, height, 1);
  geometry.translate(0,height/2,0.5);
  var material = new THREE.MeshLambertMaterial({ color: 0x6e530e });
  var spoke = new THREE.Mesh( geometry, material );
  spoke.position.set(0,0,0)
  spoke.rotation.z = rotationAngle;

  if(basket == true) 
    spoke.add(Baskets(rotationAngle, size, height, xPosition, yPosition, zPosition));
  
  //spokesContainer.add(spoke);
  return spoke;
}

function createGeometry() 
{
  scene.add(new THREE.AxesHelper(20));

  let geo = new THREE.PlaneBufferGeometry(60, 20);
  let mat = new THREE. MeshLambertMaterial ({ color: 0xcccccc });
  plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -0.5 * Math.PI;
  scene.add(plane);

  ferryWheelsContainer = new THREE.Object3D();
  ferryWheelsContainer.position.set(0, 0, 0);
  container.add(ferryWheelsContainer);

  wheelContainer = new THREE.Object3D();
  wheelContainer.position.set(0, 0, 0);
  ferryWheelsContainer.add(wheelContainer);

  leftCasketContainer = new THREE.Object3D();
  leftCasketContainer.position.set(0, 0, 0);
  rightCasketContainer = new THREE.Object3D();
  rightCasketContainer.position.set(0, 0, 0);
  spokesContainer = new THREE.Object3D();
  spokesContainer.position.set(0, 0, 0);
  casketContainer = new THREE.Object3D();
  casketContainer.position.set(0, 0, 0);
  wheelContainer.add(casketContainer);
  wheelContainer.add(spokesContainer);
  wheelContainer.add(rightCasketContainer);
  wheelContainer.add(leftCasketContainer);
  scene.add(container);
}

function render() 
{
  requestAnimationFrame(render);

  if (control.sceneToggle)
    scene.rotation.y += sceneToggle;

  //Rotation of the wheel & caskets
  if (control.wheelToggle) 
  {
    container.rotation.z += wheelToggle;
    basketsArray.forEach(element => {element.rotation.y -= wheelToggle;});
  }

  renderer.render(scene, camera);
}

window.onload = () => {
  init();
  createCameraAndLights();
  createGeometry();
  render();
  setupDateGui();
}
