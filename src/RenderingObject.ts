abstract class RenderingObject{
	constructor(private gl: WebGL2RenderingContext){
		
	}

	abstract initBuffers() : void;

	abstract render() : void;
}