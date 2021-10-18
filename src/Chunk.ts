import RenderingObjecs from "RenderingObject";
import Terrain from "Terrain";
import Texture from "Texture";
import Water from "Water";
import { glw } from "WebGLw";

export default class Chunk extends RenderingObjecs{
	terrain: Terrain;

	constructor(u: number, v: number, rockTexture: Texture, grassTexture: Texture){
		super();
		this.terrain = new Terrain(u, v, rockTexture, grassTexture);
	}

	render(dt: number, t: number){
		this.terrain.setViewMatrix(this.viewMatrix);
		this.terrain.setProjectionMatrix(this.projectionMatrix);
		this.terrain.render(dt, t);
	}
}