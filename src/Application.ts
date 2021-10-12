export default abstract class Application{
	private running = false;
	private prevTick = 0;
	protected gl: WebGL2RenderingContext;

	constructor(protected canvas: HTMLCanvasElement){
		const gl = canvas.getContext("webgl2");

		if(!gl){
			throw "Unable to initalize WebGL.";
		}

		this.gl = gl;

		window.addEventListener('resize', e => this.resizeHandle());
	}
	
	private tick(t: number){
		const delta = t - this.prevTick;
		this.prevTick = t;
		this.clearCanvas();
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

			this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

			this.resize(this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
		}
	}

	private clearCanvas(){
		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		this.gl.clearDepth(1.0);                 // Clear everything
		this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
		this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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
	abstract update(delta: number, t: number) : void;

	// render code (gl API calls)
	abstract render(delta: number, t: number) : void;

	// resize code (e.g. update projection matrix)
	abstract resize(width: number, height: number) : void;
}