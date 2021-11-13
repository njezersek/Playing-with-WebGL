#version 300 es

precision highp float;
out vec4 Color;
in float scale; // scale of the ring
in float instanceID;

uniform float uIsLine;

void main(){
	float i = mod(instanceID + 1., 4.)/4.;
	if(uIsLine < 0.5){
		Color = vec4(i-floor(i), i*2.-floor(i*2.), i*4.-floor(i*4.), .7);
		Color += 0.3;
		//Color = vec4(0.5,0.5,0.5,1.);
	}
	else{
		Color = vec4(1,1,1,1);
	}
}