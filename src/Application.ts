import WebGLw, { glw } from "WebGLw";

/*
This class handles resizing and basic geme tick.
*/
export default abstract class Application{
	private running = false;
	private prevTick = 0;
	protected pointerStatus: "locked" | "unlocked";

	constructor(protected canvas: HTMLCanvasElement){
		new WebGLw(canvas);
		window.addEventListener('resize', e => this.resizeHandle());

		this.pointerStatus = "unlocked";

		this.canvas.addEventListener("click", e => this.requestPointerLock());

		document.addEventListener('pointerlockchange', e => this.lockChangeHandle(e), false);
		document.addEventListener('mozpointerlockchange',  e => this.lockChangeHandle(e), false);

		document.addEventListener('keydown', e => {
			if(this.pointerStatus == "unlocked") return;
			this.onKeyDown(e);
		});

		document.addEventListener('keyup', e => {
			if(this.pointerStatus == "unlocked") return;
			this.onKeyUp(e);
		})
	}

	private lockChangeHandle(e: Event){
		if (document.pointerLockElement === this.canvas) {
			console.log('The pointer lock status is now locked');
			this.canvas.onmousemove = e => this.onMouseMove(e);
			this.pointerStatus = "locked";
		} else {
			console.log('The pointer lock status is now unlocked');
			this.pointerStatus = "unlocked";
			this.canvas.onmousemove = null;
		}
	}

	private requestPointerLock(){
		if(this.pointerStatus == "unlocked"){
			console.log("request pointer lock");
			this.canvas.requestPointerLock();
		}
	}

	private tick(t: number){
		const delta = t - this.prevTick;
		this.prevTick = t;
		glw.clearCanvas();
		this.update(delta, t);
		this.render(delta, t);
		if(this.running){
			window.requestAnimationFrame(t => this.tick(t))
		}
	}
	
	private resizeHandle(){
		if(this.canvas.width !== window.innerWidth || this.canvas.height !== window.innerHeight){
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			
			glw.resize();
			
			this.resize(window.innerWidth, window.innerHeight);
		}
	}
	
	start(){
		this.running = true;
		this.resizeHandle();
		
		this.tick(0);
	}
	
	stop(){
		this.running = false;
	}

	// handle mouse move
	abstract onMouseMove(e: MouseEvent) : void;

	abstract onKeyDown(e: KeyboardEvent) : void;
	abstract onKeyUp(e: KeyboardEvent) : void;

	// update code (input, animations, AI ...)
	abstract update(dt: number, t: number) : void;

	// render code (gl API calls)
	abstract render(dt: number, t: number) : void;

	// resize code (e.g. update projection matrix)
	abstract resize(width: number, height: number) : void;
}