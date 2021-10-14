#version 300 es

precision highp float;
out vec4 Color;

in vec3 aNormal;
in vec2 aTexcoord;

uniform vec2 uScreenSize;

void main(){
	vec3 light = vec3(0,2,1);
	float v = max(dot(normalize(light), normalize(aNormal)), .1);
	//Color = vec4(gl_FragCoord.x/uScreenSize.x, gl_FragCoord.y/uScreenSize.y, v, 1.0);
	Color = vec4(aTexcoord.x*v, aTexcoord.y*v, 1.*v, 1.0);
}