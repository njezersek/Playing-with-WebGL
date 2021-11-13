import { mat4 } from 'gl-matrix';

import Application from 'Application'
import Camera from 'Camera';
import Water from 'Water';
import Terrain from 'Terrain';

class App extends Application{
	projectionMatrix = mat4.create();
	modelMatrix = mat4.create();
	viewMatrix = mat4.create();
	terrain: Terrain;
	water: Water;
	camera = new Camera();

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);

		this.terrain = new Terrain();
		this.water = new Water();

	}

	update(dt: number, t: number) : void {
		this.camera.update(dt,t);

		mat4.identity(this.viewMatrix);
		mat4.rotateX(this.viewMatrix, this.viewMatrix, this.camera.verticalAngle);
		mat4.rotateY(this.viewMatrix, this.viewMatrix, this.camera.horizontalAngle);
		mat4.translate(this.viewMatrix, this.viewMatrix, this.camera.pos);

		this.terrain.setPlayerPosition(this.camera.pos);
		this.water.setPlayerPosition(this.camera.pos);
	}

	render(dt: number, t: number): void {
		this.terrain.setViewMatrix(this.viewMatrix);
		this.terrain.render(dt, t);

		this.water.setViewMatrix(this.viewMatrix);
		this.water.render(dt, t);
	}

	resize(width: number, height: number): void {
		const fieldOfView = 45 * Math.PI / 180; 
		const aspect = width / height;
		const zNear = 1.;
		const zFar = 1000.0;

		this.projectionMatrix = mat4.create();
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

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