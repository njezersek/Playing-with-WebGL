export let glw: WebGLw;
export default class WebGLw{
	gl: WebGL2RenderingContext;

	constructor(public canvas: HTMLCanvasElement){
		let gl = canvas.getContext('webgl2', {
			premultipliedAlpha: true
		});
		if(!gl) throw "WebGL in not supported in this browser!";
		this.gl = gl;

		glw = this;
	}

	clearCanvas(){
		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		this.gl.clearDepth(1.0);                 // Clear everything
		this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

		// Clear the canvas before we start drawing on it.
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	resize(){
		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
	}

	drawTriangles(n: number){
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, n);
	}
}
