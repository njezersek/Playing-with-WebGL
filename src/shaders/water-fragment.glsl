#version 300 es

precision highp float;
out vec4 Color;

in vec2 aTexcoord;

vec3 light = vec3(0,-1,1);

void main(){
	//float v = pow(abs(dot(normalize(gl_FragCoord.xyz), vec3(0,1,0))), 8.);
	vec3 water_color = vec3(0.23, 0.71, 0.9);
	Color = vec4(water_color, 0.4);
}