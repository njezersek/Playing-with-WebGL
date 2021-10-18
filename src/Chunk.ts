import RenderingObjecs from "RenderingObject";
import Terrain from "Terrain";
import { glw } from "WebGLw";

export default class Chunk extends RenderingObjecs{
	terrain: Terrain;

	constructor(private u: number, private v: number){
		super();
		this.terrain = new Terrain();
	}

	render(dt: number, t: number){
		this.terrain.setViewMatrix(this.viewMatrix);
		this.terrain.render(dt, t);
	}
}