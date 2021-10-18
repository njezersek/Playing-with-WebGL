import { mat4, vec3, quat } from 'gl-matrix';

import Application from 'Application'
import Shader from 'Shader';
import VertexArray from 'VertexArray';
import Cube from 'Cube';
import Terrain from 'Terrain';
import Water from 'Water';
import Texture from 'Texture';

import vertexShaderCode from 'shaders/vertex.glsl';
import fragmentShaderCodeA from 'shaders/fragment.glsl';
import fragmentShaderCodeB from 'shaders/fragmentSolidWhite.glsl';

import texturePath from 'textures/rock.jpg';

class Camera{
	private _horizontalAngle = 0;
	private _verticalAngle = Math.PI/8;
	public forwardVelocity = 0;
	public sidewaysVelocity = 0;
	public verticalVelocity = 0;
	pos = vec3.fromValues(0,-2,0);
	speed = 0.05;

	public update(dt: number, t: number){
		let cameraDirMat = mat4.create();
		mat4.rotateY(cameraDirMat, cameraDirMat, -this.horizontalAngle);
		//mat4.rotateX(cameraDirMat, cameraDirMat, -this.verticalAngle);
		let cameraDir = vec3.fromValues(0,0,1);	
		let up = vec3.fromValues(0,1,0);
		let sideways = vec3.create();
		vec3.transformMat4(cameraDir, cameraDir, cameraDirMat);
		vec3.normalize(cameraDir, cameraDir);
		
		vec3.cross(sideways, cameraDir, up);
		vec3.normalize(sideways, sideways);

		vec3.scale(cameraDir, cameraDir, this.forwardVelocity * this.speed);
		vec3.add(this.pos, this.pos, cameraDir);

		vec3.scale(sideways, sideways, this.sidewaysVelocity * this.speed);
		vec3.add(this.pos, this.pos, sideways);

		vec3.scale(up, up, this.verticalVelocity * -this.speed);
		vec3.add(this.pos, this.pos, up);
	}

	get horizontalAngle(){
		return this._horizontalAngle;
	}

	set horizontalAngle(angle: number){
		const k = 2*Math.PI;
		this._horizontalAngle = (angle % k + k) % k;
	}

	get verticalAngle(){
		return this._verticalAngle;
	}

	set verticalAngle(angle: number){
		if(angle > Math.PI/2) angle = Math.PI/2;
		if(angle < -Math.PI/2) angle = -Math.PI/2;
		this._verticalAngle = angle;
	}
}

class App extends Application{
	programInfoA: Shader;
	programInfoB: Shader;
	projectionMatrix = mat4.create();
	modelMatrix = mat4.create();
	viewMatrix = mat4.create();
	vaoSquare: VertexArray;
	vaoDeltoid: VertexArray;
	cube: Cube;
	terrain: Terrain;
	water: Water;
	camera = new Camera();

	texture: Texture;

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

		this.cube = new Cube(this.w);
		this.terrain = new Terrain(this.w);
		this.water = new Water(this.w);

		this.texture = new Texture(this.w, texturePath);
		
		console.log("gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS", this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		console.log("tex", texturePath);
	}

	onMouseMove(e: MouseEvent){
		const mouseSpeed = 0.001;

		this.camera.horizontalAngle += e.movementX * mouseSpeed;
		this.camera.verticalAngle += e.movementY * mouseSpeed;
		
	}

	onKeyDown(e: KeyboardEvent) {
		if(e.key == 'w') this.camera.forwardVelocity = 1;
		if(e.key == 's') this.camera.forwardVelocity = -1;
		if(e.key == 'a') this.camera.sidewaysVelocity = -1;
		if(e.key == 'd') this.camera.sidewaysVelocity = 1;
		if(e.key == 'Shift') this.camera.verticalVelocity = -1;
		if(e.key == ' ') this.camera.verticalVelocity = 1;
	}
	
	onKeyUp(e: KeyboardEvent) {
		if(e.key == 'w' || e.key == 's') this.camera.forwardVelocity = 0;
		if(e.key == 'a' || e.key == 'd') this.camera.sidewaysVelocity = 0;
		if(e.key == 'Shift' || e.key == ' ') this.camera.verticalVelocity = 0;
	}

	update(dt: number, t: number) : void {
		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [3.0, 1.0, -10.0]);
		mat4.rotateY(this.modelMatrix, this.modelMatrix, -Math.PI/4+t/1000);
		mat4.rotateZ(this.modelMatrix, this.modelMatrix, -Math.PI/8+t/2000);

		this.programInfoA.enable();
		this.programInfoA.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);		
		this.programInfoA.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);		

		mat4.identity(this.modelMatrix);
		mat4.translate(this.modelMatrix, this.modelMatrix, [-0.0, 0.0, -15.0]);
		mat4.scale(this.modelMatrix, this.modelMatrix, new Float32Array([4,4,4]))
		
		this.programInfoB.enable();
		this.programInfoB.setUniformMatrixFloat('uModelMatrix', this.modelMatrix);
		this.programInfoB.setUniformMatrixFloat('uViewMatrix', this.viewMatrix);	
		
		
		this.camera.update(dt,t);

		mat4.identity(this.viewMatrix);
		mat4.rotateX(this.viewMatrix, this.viewMatrix, this.camera.verticalAngle);
		mat4.rotateY(this.viewMatrix, this.viewMatrix, this.camera.horizontalAngle);
		mat4.translate(this.viewMatrix, this.viewMatrix, this.camera.pos);
		
	}

	render(dt: number, t: number): void {
		//console.log(1000/delta);
		// draw with program A
		this.programInfoA.enable();
		this.vaoSquare.enable();
		this.gl.drawElements(this.gl.TRIANGLES, this.vaoSquare.getNumIndcies(), this.gl.UNSIGNED_SHORT, 0);
		
		// draw with program B
		this.programInfoB.enable();
		this.vaoDeltoid.enable();
		
		const texUint = 0;
		this.gl.activeTexture(this.gl.TEXTURE0 + texUint);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);
		this.gl.uniform1i(this.programInfoB.getUniformLocation('uTex'), texUint);

		this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, this.vaoDeltoid.getNumVertecies(), 1);

		this.cube.setViewMatrix(this.viewMatrix);
		//this.cube.render(dt, t);

		this.water.setViewMatrix(this.viewMatrix);
		this.water.render(dt, t);

		this.terrain.setViewMatrix(this.viewMatrix);
		this.terrain.render(dt, t);
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

		this.cube.setProjectionMatrix(this.projectionMatrix);
		this.terrain.setProjectionMatrix(this.projectionMatrix);
		this.water.setProjectionMatrix(this.projectionMatrix);
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