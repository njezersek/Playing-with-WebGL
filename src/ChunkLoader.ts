import Chunk from 'Chunk';
import { vec2, vec3 } from 'gl-matrix';
import Texture from 'Texture';

export default class ChunkLoader{
	chunkSize = 1;
	cache = new Map<string, Chunk>();
	tmp?: Chunk;
	constructor(private rockTexture: Texture, private grassTexture: Texture){
		
	}

	getCurrentChunk(pos: vec3, offsetU: number, offsetV: number){
		let u = Math.floor(pos[0]/this.chunkSize)+1 + offsetU; 
		let v = Math.floor(pos[2]/this.chunkSize)+1 + offsetV; 

		let chunk = this.cache.get(`${u},${v}`);
		if(chunk) return chunk;

		console.log("New chunk", u, v);

		chunk = new Chunk(u, v, this.rockTexture, this.grassTexture);
		this.cache.set(`${u},${v}`, chunk);
		this.tmp = chunk;
		return chunk;
	}
}