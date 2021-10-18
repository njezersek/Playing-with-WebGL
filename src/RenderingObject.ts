import { mat4 } from 'gl-matrix';

export default abstract class RenderingObjecs{
	protected viewMatrix = mat4.create();
	protected projectionMatrix = mat4.create();

	abstract render(dt: number, t: number) : void;

	setViewMatrix(m: mat4){
		this.viewMatrix = mat4.clone(m);
	}

	setProjectionMatrix(m: mat4){
		this.projectionMatrix = mat4.clone(m);
	}
}