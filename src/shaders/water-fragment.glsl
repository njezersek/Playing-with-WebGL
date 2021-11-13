#version 300 es

precision highp float;
out vec4 Color;

in vec2 aTexcoord;
in float terrainHeight;
in float overlap;

uniform float uTime;

vec3 light = vec3(0,-1,1);

void main(){
	//float v = pow(abs(dot(normalize(gl_FragCoord.xyz), vec3(0,1,0))), 8.);
	vec3 water_color = vec3(0.25, 0.65, 0.87);
	vec3 foam_color = vec3(1,1,1);
	Color = vec4(mix(water_color, foam_color, abs(sin(terrainHeight*10. - sin(uTime/500.)*2.))*exp(-terrainHeight/1.)*.7), 0.9);
	if(overlap>=1.0){
		Color = vec4(1,0,0,0);
	}
}