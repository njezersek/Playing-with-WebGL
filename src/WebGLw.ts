export default class WebGLw{
	gl: WebGLRenderingContext;
	program?: WebGLProgram;
	attributeBuffers: Set<WebGLwAttributeBuffer> = new Set();

	constructor(public canvas: HTMLCanvasElement){
		let gl = canvas.getContext('webgl');
		if(!gl) throw "WebGL in not supported in this browser!";
		this.gl = gl;
	}

	useProgram(program: WebGLProgram){
		if(this.program === program) return;
		this.program = program;
		this.gl.useProgram(program);
	}

	addAttributeBuffer(buffer: WebGLwAttributeBuffer){
		if(!this.program) throw "No program selected! Before you can add an attribute buffer you need a program.";

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);
		const bufferPosition = this.gl.getAttribLocation(this.program, buffer.name);
		this.gl.vertexAttribPointer(
			bufferPosition,
			buffer.numComponents, // number of components per vertex
			this.gl.FLOAT, // data type
			false, // normalized
			0, // strinde
			0 // offste
		);
		this.gl.enableVertexAttribArray(bufferPosition);

		this.attributeBuffers.add(buffer);
	}

	setUniformVectorFloat(name: string, data: Float32List){
		if(!this.program) throw "No program selected! Before you can add an attribute buffer you need a program.";

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
		if(!this.program) throw "No program selected! Before you can add an attribute buffer you need a program.";

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

	createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader){
		const program = this.gl.createProgram();

		if(!program) throw "Unable to initalize the shader program";

		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)){
			throw "Unable to initialize the shader program " + this.gl.getProgramInfoLog(program);
		}

		return program;
	}

	createAttributeBuffer(name: string, numComponents: number, data: Float32Array){
		return new WebGLwAttributeBuffer(this.gl, name, numComponents, data);
	}

	loadShader(type: "vertex" | "fragment", source: string) {
		let t = type == "fragment" ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER;
		const shader = this.gl.createShader(t);
		if(!shader) throw "Unable to create the shader program!";

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
	
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw 'An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader);
		}
	
		return shader;
	}

	drawTriangles(n: number){
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, n);
	}
}

export class WebGLwAttributeBuffer{
	attributeData: Float32Array;
	buffer: WebGLBuffer;

	constructor(public gl: WebGLRenderingContext, public name: string, public numComponents: number, data?: Float32Array){
		let buffer = gl.createBuffer();
		if(!buffer) throw "Unable to create attribute buffer!";
		this.buffer = buffer;

		if(data){
			this.attributeData = data;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.attributeData, gl.STATIC_DRAW);
		}
		else{
			this.attributeData = new Float32Array();
		}
	}
}