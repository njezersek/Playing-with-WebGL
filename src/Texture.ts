import WebGLw from "WebGLw";

export default class Texture{
	texture: WebGLTexture;
	private gl: WebGL2RenderingContext;
	constructor(private w: WebGLw, src: string){
		this.gl = w.gl;

		let texture = w.gl.createTexture();
		if(!texture) throw "Can't create texture.";
		this.texture = texture;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

		// set one blue pixel
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);

		// Asynchronously load an image
		var image = new Image();
		console.log("src", src);
		image.src = src;
		image.addEventListener('load', () => {
			console.log(image, "loaded");
			// Now that the image has loaded make copy it to the texture.
			this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,this.gl.UNSIGNED_BYTE, image);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
		});
	}

	enable(){

	}
}