#version 300 es

layout(location = 0) in vec4 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main() {
	vec4 offset = vec4(float(gl_InstanceID)/100.0,0,0,0);
	gl_Position = uProjectionMatrix * uModelViewMatrix  * aVertexPosition + offset;
}