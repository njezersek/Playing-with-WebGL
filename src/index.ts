import { mat4 } from 'gl-matrix';

import Application from 'Application'
import Camera from 'Camera';
import Water from 'Water';
import Terrain from 'Terrain';

class App extends Application{
	terrain: Terrain;
	water: Water;
	camera = new Camera();

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);

		this.terrain = new Terrain(this.camera);
		this.water = new Water(this.camera);
	}

	update(dt: number, t: number) : void {
		this.camera.update(dt,t);
	}

	render(dt: number, t: number): void {
		this.terrain.render(dt, t);
		this.water.render(dt, t);
	}

	resize(width: number, height: number): void {
		this.camera.resize(width, height);
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