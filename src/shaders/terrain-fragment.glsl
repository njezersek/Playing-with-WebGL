#version 300 es

#define epsilon 0.1

precision highp float;
out vec4 Color;
in float scale; // scale of the ring
in float instanceID;
in vec3 normal;
in vec3 coordinate;

uniform float uIsLine;

vec3 light = vec3(0,-1,0);

float ramp(float x, float h, float w, float s){ // value, height, width, spread
	return 1./(1.+pow(abs((x-h)/w), s));
}

void main(){
	float i = mod(instanceID + 1., 4.)/4.;
	if(uIsLine < 0.5){
		Color = vec4(i-floor(i), i*2.-floor(i*2.), i*4.-floor(i*4.), .7);
		Color += 0.3;

		// compute light
		float l = max(dot(normal, light), 0.3);

		float height = coordinate.y;

		vec3 sand_color = vec3(0.91, 0.75, 0.41);
		vec3 grass_color = vec3(0.7, 0.85, 0.29);
		vec3 rock_color = vec3(0.71, 0.75, 0.75);
		vec3 snow_color = vec3(0.69, 0.78, 0.35);

		
		// mix color
		float steepnes = abs(dot(normal, vec3(0,-1,0)));
		vec3 c = sand_color + sin(height*10000.)*.01;
		c = mix(c, grass_color, ramp(height, 20., 15., 20.));
		c = mix(c, rock_color, ramp(steepnes, 0., 0.5, 30.0));
		c = mix(c, snow_color, ramp(height, 20., 5., 30.) * ramp(steepnes, 1., 0.3, 6.));

		Color = vec4(l*c, 1);
	}
	else{
		Color = vec4(1,1,1,1);
	}
}