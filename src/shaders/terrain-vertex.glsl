#version 300 es

in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexcoord;

out float scale;
out float instanceID;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uPlayerPosition;
uniform float uRingWidth;

// Simplex 2D noise https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#simplex-noise
//
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

void main() {
	instanceID = float(gl_InstanceID);
	scale = pow(2., float(gl_InstanceID));
	// compute vertex position
	vec4 v = aVertexPosition;
	vec2 player = floor(-uPlayerPosition.xz/scale); // player position in grid
	//player = vec2(0);
	float k = uRingWidth;
	bool morphCondition = v.x - mod(player.x + 1., 2.) < -2.*k 
					   || 2.*k < v.x - 1. + mod(player.x, 2.) 
					   || v.z - mod(player.y + 1., 2.) < -2.*k 
					   || 2.*k < v.z - 1. + mod(player.y, 2.);
	v.xz += player; // move grid to player with step size acdording to scale 
	vec2 morph = mod(v.xz, 2.) * (mod(v.xz, 4.) - 2.);
	if(morphCondition){
		v.xz += morph;
	}
	v.xz *= scale;  // scale the ring

	// compute height
	float height = 0.;
	for(int i=0; i<6; i++){
		height += snoise(v.xz/pow(2., float(i+2))) * pow(2.3, float(i-1));
	}
	//height += snoise(v.xz)*8.;
	v.y = height;
	gl_Position = uProjectionMatrix * uViewMatrix * v;
}