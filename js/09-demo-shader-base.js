var Shaders = {}
Shaders.BasicShader9A0 = {

	name: 'BasicShader9A0',

	vertexShader: 
	
	`void main() {

		// position is a building shader variable holds the current vertex position			
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 

	}`,

	fragmentShader:

	`void main() {

		gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 ); //change the value of alpha

	}`
};

Shaders.BasicShader9A1 = {

	name: 'BasicShader9A1',

	vertexShader: 
	
	`varying vec2 vUv; //send coordinate to the fragment shader
	void main() {
		vUv = uv; // built-in variable that represents the pixel coordinates
		// position is a building shader variable holds the current vertex position			
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 

	}`,

	fragmentShader:

	`varying vec2 vUv;
	vec3 red = vec3(1.0,0.0,0.0);
	vec3 green = vec3(0.0,1.0,0.0);
	void main() {
		float pct = sin(vUv.x*20.0);
		vec3 color = mix(red,green, pct);
		gl_FragColor = vec4( color, 1.0 ); //change the value of alpha

	}`
};


Shaders.BasicShader9A2 = {

	name: 'BasicShader9A2',

	uniforms: {
		'time': {type:'f', value: 0.0},
		'textureA': {value: null},
		'textureB': {value: null}

	},

	vertexShader: 
	
	`varying vec2 vUv; //send coordinate to the fragment shader
	void main() {
		vUv = uv; // built-in variable that represents the pixel coordinates
		// position is a building shader variable holds the current vertex position			
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 

	}`,

	fragmentShader:

	`
	uniform float time; //will be updated by three js
	uniform sampler2D textureA;
	uniform sampler2D textureB;

	varying vec2 vUv;
	vec3 red = vec3(1.0,0.0,0.0);
	vec3 green = vec3(0.0,1.0,0.0);
	void main() {
		float pct = abs(sin(time));
		vec3 color = mix(red,green, pct);
		gl_FragColor = vec4( color, 1.0 ); //change the value of alpha

	}`
};




Shaders.BasicShader9A3 = {

	name: 'BasicShader9A3',

	uniforms: {
		'time': {type:'f', value: 0.0},
		'textureA': {value: null},
		'textureB': {value: null}

	},

	vertexShader: 
	
	`varying vec2 vUv; //send coordinate to the fragment shader
	void main() {
		vUv = uv; // built-in variable that represents the pixel coordinates
		// position is a building shader variable holds the current vertex position			
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 

	}`,

	fragmentShader:

	`
	uniform float time; //will be updated by three js
	uniform sampler2D textureA;
	uniform sampler2D textureB;
	
	varying vec2 vUv;
	vec3 red = vec3(1.0,0.0,0.0);
	vec3 green = vec3(0.0,1.0,0.0);
	void main() {
		//float pct = vUv.x;
		vec4 colorA = texture2D(textureA,vUv); //wood
		vec4 colorB = texture2D(textureB,vUv); //flower
		//gl_FragColor = mix(colorA, colorB, abs(sin(time)));
		colorA.a = colorB.r;
		gl_FragColor = colorA;

	}`
};




Shaders.BasicShader9A4 = {

	name: 'BasicShader9A4',

	uniforms: {
		'time': {type:'f', value: 0.0},
		'textureA': {value: null},
		'textureB': {value: null}

	},

	vertexShader: 
	
	`varying vec2 vUv; //send coordinate to the fragment shader
	varying vec3 vNormal;
	void main() {
		vUv = uv; // built-in variable that represents the pixel coordinates
		vNormal = normal; //built-in variable represnting the normal at that pixel coordinate
		// position is a building shader variable holds the current vertex position			
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 

	}`,

	fragmentShader:

	`
	uniform float time; //will be updated by three js
	uniform sampler2D textureA;
	uniform sampler2D textureB;
	
	varying vec2 vUv;
	varying vec3 vNormal;

	vec3 red = vec3(1.0,0.0,0.0);
	vec3 green = vec3(0.0,1.0,0.0);
	void main() {
		//float pct = vUv.x;
		//vec4 colorA = texture2D(textureA,vUv); //wood
		//vec4 colorB = texture2D(textureB,vUv); //flower
		//gl_FragColor = mix(colorA, colorB, abs(sin(time)));
		//colorA.a = colorB.r;
		//gl_FragColor = colorA;
		
		gl_FragColor = vec4(normalize(vNormal), 1.0);

	}`
};
