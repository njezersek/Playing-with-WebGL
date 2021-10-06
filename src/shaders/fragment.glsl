precision highp float;

uniform vec2 uScreenSize;
uniform vec2 uMouse;
uniform vec4 uColor;
uniform float uTime;

void main(){
	gl_FragColor = vec4(gl_FragCoord.x/uScreenSize.x, gl_FragCoord.y/uScreenSize.y, uTime/1000.0, 1.0);
}