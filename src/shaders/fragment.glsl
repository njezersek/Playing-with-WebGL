#version 300 es

precision highp float;
out vec4 Color;

in vec3 aNormal;
in vec2 aTexcoord;
in float height;

uniform sampler2D uTex;

void main(){
	vec3 light = vec3(0,2,1);

	vec3 sand_color = vec3(0.91, 0.75, 0.41);
	vec3 grass1_color = vec3(0.44, 0.71, 0.13);
	vec3 grass2_color = vec3(0.42, 0.68, 0.14);
	vec3 rock_color = vec3(0.71, 0.75, 0.75);
	vec3 snow_color = vec3(1, 1, 1);

	float v = max(dot(normalize(light), normalize(aNormal)), .3);
	
	// mix color
	vec3 c = sand_color;
	float steepnes = abs(dot(normalize(aNormal), vec3(0,1,0)));
	if(height > 0.015 + (sin(aTexcoord.x*300.) + sin(aTexcoord.y*302.)) * (.001/steepnes)){
		c = mix(grass1_color, grass2_color, pow(abs(sin(aTexcoord.x * 1006. * steepnes) * sin(aTexcoord.y * 1000. * steepnes)), 2.));
	}
	if(steepnes < 0.4 || height > 0.07 + sin(aTexcoord.x*500.)*0.002 + sin(aTexcoord.y*502.)*0.002){
		//c = rock_color * steepnes; //* (1.+sin((height+sin(aTexcoord.x*300.)*sin(aTexcoord.y*300.)*.001)*3000.)*.1);
		c = texture(uTex, aTexcoord.xy*10.).xyz;
	}
	if(height > (0.1 + sin(aTexcoord.x*500.)*0.002 + sin(aTexcoord.y*502.)*0.002) && steepnes > 0.3){
		c = texture(uTex, aTexcoord.xy*10. + .34).xyz + 0.7;
	}

	Color = vec4(c * v, 1);
}