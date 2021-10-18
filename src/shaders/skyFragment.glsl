#version 300 es

precision highp float;
out vec4 Color;

in vec2 aTexcoord;

void main(){
	Color = vec4(.2 + aTexcoord.y, 0.8, 1, 1.);
}