import { mat4, vec3, quat } from 'gl-matrix';

export default class Camera{
	private _horizontalAngle = 0;
	private _verticalAngle = Math.PI/8;

	public projectionMatrix = mat4.create();
	public viewMatrix = mat4.create();
	
	public forwardVelocity = 0;
	public sidewaysVelocity = 0;
	public verticalVelocity = 0;

	public position = vec3.fromValues(0,-2,0);
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
		vec3.add(this.position, this.position, cameraDir);

		vec3.scale(sideways, sideways, this.sidewaysVelocity * this.speed);
		vec3.add(this.position, this.position, sideways);

		vec3.scale(up, up, this.verticalVelocity * -this.speed);
		vec3.add(this.position, this.position, up);

		// compute the view matrix
		mat4.identity(this.viewMatrix);
		mat4.rotateX(this.viewMatrix, this.viewMatrix, this.verticalAngle);
		mat4.rotateY(this.viewMatrix, this.viewMatrix, this.horizontalAngle);
		mat4.translate(this.viewMatrix, this.viewMatrix, this.position);
	}

	public resize(width: number, height: number){
		const fieldOfView = 45 * Math.PI / 180; 
		const aspect = width / height;
		const zNear = 1.;
		const zFar = 1000.0;

		this.projectionMatrix = mat4.create();
		mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);
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