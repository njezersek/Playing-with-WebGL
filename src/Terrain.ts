import { mat4, vec3 } from 'gl-matrix';
import SimplexNoise from 'simplex-noise';

import WebGLw from 'WebGLw';
import Shader from 'Shader';
import VertexArray from 'VertexArray';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCode from 'shaders/fragment.glsl';

import texturePath from 'textures/rock.jpg';
import Texture from 'Texture';

export default class Terrain{
	private program: Shader;
	private vertexArray: VertexArray;
	private modelMatrix = mat4.create();
	private viewMatrix = mat4.create();
	private projectionMatrix = mat4.create();
	private gl: WebGL2RenderingContext;

	private vertecies: number[] = [];
	private normals: number[] = [];
	private indecies: number[] = [];
	private texcoords: number[] = [];

	private size = 128;

	private noise: SimplexNoise;

	texture: Texture;

	constructor(private w: WebGLw){
		this.gl = w.gl;
		this.noise = new SimplexNoise(5);
		this.program = new Shader(this.w, vertexShaderCode, fragmentShaderCode);

		// inti a grid of verticies
		for(let x=0; x<this.size; x++){
			for(let y=0; y<this.size; y++){

				// add vertex position
				this.vertecies.push(x/this.size, this.height(x/this.size, y/this.size), y/this.size);

				// add vetex normal
				let n = this.normal(x/this.size, y/this.size);
				this.normals.push(n[0], n[1], n[2]);

				// add texture coordinate
				this.texcoords.push(x/this.size, y/this.size);

				// add connections between vertecies
				if(x < this.size-1 && y < this.size-1){
					let i = x*this.size + y;
					this.indecies.push(i, i+1, i+this.size);
					this.indecies.push(i+this.size, i+1, i+this.size+1);
				}
			}
		}

		this.vertexArray = new VertexArray(this.w);
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexPosition'),
			new Float32Array(this.vertecies),
			3
		);
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexNormal'),
			new Float32Array(this.normals),
			3
		);
		this.vertexArray.addVertexBuffer(
			this.program.getAttributeLocation('aVertexTexcoord'),
			new Float32Array(this.texcoords),
			2
		);
		this.vertexArray.setIndexBuffer(new Uint16Array(this.indecies));

		this.texture = new Texture(this.w, texturePath);
	}

	height(x: number, y: number){
		let v = 0;
		let base = 0;
		let d = Math.sqrt((x-.5)**2 + (y-.5)**2) * 8;
		let mask = 1/(Math.exp(d)+Math.exp(-d));
		//mask = 0.5;
		base += this.noise.noise2D(x,y)**2 * 0.4 * mask;
		base += this.noise.noise2D(x*2,y*2)**2 * 0.2 * mask;
		v += base;
		v += this.noise.noise2D(x*10,y*10) * 0.009;
		v += this.noise.noise2D(x*20,y*20) * 1.1 * base**2;
		return v;
	}

	normal(x: number, y: number){
		const epsilon = 0.0001;

		let v = vec3.fromValues(x, this.height(x,y), y);
		let vx = vec3.fromValues(x+epsilon, this.height(x+epsilon,y), y);
		let vy = vec3.fromValues(x, this.height(x,y+epsilon), y+epsilon);
		
		let dx = vec3.sub(vec3.create(), vx, v);
		let dy = vec3.sub(vec3.create(), vy, v);

		let n = vec3.cross(vec3.create(), dy, dx);
		vec3.normalize(n, n);

		return n;
	}

	render(dt: number, t: number){
		this.vertexArray.enable();

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [-3, -2, -10]);
		mat4.scale(this.modelMatrix, this.modelMatrix, new Float32Array([6,6,6]))

		this.program.enable();
		this.program.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);		
		this.program.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);	
		this.program.setUniformMatrixFloat('uProjectionMatrix', this.projectionMatrix);

		const texUint = 0;
		this.gl.activeTexture(this.gl.TEXTURE0 + texUint);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);
		this.gl.uniform1i(this.program.getUniformLocation('uTex'), texUint);

		this.gl.drawElements(this.gl.TRIANGLES, this.vertexArray.getNumIndcies(), this.gl.UNSIGNED_SHORT, 0);
	}

	setViewMatrix(m: mat4){
		this.viewMatrix = mat4.clone(m);
	}

	setProjectionMatrix(m: mat4){
		this.projectionMatrix = mat4.clone(m);
	}
}