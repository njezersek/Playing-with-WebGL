#version 300 es

precision highp float;
out vec4 Color;

in vec2 aTexcoord;
in float terrainHeight;

vec3 light = vec3(0,-1,1);

void main(){
	//float v = pow(abs(dot(normalize(gl_FragCoord.xyz), vec3(0,1,0))), 8.);
	vec3 water_color = vec3(0.23, 0.71, 0.9);
	vec3 foam_color = vec3(1,1,1);
	Color = vec4(mix(water_color, foam_color, abs(sin(terrainHeight*10.))*exp(-terrainHeight/1.)*.7), 0.9);
}