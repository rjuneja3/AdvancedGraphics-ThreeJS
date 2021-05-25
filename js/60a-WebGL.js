function main(){
    // get the canvas element
    const canvas = document.getElementById('game_surface');

    //get the webgl context
    const gl = canvas.getContext('webgl2');
    if(!gl){
        console.log('Fail to get the rendering context');
        return;
    }

    //specify color of the canvas
    gl.clearColor(0.95, 0.75, 0.8, 1.0);

    gl.drawArrays( gl.POINTS, 0, 1);
    console.log('This works! yay');
}

window.onload = main;