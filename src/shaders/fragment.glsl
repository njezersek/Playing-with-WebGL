#version 300 es

precision highp float;
out vec4 Color;

in vec3 aNormal;
in vec2 aTexcoord;
in float height;

uniform sampler2D uRock;
uniform sampler2D uGrass;

float sinn(vec2 p, float f, float a){
	return (sin(p.x * f) + sin(p.y * f)) * a;
}

float sinnn(vec2 p, float f, float a){
	return (sinn(p, f, a) + sinn(p, f+13., a) + sinn(p, f+23., a))/3.;
}

float ramp(float x, float h, float w, float s){
	return 1./(1.+pow(abs((x-h)/w), s));
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(){
	vec3 light = vec3(0,2,1);

	vec3 sand_color = vec3(0.91, 0.75, 0.41);
	vec3 grass1_color = vec3(0.44, 0.71, 0.13);
	vec3 grass2_color = vec3(0.42, 0.68, 0.14);
	vec3 rock_color = vec3(0.71, 0.75, 0.75);
	vec3 snow_color = vec3(1, 1, 1);

	float v = max(dot(normalize(light), normalize(aNormal)), .3);
	
	// mix color
	float steepnes = abs(dot(normalize(aNormal), vec3(0,1,0)));
	vec3 c = sand_color + sin(height*10000. + sinn(aTexcoord, 500., 1.))*.01;
	c = mix(c, texture(uGrass, aTexcoord.xy*100.).xyz, ramp(height + snoise(aTexcoord * 10.)*.01, 0.06, 0.04, 10.));
	//c = mix(c, texture(uRock, aTexcoord.xy*10.).xyz, ramp(0.05 + sinnn(aTexcoord, 300., 0.001), 0.02, 10.));
	c = mix(c, texture(uRock, aTexcoord.xy*10.).xyz, ramp(steepnes + sinnn(aTexcoord, 100., .0), .2, 0.6, 40.));
	c = mix(c, snow_color, ramp(height + snoise(aTexcoord * 50.)*.01, 0.2, 0.1, 6.) * ramp(steepnes + sinnn(aTexcoord, 100., .01), 1., 0.3, 6.));
	/*
	if(height > 0.015 + (sin(aTexcoord.x*300.) + sin(aTexcoord.y*302.)) * (.001/steepnes)){
		c = mix(grass1_color, grass2_color, pow(abs(sin(aTexcoord.x * 1006. * steepnes) * sin(aTexcoord.y * 1000. * steepnes)), 2.));
	}
	if(steepnes < 0.4 || height > 0.07 + sinn(aTexcoord, 200., 0.006) + sinn(aTexcoord, 3000., 0.0003)){
		//c = rock_color * steepnes; //* (1.+sin((height+sin(aTexcoord.x*300.)*sin(aTexcoord.y*300.)*.001)*3000.)*.1);
		c = texture(uTex, aTexcoord.xy*10.).xyz;
	}
	if(height > (0.1 + sin(aTexcoord.x*500.)*0.002 + sin(aTexcoord.y*502.)*0.002) && steepnes > 0.3){
		c = texture(uTex, aTexcoord.xy*10. + .34).xyz + 0.7;
	}
	*/
	Color = vec4(c * v, 1);
}