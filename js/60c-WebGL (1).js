//https://docs.gl/sl4/gl_FragCoord


const vs_text = `
attribute vec4 vertPosition;
void main() {
    gl_Position = vertPosition;
    gl_PointSize = 10.0;
}
`;

const fs_text = `
void main() {

    // gl_FragColor = vec4(0.8, 0.25, 0.25, 1.0);

    // if (gl_FragCoord.x < 320.0 )
    // {
    //     gl_FragColor = vec4(0.8, 0.25, 0.25, 1.0);
    // }
    // else
    // {
    //     gl_FragColor = vec4(0.2, 0.25, 0.9, 1.0);
    // }
    
    // gl_FragColor = vec4( abs(sin(gl_FragCoord.x / 50.0)), 0.0, 0.0, 1.0);
    gl_FragColor = vec4( abs(sin(gl_FragCoord.x / 50.0)), abs(cos(gl_FragCoord.y / 50.0)), abs(sin(gl_FragCoord.x / 50.0)), 1.0);
}
`;


let gl;
function main() {

    gl = getContext('game_surface');

    if (!initShaders(gl, vs_text, fs_text)) {
        console.log('Fail to initialize shaders');
        return;
    }

    let n = initVertexBuffer( gl, 'vertPosition' );

    //specify the clear color
    gl.clearColor( 0.7, 0.65, 0.95, 1.0);

    //clear the screen
    gl.clear( gl.COLOR_BUFFER_BIT );

    //
    // draw various gl primative
    // gl.drawArrays( gl.POINTS, 0, n );
    // gl.drawArrays( gl.LINES, 0, n );
    // gl.drawArrays( gl.LINE_STRIP, 0, n );
    // gl.drawArrays( gl.LINE_LOOP, 0, n );
    // gl.drawArrays( gl.TRIANGLES, 0, n);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays( gl.TRIANGLE_FAN, 0, n);

    console.log('It is working');
}

/**
 *
 * @param {string} canvasID string indicating the id of the canvas
 * @returns  {WebGL2RenderingContext} returns a webgl rendering  context
 */
function getContext(canvasID) {
    let canvas = document.getElementById('game_surface');

    let gl = canvas.getContext('webgl2');
    if (!gl) {
        console.log('Fail to get the rendering context for WebGL');
        return;
    }
    return gl;
}

/**
 *
 * @param {WebGlRenderingContext} gl
 * @param {string} attribLocation
 * @returns {int} number of pri
 */
function initVertexBuffer( gl, attribLocation ) {
    const vertices = new Float32Array([
        -0.5, 0.5,
        -0.5, -0.5,
        0.5, 0.5,
        0.5, -0.5
    ]);

    let n = 4;

    //create a buffer object
    const vertexBufferObject = gl.createBuffer();
    if (!vertexBufferObject) {
        console.log('Fail to initialize buffer');
        return -1;
    }

    //bind the buffer object to a target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);

    //write the data to the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    let positionAttribLocation = gl.getAttribLocation( gl.program, attribLocation);
    if ( positionAttribLocation < 0) {
        console.log(`Fail to get storage location of ${attribLocation}`);
        return -1;
    }

    //assign the buffer object to the a_Position variable
    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        2,                      //number of element per attribute
        gl.FLOAT,               //type of element
        gl.FALSE,               //
        2  * Float32Array.BYTES_PER_ELEMENT,
        0);                     //offset for the begining of a single vertex

    //enable the assignment to a a_Position variable
    gl.enableVertexAttribArray( positionAttribLocation );

    return vertices.length / 2;
}

/**
 *
 * @param {WebGL2RenderingContext} gl WebGL context
 * @param {string} vs_source text for the vertex shader
 * @param {string} fs_source text for the fragment shader
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
 * @param {WebGL2RenderingContext} gl
 * @param {string} vs_source text for the vertex shader
 * @param {string} fs_source text for the fragment shader
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
 * @param {WebGL2RenderingContext} gl WebGL context
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