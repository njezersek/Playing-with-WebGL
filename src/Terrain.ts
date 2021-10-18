import { mat4, vec3 } from 'gl-matrix';
import SimplexNoise from 'simplex-noise';

import Shader from 'Shader';
import VertexArray from 'VertexArray';
import Texture from 'Texture';
import { glw } from 'WebGLw';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCode from 'shaders/fragment.glsl';

import rockTexturePath from 'textures/rock.jpg';
import grassTexturePath from 'textures/grass.jpg';

export default class Terrain{
	private program: Shader;
	private vertexArray: VertexArray;
	private modelMatrix = mat4.create();
	private viewMatrix = mat4.create();
	private projectionMatrix = mat4.create();

	private vertecies: number[] = [];
	private normals: number[] = [];
	private indecies: number[] = [];
	private texcoords: number[] = [];

	private size = 128;

	private noise: SimplexNoise;

	rockTexture: Texture;
	grassTexture: Texture;

	constructor(){
		this.noise = new SimplexNoise(0); // 0, 5
		this.program = new Shader(vertexShaderCode, fragmentShaderCode);

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

		this.vertexArray = new VertexArray();
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

		this.rockTexture = new Texture(rockTexturePath);
		this.grassTexture = new Texture(grassTexturePath);
	}

	height(x: number, y: number){
		let v = 0;
		let base = 0;
		let d = Math.sqrt((x-.5)**2 + (y-.5)**2) * 8;
		let mask = 2/(Math.exp(d)+Math.exp(-d)) - .1;
		mask = (this.noise.noise2D(x,y) + 0.2)**3 / 2;
		//mask = this.noise.noise2D(x,y)**3;
		base += this.noise.noise2D(x,y)**2 * 0.2 * mask;
		base += this.noise.noise2D(x*2,y*2)**2 * 0.2 * mask;
		v += base;
		v += this.noise.noise2D(x*6,y*6) * 0.02 * this.noise.noise2D(x,y)**2;
		v += this.noise.noise2D(x*10,y*10)**2 * 0.09 * base;
		v += this.noise.noise2D(x*20,y*20) * 0.1 * base;
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

		let texUint = 0;
		glw.gl.activeTexture(glw.gl.TEXTURE0 + texUint);
		glw.gl.bindTexture(glw.gl.TEXTURE_2D, this.rockTexture.texture);
		glw.gl.uniform1i(this.program.getUniformLocation('uRock'), texUint);

		texUint = 1;
		glw.gl.activeTexture(glw.gl.TEXTURE0 + texUint);
		glw.gl.bindTexture(glw.gl.TEXTURE_2D, this.grassTexture.texture);
		glw.gl.uniform1i(this.program.getUniformLocation('uGrass'), texUint);

		glw.gl.drawElements(glw.gl.TRIANGLES, this.vertexArray.getNumIndcies(), glw.gl.UNSIGNED_SHORT, 0);
	}

	setViewMatrix(m: mat4){
		this.viewMatrix = mat4.clone(m);
	}

	setProjectionMatrix(m: mat4){
		this.projectionMatrix = mat4.clone(m);
	}
}