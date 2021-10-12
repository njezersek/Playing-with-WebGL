import { mat4 } from 'gl-matrix';

import Application from 'Application'

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCode from 'shaders/fragment.glsl';

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

interface Buffers {
	position: WebGLBuffer;
}

class App extends Application{
	programInfo: ProgramInfo;
	buffers: Buffers;
	projectionMatrix = mat4.create();
	modelViewMatrix = mat4.create();

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		
		this.programInfo = this.initShaderProgram(vertexShaderCode, fragmentShaderCode);

		this.buffers = this.initBuffers();

		const numComponents = 3;
		const type = this.gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
		this.gl.vertexAttribPointer(
			this.programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset
		);
		this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

		this.gl.useProgram(this.programInfo.program);
	}

	update(delta: number, t: number) : void {
	
	}

	render(delta: number, t: number): void {
		const offset = 0;
		const vertexCount = 4;
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
	}
	resize(width: number, height: number): void {
		const fieldOfView = 45 * Math.PI / 180; 
		const aspect = width / height;
		const zNear = 0.1;
		const zFar = 100.0;

		this.projectionMatrix = mat4.create();
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

		this.modelViewMatrix = mat4.create();
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-0.0, 0.0, -6.0]);

		this.gl.uniformMatrix4fv(
			this.programInfo.uniformLocations.projectionMatrix,
			false,
			this.projectionMatrix
		);
		this.gl.uniformMatrix4fv(
			this.programInfo.uniformLocations.modelViewMatrix,
			false,
			this.modelViewMatrix
		);
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
			},
		};
	}

	private initBuffers() : Buffers {
		// Create a buffer for the square's positions.
		const positionBuffer = this.gl.createBuffer();
	
		if(!positionBuffer) throw "Unable to create positon buffer.";
	
		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
	
		// Now create an array of positions for the square.
		const positions = [
			1.0,  1.0, -1,
			-1.0,  1.0, 1,
			1.0, -1.0, -1,
			-1.0, -1.0, 1,
		];
	
		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.
		this.gl.bufferData(this.gl.ARRAY_BUFFER,
						new Float32Array(positions),
						this.gl.STATIC_DRAW);
	
		return {
			position: positionBuffer,
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
			this.gl.deleteShader(shader);
			throw 'An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader);
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