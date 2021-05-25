var Shaders = {}


Shaders.RohanShader0 = {

	name: 'RohanShader0',

	uniforms: {
		'time': {type:'f', value: 0.0},
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
	varying vec2 vUv;
	const float PI = 3.14;
	vec3 purple = vec3(0.9,0.4,0.1);
	vec3 green = vec3(1.0,0.7,0.2);
	void main() {
		float pct = PI*cos(vUv.x*40.0*sin(time));
		vec3 color = mix(green,purple, pct);
		gl_FragColor = vec4( color, 1.0 ); //change the value of alpha

	}`
};

Shaders.RohanShader1 = {
	name: 'RohanShader1',
    uniforms: {
        'time': { type: 'f', value: 0.0}  
        },
    vertexShader:
        `varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader:
        `varying vec2 vUv;
        uniform float time;
        void main() {
            float iX = vUv.x;
            float iY = vUv.y;
            vec3 greenRed = vec3(abs(sin(iX*3.14*20.0)), abs(cos(iY*3.14*15.0)), 10.0);
            gl_FragColor = vec4( greenRed, abs(tan(iY*time*1.5)) );
        }`
};



Shaders.RohanShader2 = {

	name: 'RohanShader2',

	uniforms: {
		'time': {type:'f', value: 0.0},
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
	varying vec2 vUv;
	vec3 red = vec3(1.0,0.0,0.0);
	vec3 green = vec3(0.0,1.0,0.0);
	void main() {
		float pct = sin(vUv.x*60.0*time);
		vec3 color = mix(green,red, pct);
		gl_FragColor = vec4( color, 1.0 ); //change the value of alpha

	}`
};



Shaders.RohanShader3 = {

	name: 'RohanShader3',

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
		colorB.a = colorA.r;
		gl_FragColor = mix(colorA, colorB, abs(sin(time)));

	}`
};






Shaders.RohanShader4 = {

	name: 'RohanShader4',

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
		float pct = vUv.x;
		vec4 colorA = texture2D(textureA,vUv); //wood
		vec4 colorB = texture2D(textureB,vUv); //flower
		gl_FragColor = mix(colorB, vec4(normalize(vNormal)*sin(time), 1.0), abs(sin(time)));
		//colorA.a = colorB.r;
		//gl_FragColor = colorA;
		
		//gl_FragColor = vec4(normalize(vNormal)*sin(time), 1.0);

	}`
};
