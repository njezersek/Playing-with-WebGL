import { mat4, vec3 } from 'gl-matrix';

import { glw } from 'WebGLw';
import Shader from 'Shader';
import VertexArray from 'VertexArray';
import Camera from 'Camera';


import vertexShaderCode from 'shaders/water-vertex.glsl';
import fragmentShaderCode from 'shaders/water-fragment.glsl';

export default class Water{
	private program: Shader;
	private vertexArray: VertexArray;

	constructor(private camera: Camera){
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
		this.program.setUniformVectorFloat('uPlayerPosition', this.camera.position);
		this.program.setUniformMatrixFloat('uViewMatrix', this.camera.viewMatrix);	
		this.program.setUniformMatrixFloat('uProjectionMatrix', this.camera.projectionMatrix);

		glw.gl.drawElements(glw.gl.TRIANGLES, this.vertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0);
	}
}