export default class VertexArray{
	vertexArrayObject: WebGLVertexArrayObject;
	vertexBuffers: Map<number, WebGLBuffer> = new Map();
	indexBuffer?: WebGLBuffer;
	numIndices: number = 0;
	numVertecies: number = 0;

	constructor(private gl: WebGL2RenderingContext){
		let vao = this.gl.createVertexArray();
		if(!vao)throw "Can't create vertex array object.";
		this.vertexArrayObject = vao;
	}

	enable(){
		this.gl.bindVertexArray(this.vertexArrayObject);
	}

	addVertexBuffer(location: number, data: Float32Array, numComponents: number){
		this.numVertecies = data.length / numComponents;

		this.enable();

		const buffer = this.gl.createBuffer();
		if(!buffer) throw "Unable to create buffer.";

		this.vertexBuffers.set(location, buffer);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
		this.gl.enableVertexAttribArray(location);
		this.gl.vertexAttribPointer(
			location,
			numComponents, // num compenents
			this.gl.FLOAT, // type
			false, // normalize
			0, // stride
			0 // offset
		);
	}

	setIndexBuffer(data: Uint16Array){
		this.enable();

		const buffer = this.gl.createBuffer();
		if(!buffer) throw "Unable to create buffer.";

		this.indexBuffer = buffer;
		this.numIndices = data.length;

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
	}
}