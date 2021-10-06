import test from 'test';

import shader from 'shaders/fragment.glsl'


function main(){
	console.log(shader);

	// create canvas
	let c = document.createElement("canvas");
	let gl = c.getContext("webgl");
	
}

window.onload = main;