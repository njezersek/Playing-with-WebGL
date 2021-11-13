#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexcoord;

out float scale;
out float instanceID;
out float terrainHeight;
out float overlap;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uPlayerPosition;

void main() {
	// compute vertex position
	vec4 v = aVertexPosition;
	//player = vec2(0);
	v.xz *= 512.*4.;  // scale the ring
	v.xz += -uPlayerPosition.xz; // move grid to player with step size acdording to scale 

	// compute height
	v.y = 1.;

	gl_Position = uProjectionMatrix * uViewMatrix * v;
}