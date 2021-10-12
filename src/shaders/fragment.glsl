precision highp float;

uniform vec2 uScreenSize;

void main(){
	gl_FragColor = vec4(gl_FragCoord.x/uScreenSize.x, gl_FragCoord.y/uScreenSize.y, 1, 1.0);
}