#version 300 es

#define NUMBER_OF_STEPS 1000
#define MAX_DISTANCE 40.0
#define FOG_DISTANCE 20.0
#define FOG_DENSITY 0.1
#define COLLISION_THRESHOLD 0.01
#define MAX_STEP_SIZE 1000.0
#define EPSILON 0.001

precision highp float;
out vec4 Color;

in vec3 aNormal;
in vec2 aTexcoord;

float sphere(vec3 pos, float r){
    return length(pos) - r;
}

float safe_distance(vec3 ray){
	return sphere(ray-vec3(0,0,1), .4);
}

vec3 normal(vec3 ray){
    vec3 epsilon = vec3(EPSILON, 0, 0);

    vec3 n = vec3(safe_distance(ray)) - vec3(
        safe_distance(ray - epsilon.xyy),
        safe_distance(ray - epsilon.yxy),
        safe_distance(ray - epsilon.yyx)
    );
    
    return normalize(n);
}

vec3 light1 = normalize(vec3(1,1,-.9));
vec3 light2 = normalize(vec3(-1,0,-.9));

vec4 ray_march(vec3 ray_dir){
    vec4 total_color = vec4(0,0,0,0);

    vec3 body_color = vec3(0,1,1);

    vec3 ray = ray_dir;
	ray_dir = normalize(ray_dir);

    float min_distance = 100000.; // infty
    for(int j=0; j<100; j++){
        float step_size = safe_distance(ray);
        
        if(step_size < COLLISION_THRESHOLD){ // collision
            vec3 color = vec3(0);
        
            vec3 n = normal(ray);
            float l1 = max(dot(n, light1), 0.);
            float l2 = max(dot(n, light2), 0.);
            
            color = body_color*0.1; // ambient
            color += body_color*l1 + body_color*l2; // difuse light
            color += (vec3(0.5)*pow(l1, 30.) + vec3(.0)*pow(l2, 100.))*1.; // specular light            

            total_color = vec4(color,1);
        }
        
        if(step_size < min_distance) min_distance = step_size;
        
        ray += ray_dir*step_size;
        
        if(length(ray) > MAX_DISTANCE){ // decay
           break;
        }
    }
    
    return total_color;
}

void main(){
	//vec3 light = vec3(0,-2,-1);
	//float v = max(-dot(normalize(light), normalize(aNormal)), .1);
	//Color = vec4(gl_FragCoord.x/uScreenSize.x, gl_FragCoord.y/uScreenSize.y, v, 1.0);
	//Color = vec4(aTexcoord.x*v, aTexcoord.y*v, 1.*v, 1.0);

	Color = ray_march(vec3(aTexcoord.xy, 1));
}