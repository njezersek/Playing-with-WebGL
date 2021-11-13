#version 300 es

in vec4 aVertexPosition;
in vec2 aVertexTexcoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uPlayerPosition;


void main() {
	// compute vertex position
	vec4 v = aVertexPosition;
	// scale
	v.xz *= 10.;
	v.xz -= 5.;

	//v.xz += -uPlayerPosition.xz; // move grid to player with step size acdording to scale 

	// compute height
	v.y = 1.;
	gl_Position = uProjectionMatrix * uViewMatrix * v;
}