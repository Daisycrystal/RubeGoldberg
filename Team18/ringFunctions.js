function setupCircle(radius, zpos)
{
	var theta=0, deg=0;
	var x=0, y=0, z=zpos;
	var p =vec3(0,0,0);
	var pts=[], norm=[], uv=[];
	while(theta <= 2*3.14) //radians
	{
		x = radius * Math.cos(theta);
		y = radius * Math.sin(theta);
		p = vec3(x,y,z);
		pts.push(p);
		norm.push(p);
		uv.push(vec2(Math.cos(theta)),Math.sin(theta));
		deg++;
		theta=(deg*3.14/180);
	}
	var cProp=[];
	cProp.points=pts;
	cProp.normals=norm;
	cProp.uv=uv;
	return cProp;
}

function Ring()
{
	var C1 = setupCircle(0.5, 0);
	var C2=setupCircle(0.5, 0.1);
	var C1points= C1.points;
	var C1uv= C1.uv;
	var C1normals= C1.normals;
	var C2points= C2.points;
	var C2uv= C2.uv;
	var C2normals= C2.normals;
	var ringPoints=[], ringNormals=[], ringUV=[];
	for(i=0; i<=360; i++)
	{
		ringPoints.push(C1points[i]);
		ringPoints.push(C2points[i]);
		ringNormals.push(C1normals[i]);
		ringNormals.push(C2normals[i]);
		ringUV.push(C1uv[i]);
		ringUV.push(C2uv[i]);
	}
	ringPoints.push(C1points[0]);
	ringPoints.push(C2points[0]);
	ringNormals.push(C1normals[0]);
	ringNormals.push(C2normals[0]);
	ringUV.push(C1uv[0]);
	ringUV.push(C2uv[0]);
	loadRingBuffer(ringPoints, ringNormals, ringUV);
}

function loadRingBuffer(ringPoints, ringNormals, ringUV)
{
	ringpositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ringpositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ringPoints), gl.STATIC_DRAW );

    ringnormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ringnormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ringNormals), gl.STATIC_DRAW );

    ringuvBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ringuvBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ringUV), gl.STATIC_DRAW );
}

function bindRing()
{
	gl.bindBuffer(gl.ARRAY_BUFFER, ringpositionBuffer);
	gl.vertexAttribPointer(ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, ringuvBuffer);
	gl.vertexAttribPointer(ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, ringnormalBuffer);
	gl.vertexAttribPointer(ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0);
}