import {glMatrix, vec3, mat4} from 'gl-matrix';
import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCode from 'shaders/fragment.glsl';
import WebGLw from 'WebGLw';

// create canvas
let canvas = document.createElement("canvas");

function main(){
	resize();

	document.body.appendChild(canvas);

	document.body.style.margin = "0px";
	document.body.style.overflow = "hidden";
	
	const gl = canvas.getContext("webgl");

	if(!gl){
		throw "Unable to initalize WebGL.";
	}

	const programInfo = initShaderProgram(gl, vertexShaderCode, fragmentShaderCode);

	const buffers = initBuffers(gl);

	
	function tick(t: number){
		if(!gl) return;
		drawScene(gl, programInfo, buffers);
		window.requestAnimationFrame(tick);
	}

	tick(0);
}

//
// Draw the scene.
//
function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.
	const fieldOfView = 45 * Math.PI / 180;   // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	mat4.perspective(projectionMatrix,
						fieldOfView,
						aspect,
						zNear,
						zFar);

	// Set the drawing position to the "identity" point, which is
	// the center of the scene.
	const modelViewMatrix = mat4.create();

	// Now move the drawing position a bit to where we want to
	// start drawing the square.
	mat4.translate(modelViewMatrix,     // destination matrix
					modelViewMatrix,     // matrix to translate
					[-0.0, 0.0, -6.0]);  // amount to translate

	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute.
	{
		const numComponents = 2;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset);
		gl.enableVertexAttribArray(
			programInfo.attribLocations.vertexPosition);
	}

	// Tell WebGL to use our program when drawing

	gl.useProgram(programInfo.program);

	// Set the shader uniforms

	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}


//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
interface Buffers {
	position: WebGLBuffer;
}
function initBuffers(gl: WebGLRenderingContext) : Buffers {
	// Create a buffer for the square's positions.
	const positionBuffer = gl.createBuffer();

	if(!positionBuffer) throw "Unable to create positon buffer.";

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Now create an array of positions for the square.
	const positions = [
		1.0,  1.0,
		-1.0,  1.0,
		1.0, -1.0,
		-1.0, -1.0,
	];

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(gl.ARRAY_BUFFER,
					new Float32Array(positions),
					gl.STATIC_DRAW);

	return {
		position: positionBuffer,
	};
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
interface ProgramInfo {
	program: WebGLProgram;
	attribLocations: {
		vertexPosition: number;
	},
	uniformLocations: {
		projectionMatrix: WebGLUniformLocation | null,
		modelViewMatrix: WebGLUniformLocation | null,
	},
}
function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) : ProgramInfo {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program
	const shaderProgram = gl.createProgram();
	if(!shaderProgram) throw "Unable to initialize the shader program.";

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw 'Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram);
	}

	return {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		},
	};
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if(!shader) throw "Unable to create shader.";

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		gl.deleteShader(shader);
		throw 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
	}

	return shader;
}

function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}


window.onresize = resize;
window.onload = main;