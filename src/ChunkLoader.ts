import Chunk from 'Chunk';
import { vec3 } from 'gl-matrix';

export default class ChunkLoader{
	chunkSize = 1;
	cache = new Map<string, Chunk>();
	constructor(){
		
	}

	getCurrentChunk(pos: vec3){
		let u = Math.round(pos[0]/this.chunkSize); 
		let v = Math.round(pos[2]/this.chunkSize); 

		let chunk = this.cache.get(`${u},${v}`);
		if(chunk) return chunk;

		console.log("New chunk", u, v);

		chunk = new Chunk(u, v);
		this.cache.set(`${u},${v}`, chunk);
		return chunk;
	}
}