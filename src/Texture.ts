import { glw } from 'WebGLw';

export default class Texture{
	texture: WebGLTexture;
	constructor(src: string){

		let texture = glw.gl.createTexture();
		if(!texture) throw "Can't create texture.";
		this.texture = texture;
		glw.gl.bindTexture(glw.gl.TEXTURE_2D, this.texture);

		// set one blue pixel
		glw.gl.texImage2D(glw.gl.TEXTURE_2D, 0, glw.gl.RGBA, 1, 1, 0, glw.gl.RGBA, glw.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

		//glw.gl.texParameteri(glw.gl.TEXTURE_2D, glw.gl.TEXTURE_MIN_FILTER, glw.gl.LINEAR);
		//glw.gl.texParameteri(glw.gl.TEXTURE_2D, glw.gl.TEXTURE_MAG_FILTER, glw.gl.NEAREST_MIPMAP_LINEAR );
		glw.gl.texParameteri(glw.gl.TEXTURE_2D, glw.gl.TEXTURE_WRAP_S, glw.gl.MIRRORED_REPEAT);
		glw.gl.texParameteri(glw.gl.TEXTURE_2D, glw.gl.TEXTURE_WRAP_T, glw.gl.MIRRORED_REPEAT);

		// Asynchronously load an image
		var image = new Image();
		console.log("src", src);
		image.src = src;
		image.addEventListener('load', () => {
			console.log(image, "loaded");
			// Now that the image has loaded make copy it to the texture.
			glw.gl.bindTexture(glw.gl.TEXTURE_2D, texture);
			glw.gl.texImage2D(glw.gl.TEXTURE_2D, 0, glw.gl.RGBA, glw.gl.RGBA,glw.gl.UNSIGNED_BYTE, image);
			glw.gl.generateMipmap(glw.gl.TEXTURE_2D);
		});
	}
}