function Cube(vertices, cubePoints, cubeNormals, cubeuv){
    Quad(vertices, cubePoints, cubeNormals, cubeuv, 0, 1, 2, 3, vec3(0, 0, 1));
    Quad(vertices, cubePoints, cubeNormals, cubeuv, 4, 0, 6, 2, vec3(0, 1, 0));
    Quad(vertices, cubePoints, cubeNormals, cubeuv, 4, 5, 0, 1, vec3(1, 0, 0));
    Quad(vertices, cubePoints, cubeNormals, cubeuv, 2, 3, 6, 7, vec3(1, 0, 1));
    Quad(vertices, cubePoints, cubeNormals, cubeuv, 6, 7, 4, 5, vec3(0, 1, 1));
    Quad(vertices, cubePoints, cubeNormals, cubeuv, 1, 5, 3, 7, vec3(1, 1, 0 ));
	loadCubeBuffer(cubePoints, cubeNormals, cubeuv);
}

function Quad( vertices, cubePoints, cubeNormals, cubeuv, v1, v2, v3, v4, normal)
{
    cubeNormals.push(normal);	    cubeNormals.push(normal);
    cubeNormals.push(normal);	    cubeNormals.push(normal);
    cubeNormals.push(normal);	    cubeNormals.push(normal);
    cubeuv.push(vec2(0,0));		    cubeuv.push(vec2(1,0));
    cubeuv.push(vec2(1,1));		    cubeuv.push(vec2(0,0));
    cubeuv.push(vec2(1,1));			cubeuv.push(vec2(0,1));
    cubePoints.push(vertices[v1]);	cubePoints.push(vertices[v3]);
    cubePoints.push(vertices[v4]);  cubePoints.push(vertices[v1]);
    cubePoints.push(vertices[v4]);	cubePoints.push(vertices[v2]);
}
function loadCubeBuffer(cubePoints, cubeNormals, cubeuv)
{
	cubepositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubepositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW );

    cubenormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubenormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeNormals), gl.STATIC_DRAW );

    cubeuvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeuvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeuv), gl.STATIC_DRAW );
}

function bindCube()
{
    gl.bindBuffer( gl.ARRAY_BUFFER, cubepositionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubenormalBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeuvBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
}
