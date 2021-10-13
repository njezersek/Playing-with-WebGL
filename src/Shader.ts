export default class Shader{
	vertexShader: WebGLShader;
	fragmentShader: WebGLShader;
	program: WebGLProgram;
	constructor(private gl: WebGL2RenderingContext, private vertexCode: string, private fragmentCode: string){
		this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexCode);
		this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentCode);

		// Create the shader program
		const shaderProgram = this.gl.createProgram();
		if(!shaderProgram) throw "Unable to initialize the shader program.";
		this.program = shaderProgram;

		this.gl.attachShader(shaderProgram, this.vertexShader);
		this.gl.attachShader(shaderProgram, this.fragmentShader);
		this.gl.linkProgram(shaderProgram);
		this.gl.deleteShader(this.vertexShader);
		this.gl.deleteShader(this.fragmentShader);

		// If creating the shader program failed, alert
		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			throw 'Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram);
		}
	}

	private loadShader(type: number, source: string) {
		const shader = this.gl.createShader(type);
		if(!shader) throw "Unable to create shader.";
	
		// Send the source to the shader object
		this.gl.shaderSource(shader, source);
	
		// Compile the shader program
		this.gl.compileShader(shader);
	
		// See if it compiled successfully
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			let error = this.gl.getShaderInfoLog(shader);
			this.gl.deleteShader(shader);
			throw 'An error occurred compiling the shaders: ' + error;
		}
	
		return shader;
	}

	enable(){
		this.gl.useProgram(this.program);
	}

	setUniformVectorFloat(name: string, data: Float32List){
		let location = this.gl.getUniformLocation(this.program, name);

		if(data.length == 1){
			this.gl.uniform1fv(location, data);
		}
		else if(data.length == 2){
			this.gl.uniform2fv(location, data);
		}
		else if(data.length == 3){
			this.gl.uniform3fv(location, data);
		}
		else if(data.length == 4){
			this.gl.uniform4fv(location, data);
		}
	}

	setUniformMatrixFloat(name: string, data: Float32List, transpose?: boolean){
		let location = this.gl.getUniformLocation(this.program, name);

		if(!transpose) transpose = false;
		if(data.length == 4){
			this.gl.uniformMatrix2fv(location, transpose, data);
		}
		else if(data.length == 9){
			this.gl.uniformMatrix3fv(location, transpose, data);
		}
		else if(data.length == 16){
			this.gl.uniformMatrix4fv(location, transpose, data);
		}
	}

	getAttributeLocation(name: string){
		return this.gl.getAttribLocation(this.program, name);
	}
}