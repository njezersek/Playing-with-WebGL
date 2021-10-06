export default function test(){
	return sum(10);
}

function sum(a: number){
	if(a < 0) a = 0;

	let v = 0;
	for(let i=1; i<=a; i++){
		v += i;
	}

	return v;
}