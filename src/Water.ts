import { mat4, vec3 } from 'gl-matrix';

import Shader from 'Shader';
import VertexArray from 'VertexArray';
import { glw } from 'WebGLw';


import vertexShaderCode from 'shaders/water-vertex.glsl';
import fragmentShaderCode from 'shaders/water-fragment.glsl';

export default class Water{
	private program: Shader;
	private vertexArray: VertexArray;
	private viewMatrix = mat4.create();
	private projectionMatrix = mat4.create();
	private playerPosition = vec3.create();

	constructor(){
		this.program = new Shader(vertexShaderCode, fragmentShaderCode);

		this.vertexArray = new VertexArray();
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexPosition'),
			new Float32Array([
				-1, 0, -1,
				-1, 0, 1,
				1, 0, -1,
				1, 0, 1,
			]),
			3
		);
		this.vertexArray.setIndexBuffer(new Uint16Array([0, 1, 2, 1, 2, 3],));
	}
	render(dt: number, t: number){
		this.vertexArray.enable();
		this.program.enable();
		this.program.setUniformVectorFloat('uPlayerPosition', this.playerPosition);
		this.program.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);	
		this.program.setUniformMatrixFloat('uProjectionMatrix', this.projectionMatrix);

		glw.gl.drawElements(glw.gl.TRIANGLES, this.vertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0);
	}

	setViewMatrix(m: mat4){
		this.viewMatrix = mat4.clone(m);
	}

	setProjectionMatrix(m: mat4){
		this.projectionMatrix = mat4.clone(m);
	}

	setPlayerPosition(v: vec3){
		this.playerPosition = v;
	}
}