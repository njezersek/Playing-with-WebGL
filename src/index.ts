import { mat4 } from 'gl-matrix';

import Application from 'Application'
import Shader from 'Shader';
import VertexArray from 'VertexArray';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCodeA from 'shaders/fragment.glsl';
import fragmentShaderCodeB from 'shaders/fragmentSolidWhite.glsl';

class App extends Application{
	programInfoA: Shader;
	programInfoB: Shader;
	projectionMatrix = mat4.create();
	modelMatrix = mat4.create();
	viewMatrix = mat4.create();
	vaoSquare: VertexArray;
	vaoDeltoid: VertexArray;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		
		this.programInfoA = new Shader(this.w, vertexShaderCode, fragmentShaderCodeA);
		this.programInfoB = new Shader(this.w, vertexShaderCode, fragmentShaderCodeB);

		this.vaoSquare = new VertexArray(this.w);
		this.vaoSquare.addVertexBuffer(
			this.programInfoA.getAttributeLocation('aVertexPosition'),
			new Float32Array([1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,]),
			3
		);
		this.vaoSquare.addVertexBuffer(
			this.programInfoA.getAttributeLocation('aVertexNormal'),
			new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,]),
			3
		);
		this.vaoSquare.addVertexBuffer(
			this.programInfoA.getAttributeLocation('aVertexTexcoord'),
			new Float32Array([1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,]),
			2
		);
		this.vaoSquare.setIndexBuffer(new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,],));
		
		this.vaoDeltoid = new VertexArray(this.w);
		this.vaoDeltoid.addVertexBuffer(
			this.programInfoB.getAttributeLocation('aVertexPosition'),
			new Float32Array([
				0.0,  1.0, 1,
				-1.0,  1.0, 1,
				1.0, -1.0, 1,
				-1.0, -0.0, 1,
			]),
			3
		);

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
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, 0.0, -6.0]);
		mat4.rotateY(this.modelMatrix, this.modelMatrix, -Math.PI/4+t/1000);
		mat4.rotateZ(this.modelMatrix, this.modelMatrix, -Math.PI/8+t/2000);

		this.programInfoA.enable();
		this.programInfoA.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);		
		this.programInfoA.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);		

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [-0.0, 0.0, -9.0]);
		mat4.scale(this.modelMatrix, this.modelMatrix, new Float32Array([2,2,2]))
		
		this.programInfoB.enable();
		this.programInfoB.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);
		this.programInfoB.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);		
		
	}

	render(delta: number, t: number): void {
		//console.log(1000/delta);
		// draw with program A
		this.programInfoA.enable();
		this.vaoSquare.enable();
		this.gl.drawElements(this.gl.TRIANGLES, this.vaoSquare.getNumIndcies(), this.gl.UNSIGNED_SHORT, 0);
		
		// draw with program B
		this.programInfoB.enable();
		this.vaoDeltoid.enable();
		this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, this.vaoDeltoid.getNumVertecies(), 1);
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

}

document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	document.body.style.margin = "0px";
	document.body.style.overflow = "hidden";
    const app = new App(canvas);

	app.start();
});