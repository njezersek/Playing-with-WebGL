import { mat4, vec2, vec3 } from 'gl-matrix';

import Shader from 'Shader';
import VertexArray from 'VertexArray';
import { glw } from 'WebGLw';


import vertexShaderCode from 'shaders/terrain-vertex.glsl';
import fragmentShaderCode from 'shaders/terrain-fragment.glsl';

export default class Terrain2{
	private program: Shader;
	private ringVertexArray: VertexArray;
	private centerVertexArray: VertexArray;
	private modelMatrix = mat4.create();
	private viewMatrix = mat4.create();
	private projectionMatrix = mat4.create();
	private playerPosition = vec3.create();
	private k = 32;

	constructor(){
		this.program = new Shader(vertexShaderCode, fragmentShaderCode);

		const {E, T, V} = this.generateMesh(this.k, false);

		this.ringVertexArray = new VertexArray();
		this.ringVertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexPosition'),
			new Float32Array(V),
			3
		);
		this.ringVertexArray.setIndexBuffer(new Uint16Array(T));

		const {E: Ecenter, T: Tcenter, V: Vcenter} = this.generateMesh(this.k/2, true);

		this.centerVertexArray = new VertexArray();
		this.centerVertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexPosition'),
			new Float32Array(Vcenter),
			3
		);
		this.centerVertexArray.setIndexBuffer(new Uint16Array(Tcenter));
	}

	generateMesh(k: number, fill: boolean){
		let V = [];
		let T = [];
		let E = [];
	
		let m = 2*k+1; // size of the hole
		let n = 2*m+1; // size of the square
		let N = n+1; // no. of verticies on the side of a square
	
		// inti a grid of verticies
		for(let x=-m; x<=m+1; x++){
			for(let y=-m; y<=m+1; y++){
				// add vertex position
				V.push(x, 0, y); //V.push({x: x, y: y});
	
				// add connections between vertecies
				let bound = (x < -k || x > k) || (y < -k || y > k)  || fill;
				if(x <= m && y <= m && bound){
					let i = (x+m)*N + (y+m);
					T.push(i, i+1, i+N);
					E.push(i, i+1, i+1, i+N, i+N, i);
					T.push(i+N, i+1, i+N+1);
					E.push(i+N, i+1, i+1, i+N+1, i+N+1, i+N);
				}
			}
		}
	
		return {E, T, V};
	}

	render(dt: number, t: number){
		this.ringVertexArray.enable();

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [0, 0, 0]);
		mat4.scale(this.modelMatrix, this.modelMatrix, new Float32Array([1,1,1]))

		this.program.enable();
		this.program.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);	
		this.program.setUniformVectorFloat('uPlayerPosition', this.playerPosition);
		this.program.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);	
		this.program.setUniformMatrixFloat('uProjectionMatrix', this.projectionMatrix);

		this.program.setUniformVectorFloat('uRingWidth', new Float32Array([this.k]));
		
		this.program.setUniformVectorFloat('uIsLine', new Float32Array([0]));
		glw.gl.drawElementsInstanced(glw.gl.TRIANGLES, this.ringVertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0, 4);
		this.program.setUniformVectorFloat('uIsLine', new Float32Array([1]));
		glw.gl.drawElementsInstanced(glw.gl.LINES, this.ringVertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0, 4);

		this.centerVertexArray.enable();
		this.program.setUniformVectorFloat('uIsLine', new Float32Array([0]));
		glw.gl.drawElements(glw.gl.TRIANGLES, this.centerVertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0);
		this.program.setUniformVectorFloat('uIsLine', new Float32Array([1]));
		glw.gl.drawElements(glw.gl.LINES, this.centerVertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0);
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