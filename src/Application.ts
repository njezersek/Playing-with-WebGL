import WebGLw from "WebGLw";
/*
This class handles resizing and basic geme tick.
*/
export default abstract class Application{
	private running = false;
	private prevTick = 0;
	protected w: WebGLw;
	protected gl: WebGL2RenderingContext;

	constructor(protected canvas: HTMLCanvasElement){
		this.w = new WebGLw(canvas);
		this.gl = this.w.gl;
		window.addEventListener('resize', e => this.resizeHandle());
	}
	
	private tick(t: number){
		const delta = t - this.prevTick;
		this.prevTick = t;
		this.w.clearCanvas();
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

			this.w.resize();

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

	// update code (input, animations, AI ...)
	abstract update(dt: number, t: number) : void;

	// render code (gl API calls)
	abstract render(dt: number, t: number) : void;

	// resize code (e.g. update projection matrix)
	abstract resize(width: number, height: number) : void;
}