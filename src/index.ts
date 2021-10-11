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

	const glw = new WebGLw(canvas);

	const vertexShader = glw.loadShader("vertex", vertexShaderCode);
	const fragmentShader = glw.loadShader("fragment", fragmentShaderCode);

	const program = glw.createProgram(vertexShader, fragmentShader);

	glw.useProgram(program);

	const vertexData = new Float32Array([
		-1.0,  1.0,
    	 1.0,  1.0,
		-1.0, -1.0,
		1.0, -1.0,
	]);

	const vertexBuffer = glw.createAttributeBuffer('aVertexPosition', 2, vertexData);

	glw.addAttributeBuffer(vertexBuffer);

	glw.setUniformVectorFloat('uScreenSize', new Float32Array([window.innerWidth, window.innerHeight]));

	let projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
	glw.setUniformMatrixFloat('uPerspective', projectionMatrix);
	
	const modelViewMatrix = mat4.create();
	mat4.translate(modelViewMatrix,     // destination matrix
		modelViewMatrix,     // matrix to translate
		[-0.0, 0.0, -6.0]);  // amount to translate
	glw.setUniformMatrixFloat('uModelViewMatrix', modelViewMatrix);

	

	function tick(t: number){
		glw.gl.viewport(0, 0, canvas.width, canvas.height);
		glw.drawTriangles(4);
		window.requestAnimationFrame(tick);
	}

	tick(0);
}


function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}


window.onresize = resize;
window.onload = main;