import { mat4 } from 'gl-matrix';

import Application from 'Application'
import Shader from 'Shader';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCodeA from 'shaders/fragment.glsl';
import fragmentShaderCodeB from 'shaders/fragmentSolidWhite.glsl';

interface ProgramInfo {
	program: WebGLProgram;
	attribLocations: {
		vertexPosition: number;
	},
	uniformLocations: {
		projectionMatrix: WebGLUniformLocation | null,
		modelViewMatrix: WebGLUniformLocation | null,
		screenSize: WebGLUniformLocation | null,
	},
}

interface Buffers {
	position: WebGLBuffer;
	positionB: WebGLBuffer;
}

class App extends Application{
	programInfoA: Shader;
	programInfoB: Shader;
	buffers: Buffers;
	projectionMatrix = mat4.create();
	modelViewMatrix = mat4.create();
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
	}


	update(delta: number, t: number) : void {

	}

	render(delta: number, t: number): void {
		const offset = 0;
		const vertexCount = 4;

		
		// draw with program A
		mat4.identity(this.modelViewMatrix);
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0.0, 0.0, -6.0]);

		this.programInfoA.enable();
		this.programInfoA.setUniformMatrixFloat('uModelViewMatrix', this.modelViewMatrix);		
			
		this.gl.bindVertexArray(this.vaoSquare);
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);

		
		// draw with program B
		mat4.identity(this.modelViewMatrix);
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -5.0]);
		//mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, -Math.PI/4);
		//mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, -Math.PI/8);
		
		this.programInfoB.enable();
		this.programInfoB.setUniformMatrixFloat('uModelViewMatrix', this.modelViewMatrix);
		
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

	private initShaderProgram(vertexShaderCode: string, fragmentShaderCode: string) : ProgramInfo{
		// Init shader program
		const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderCode);
		const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderCode);

		// Create the shader program
		const shaderProgram = this.gl.createProgram();
		if(!shaderProgram) throw "Unable to initialize the shader program.";

		this.gl.attachShader(shaderProgram, vertexShader);
		this.gl.attachShader(shaderProgram, fragmentShader);
		this.gl.linkProgram(shaderProgram);

		// If creating the shader program failed, alert
		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			throw 'Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram);
		}

		return {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			},
			uniformLocations: {
				projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
				modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
				screenSize: this.gl.getUniformLocation(shaderProgram, 'uScreenSize'),
			},
		};
	}

	private initBuffers() : Buffers {

		this.gl.bindVertexArray(this.vaoSquare);
		
		const positionBuffer = this.gl.createBuffer();
		
		if(!positionBuffer) throw "Unable to create positon buffer.";
		
		const positions = [
			1.0,  1.0, 1,
			-1.0,  1.0, 1,
			1.0, -1.0, 1,
			-1.0, -1.0, 1,
		];
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
		
		this.gl.enableVertexAttribArray(0);//this.gl.enableVertexAttribArray(this.programInfoA.getAttributeLocation('aVertexPosition'));
		this.gl.vertexAttribPointer(
			0, // this.programInfoA.getAttributeLocation('aVertexPosition'),
			3, // num compenents
			this.gl.FLOAT, // type
			false, // normalize
			0, // stride
			0 // offset
		);
			
			
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