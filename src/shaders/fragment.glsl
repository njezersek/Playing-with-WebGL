#version 300 es

precision highp float;
out vec4 Color;

uniform vec2 uScreenSize;

void main(){
	Color = vec4(gl_FragCoord.x/uScreenSize.x, gl_FragCoord.y/uScreenSize.y, 1, 1.0);
}