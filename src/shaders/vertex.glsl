#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexcoord;

out vec3 aNormal;
out vec2 aTexcoord;
out float height;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;

void main() {
	height = aVertexPosition.y;
	aNormal = (uModelMatrix * vec4(aVertexNormal, 0)).xyz;
	aTexcoord = aVertexTexcoord;
	vec4 offset = vec4(float(gl_InstanceID)/100.0,0,0,0);
	gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix  * aVertexPosition + offset;
}