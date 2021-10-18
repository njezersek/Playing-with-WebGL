import { mat4, vec3, quat } from 'gl-matrix';

import Application from 'Application'
import Cube from 'Cube';
import Terrain from 'Terrain';
import Water from 'Water';
import Texture from 'Texture';
import Camera from 'Camera';

import rockTexturePath from 'textures/rock.jpg';
import grassTexturePath from 'textures/grass.jpg';

import texturePath from 'textures/rock.jpg';
import ChunkLoader from 'ChunkLoader';
import Chunk from 'Chunk';

class App extends Application{
	projectionMatrix = mat4.create();
	modelMatrix = mat4.create();
	viewMatrix = mat4.create();
	cube: Cube;
	water: Water;
	camera = new Camera();
	texture: Texture;

	chunkloader: ChunkLoader;

	rockTexture = new Texture(rockTexturePath);
	grassTexture = new Texture(grassTexturePath);

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);

		this.cube = new Cube();
		this.water = new Water();

		this.texture = new Texture(texturePath);

		this.chunkloader = new ChunkLoader(this.rockTexture, this.grassTexture);	
	}

	update(dt: number, t: number) : void {
		this.camera.update(dt,t);

		mat4.identity(this.viewMatrix);
		mat4.rotateX(this.viewMatrix, this.viewMatrix, this.camera.verticalAngle);
		mat4.rotateY(this.viewMatrix, this.viewMatrix, this.camera.horizontalAngle);
		mat4.translate(this.viewMatrix, this.viewMatrix, this.camera.pos);
	}

	render(dt: number, t: number): void {
		this.cube.setViewMatrix(this.viewMatrix);
		this.cube.render(dt, t);
		
		// render chunks
		for(let u=-3; u<=3; u++){	
			for(let v=-3; v<=3; v++){	
				let chunk = this.chunkloader.getCurrentChunk(this.camera.pos, u, v);
				chunk.setViewMatrix(this.viewMatrix);
				chunk.setProjectionMatrix(this.projectionMatrix);
				chunk.render(dt, t);
			}
		}

		this.water.setViewMatrix(this.viewMatrix);
		this.water.render(dt, t);
	}

	resize(width: number, height: number): void {
		const fieldOfView = 45 * Math.PI / 180; 
		const aspect = width / height;
		const zNear = 0.001;
		const zFar = 100.0;

		this.projectionMatrix = mat4.create();
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

		this.cube.setProjectionMatrix(this.projectionMatrix);
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