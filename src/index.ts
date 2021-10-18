import { mat4, vec3, quat } from 'gl-matrix';

import Application from 'Application'
import Cube from 'Cube';
import Terrain from 'Terrain';
import Water from 'Water';
import Texture from 'Texture';
import Camera from 'Camera';

import texturePath from 'textures/rock.jpg';
import ChunkLoader from 'ChunkLoader';

class App extends Application{
	projectionMatrix = mat4.create();
	modelMatrix = mat4.create();
	viewMatrix = mat4.create();
	cube: Cube;
	terrain: Terrain;
	water: Water;
	camera = new Camera();
	texture: Texture;

	chunkloader: ChunkLoader;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);

		this.cube = new Cube(this.w);
		this.terrain = new Terrain(this.w);
		this.water = new Water(this.w);

		this.texture = new Texture(this.w, texturePath);

		this.chunkloader = new ChunkLoader(this.w);
		
		console.log("gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS", this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		console.log("tex", texturePath);
	}

	update(dt: number, t: number) : void {
		this.camera.update(dt,t);

		mat4.identity(this.viewMatrix);
		mat4.rotateX(this.viewMatrix, this.viewMatrix, this.camera.verticalAngle);
		mat4.rotateY(this.viewMatrix, this.viewMatrix, this.camera.horizontalAngle);
		mat4.translate(this.viewMatrix, this.viewMatrix, this.camera.pos);

		this.chunkloader.getCurrentChunk(this.camera.pos);
	}

	render(dt: number, t: number): void {
		this.cube.setViewMatrix(this.viewMatrix);
		this.cube.render(dt, t);

		this.terrain.setViewMatrix(this.viewMatrix);
		this.terrain.render(dt, t);

		this.water.setViewMatrix(this.viewMatrix);
		this.water.render(dt, t);
	}

	resize(width: number, height: number): void {
		const fieldOfView = 45 * Math.PI / 180; 
		const aspect = width / height;
		const zNear = 0.1;
		const zFar = 100.0;

		this.projectionMatrix = mat4.create();
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

		this.cube.setProjectionMatrix(this.projectionMatrix);
		this.terrain.setProjectionMatrix(this.projectionMatrix);
		this.water.setProjectionMatrix(this.projectionMatrix);
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
}

document.addEventListener('DOMContentLoaded', () => {
	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	document.body.style.margin = "0px";
	document.body.style.overflow = "hidden";
    const app = new App(canvas);

	app.start();
});