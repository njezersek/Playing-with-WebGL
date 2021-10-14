import { mat4 } from 'gl-matrix';

import WebGLw from 'WebGLw';
import Shader from 'Shader';
import VertexArray from 'VertexArray';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCode from 'shaders/fragment.glsl';

export default class Cube{
	private program: Shader;
	private vertexArray: VertexArray;
	private modelMatrix = mat4.create();
	private viewMatrix = mat4.create();
	private projectionMatrix = mat4.create();
	gl: WebGL2RenderingContext;

	constructor(private w: WebGLw){
		this.gl = w.gl;
		this.program = new Shader(this.w, vertexShaderCode, fragmentShaderCode);

		this.vertexArray = new VertexArray(this.w);
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexPosition'),
			new Float32Array([1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,]),
			3
		);
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexNormal'),
			new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,]),
			3
		);
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexTexcoord'),
			new Float32Array([1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,]),
			2
		);
		this.vertexArray.setIndexBuffer(new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,],));
		
	}

	render(dt: number, t: number){
		this.vertexArray.enable();

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, Math.sin(t/1000)*0, -6.0]);
		//mat4.rotateY(this.modelMatrix, this.modelMatrix, -Math.PI/4-t/1000);
		//mat4.rotateZ(this.modelMatrix, this.modelMatrix, -Math.PI/8+t/2000);

		this.program.enable();
		this.program.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);		
		this.program.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);	
		this.program.setUniformMatrixFloat('uProjectionMatrix', this.projectionMatrix);

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexArray.getNumIndcies(), this.gl.UNSIGNED_SHORT, 0);
	}

	setViewMatrix(m: mat4){
		this.viewMatrix = mat4.clone(m);
	}

	setProjectionMatrix(m: mat4){
		this.projectionMatrix = mat4.clone(m);
	}
}