import RenderingObjecs from "RenderingObject";
import Terrain from "Terrain";
import WebGLw from "WebGLw";

export default class Chunk extends RenderingObjecs{
	terrain: Terrain;
	
	constructor(private w: WebGLw, private u: number, private v: number){
		super();
		this.terrain = new Terrain(this.w);
	}

	render(dt: number, t: number){
		this.terrain.setViewMatrix(this.viewMatrix);
		this.terrain.render(dt, t);
	}
}