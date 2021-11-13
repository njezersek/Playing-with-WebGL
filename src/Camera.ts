import { mat4, vec3, quat } from 'gl-matrix';

export default class Camera{
	private _horizontalAngle = 0;
	private _verticalAngle = Math.PI/8;
	public forwardVelocity = 0;
	public sidewaysVelocity = 0;
	public verticalVelocity = 0;
	pos = vec3.fromValues(0,-2,0);
	speed = 0.9;

	public update(dt: number, t: number){
		let cameraDirMat = mat4.create();
		mat4.rotateY(cameraDirMat, cameraDirMat, -this.horizontalAngle);
		//mat4.rotateX(cameraDirMat, cameraDirMat, -this.verticalAngle);
		let cameraDir = vec3.fromValues(0,0,1);	
		let up = vec3.fromValues(0,1,0);
		let sideways = vec3.create();
		vec3.transformMat4(cameraDir, cameraDir, cameraDirMat);
		vec3.normalize(cameraDir, cameraDir);
		
		vec3.cross(sideways, cameraDir, up);
		vec3.normalize(sideways, sideways);

		vec3.scale(cameraDir, cameraDir, this.forwardVelocity * this.speed);
		vec3.add(this.pos, this.pos, cameraDir);

		vec3.scale(sideways, sideways, this.sidewaysVelocity * this.speed);
		vec3.add(this.pos, this.pos, sideways);

		vec3.scale(up, up, this.verticalVelocity * -this.speed);
		vec3.add(this.pos, this.pos, up);
	}

	get horizontalAngle(){
		return this._horizontalAngle;
	}

	set horizontalAngle(angle: number){
		const k = 2*Math.PI;
		this._horizontalAngle = (angle % k + k) % k;
	}

	get verticalAngle(){
		return this._verticalAngle;
	}

	set verticalAngle(angle: number){
		if(angle > Math.PI/2) angle = Math.PI/2;
		if(angle < -Math.PI/2) angle = -Math.PI/2;
		this._verticalAngle = angle;
	}
}