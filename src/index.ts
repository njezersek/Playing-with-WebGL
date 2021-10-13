import { mat4 } from 'gl-matrix';

import Application from 'Application'
import Shader from 'Shader';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCodeA from 'shaders/fragment.glsl';
import fragmentShaderCodeB from 'shaders/fragmentSolidWhite.glsl';

interface Buffers {
	position: WebGLBuffer;
	positionB: WebGLBuffer;
}

class App extends Application{
	programInfoA: Shader;
	programInfoB: Shader;
	buffers: Buffers;
	projectionMatrix = mat4.create();
	modelMatrix = mat4.create();
	viewMatrix = mat4.create();
	vaoSquare: WebGLVertexArrayObject;
	vaoDeltoid: WebGLVertexArrayObject;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		
		this.programInfoA = new Shader(this.gl, vertexShaderCode, fragmentShaderCodeA);
		this.programInfoB = new Shader(this.gl, vertexShaderCode, fragmentShaderCodeB);

		
		// create vertex array object
		let vao = this.gl.createVertexArray();
		if(!vao) throw "Can't create vertex array object.";
		this.vaoSquare = vao;
		
		vao = this.gl.createVertexArray();
		if(!vao) throw "Can't create vertex array object.";
		this.vaoDeltoid = vao;
		
		this.buffers = this.initBuffers();

		console.log(this.programInfoA.getAttributeLocation('aVertexPosition'), this.programInfoB.getAttributeLocation('aVertexPosition')); 

		window.addEventListener("keypress", e => {
			let speed = 0.1;
			if(e.key == "a"){
				console.log(e.key);
				mat4.translate(this.viewMatrix, this.viewMatrix, [speed, 0, 0]);
				//mat4.rotateY(this.viewMatrix, this.viewMatrix, -speed);
			}
			if(e.key == "d"){
				//mat4.rotateY(this.viewMatrix, this.viewMatrix, +speed);
				mat4.translate(this.viewMatrix, this.viewMatrix, [-speed, 0, 0]);
			}
		});
	}


	update(delta: number, t: number) : void {
	}

	render(delta: number, t: number): void {
		const offset = 0;
		const vertexCount = 4;
		
		// draw with program A
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, 0.0, -6.0]);
		mat4.rotateY(this.modelMatrix, this.modelMatrix, -Math.PI/4+t/1000);
		mat4.rotateZ(this.modelMatrix, this.modelMatrix, -Math.PI/8+t/2000);

		this.programInfoA.enable();
		this.programInfoA.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);		
		this.programInfoA.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);		
		
		this.gl.bindVertexArray(this.vaoSquare);
		this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
		
		
		// draw with program B
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [-0.0, 0.0, -7.0]);
		
		this.programInfoB.enable();
		this.programInfoB.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);
		this.programInfoB.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);		
		
		this.gl.bindVertexArray(this.vaoDeltoid);
		this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, offset, vertexCount, 100);
	}
	resize(width: number, height: number): void {
		const fieldOfView = 45 * Math.PI / 180; 
		const aspect = width / height;
		const zNear = 0.1;
		const zFar = 100.0;

		this.projectionMatrix = mat4.create();
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

		// set uniforms for program A
		this.programInfoA.enable();
		this.programInfoA.setUniformMatrixFloat('uProjectionMatrix', this.projectionMatrix);
		this.programInfoA.setUniformVectorFloat('uScreenSize', new Float32Array([width, height]));

		// set uniforms for program B
		this.programInfoB.enable();
		this.programInfoB.setUniformMatrixFloat('uProjectionMatrix', this.projectionMatrix);
		this.programInfoB.setUniformVectorFloat('uScreenSize', new Float32Array([width, height]));

	}

	private initBuffers() : Buffers {

		this.gl.bindVertexArray(this.vaoSquare);
		
		const positionBuffer = this.gl.createBuffer();
		if(!positionBuffer) throw "Unable to create positon buffer.";
		
		const normalBuffer = this.gl.createBuffer();
		if(!normalBuffer) throw "Unable to create normal buffer.";

		const texcoordBuffer = this.gl.createBuffer();
		if(!texcoordBuffer) throw "Unable to create texcoord buffer.";
		
		const indexBuffer = this.gl.createBuffer();
		if(!indexBuffer) throw "Unable to create index buffer.";
		
		// vertex positions for a cube
		const cubeVertexPositions = new Float32Array([
			1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,
		]);
		// vertex normals for a cube
		const cubeVertexNormals = new Float32Array([
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
		]);
		// vertex texture coordinates for a cube
		const cubeVertexTexcoords = new Float32Array([
			1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
		]);
		// vertex indices for the triangles of a cube
		// the data above defines 24 vertices. We need to draw 12
		// triangles, 2 for each size, each triangle needs
		// 3 vertices so 12 * 3 = 36
		const cubeVertexIndices = new Uint16Array([
			0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
		],);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, cubeVertexPositions, this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(this.programInfoA.getAttributeLocation('aVertexPosition'));
		this.gl.vertexAttribPointer(
			this.programInfoA.getAttributeLocation('aVertexPosition'),
			3, // num compenents
			this.gl.FLOAT, // type
			false, // normalize
			0, // stride
			0 // offset
		);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, cubeVertexNormals, this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(this.programInfoA.getAttributeLocation('aVertexNormal'));
		this.gl.vertexAttribPointer(
			this.programInfoA.getAttributeLocation('aVertexNormal'),
			3, // num compenents
			this.gl.FLOAT, // type
			false, // normalize
			0, // stride
			0 // offset
		);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, cubeVertexTexcoords, this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(this.programInfoA.getAttributeLocation('aVertexTexcoord'));
		this.gl.vertexAttribPointer(
			this.programInfoA.getAttributeLocation('aVertexTexcoord'),
			2, // num compenents
			this.gl.FLOAT, // type
			false, // normalize
			0, // stride
			0 // offset
		);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, this.gl.STATIC_DRAW);
		

			
			
		// make the other buffer
		this.gl.bindVertexArray(this.vaoDeltoid);
		const positionBufferB = this.gl.createBuffer();
	
		if(!positionBufferB) throw "Unable to create positon buffer.";

		const positionsB = [
			0.0,  1.0, 1,
			-1.0,  1.0, 1,
			1.0, -1.0, 1,
			-1.0, -0.0, 1,
		];
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBufferB);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positionsB), this.gl.STATIC_DRAW);
	
		this.gl.enableVertexAttribArray(0);//this.programInfoB.getAttributeLocation('aVertexPosition'));
		this.gl.vertexAttribPointer(
			0, //this.programInfoB.getAttributeLocation('aVertexPosition'),
			3, // num compenents
			this.gl.FLOAT, // type
			false, // normalize
			0, // stride
			0 // offset
		);
		return {
			position: positionBuffer,
			positionB: positionBufferB,
		};
	}

	private loadShader(type: number, source: string) {
		const shader = this.gl.createShader(type);
		if(!shader) throw "Unable to create shader.";
	
		// Send the source to the shader object
		this.gl.shaderSource(shader, source);
	
		// Compile the shader program
		this.gl.compileShader(shader);
	
		// See if it compiled successfully
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			let error = this.gl.getShaderInfoLog(shader);
			this.gl.deleteShader(shader);
			throw 'An error occurred compiling the shaders: ' + error;
		}
	
		return shader;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	document.body.style.margin = "0px";
	document.body.style.overflow = "hidden";
    const app = new App(canvas);

	app.start();
});