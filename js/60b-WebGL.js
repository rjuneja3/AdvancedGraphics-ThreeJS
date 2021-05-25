const vs_text = `
void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}
`;

const fs_text = `
void main() {
    gl_FragColor = vec4(1.0, 0.25, 0.25, 1.0);
}
`;

function main() {

    const canvas = document.getElementById('game_surface');

    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.log('Fail to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, vs_text, fs_text)) {
        console.log('Fail to initialize shaders');
        return;        
    }

    //specify the clear color
    gl.clearColor( 0.75, 0.85, 0.8, 1.0);

    //clear the screen
    gl.clear( gl.COLOR_BUFFER_BIT );

    //draw a point
    gl.drawArrays( gl.POINTS, 0, 1 );

    console.log('It is working');
}
/**
 * 
 * @param {*} gl WebGL context
 * @param {*} vs_source text for the vertex shader
 * @param {*} fs_source text for the fragment shader
 * @returns true if successful
 */
function initShaders(gl, vs_source, fs_source) {

    const program = createProgram(gl, vs_source, fs_source);
    if (!program) {
        console.log('Fail to create shader program');
        return;
    }
    gl.useProgram( program );
    gl.program = program;

    return true;

}

/**
 * 
 * @param {*} gl 
 * @param {*} vs_source text for the vertex shader
 * @param {*} fs_source text for the fragment shader
 * @returns a properly initialized gl program or null if it falis
 */
function createProgram(gl, vs_source, fs_source) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs_source);
    const fragmentShader = loadShader( gl, gl.FRAGMENT_SHADER, fs_source);
    if ( !vertexShader || ! fragmentShader) {
        return null
    }

    //create a program object
    const program = gl.createProgram();
    if ( !program ) {
        return null
    }

    //attach the shader object
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //link the program
    gl.linkProgram( program );

    //check the results of linking
    let linked = gl.getProgramParameter( program, gl.LINK_STATUS );
    if (!linked) {
        let error = gl.getProgramInfoLog( program );
        console.log(`LINK ERROR: ${error}`);
        gl.deleteProgram( program );
        gl.deleteShader ( vertexShader );
        gl.deleteShader( fragmentShader );
        return null;
    }

    return program;
}

/**
 * 
 * @param {*} gl WebGL context
 * @param {*} type the type of shader to create 
 * @param {*} source text for the fragment shader
 * @returns a shader object or null if it fails
 */
function loadShader( gl, type, source ) {

    //create the shader object
    const shader = gl.createShader( type );
    if ( shader == null) {
        console.log(`SHADER CREATION ERROR: ${type} shader`);
        return null;
    } 

    //set the shader program
    gl.shaderSource( shader, source);
    
    //compile the shader
    gl.compileShader( shader );

    //check the result of compilation
    let compiled = gl.getShaderParameter( shader, gl.COMPILE_STATUS );
    if (!compiled) {
        let error = gl.getShaderInfoLog( shader );
        console.log(`COMPILE ERROR: ${error}`);
        gl.deleteShader( shader );
        return null;
    }

    return shader;
}

window.onload = main;