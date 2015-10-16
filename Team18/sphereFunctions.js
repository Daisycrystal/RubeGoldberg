function loadSphereBuffer(spherePoints, sphereNormals, sphereuv, indexData)
{
	spherenormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spherenormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW);
	spherenormalBuffer.itemSize = 3;
	spherenormalBuffer.numItems = sphereNormals.length / 3;

	sphereuvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereuvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereuv), gl.STATIC_DRAW);
	sphereuvBuffer.itemSize = 2;
	sphereuvBuffer.numItems = sphereuv.length / 2;

	spherepositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, spherepositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spherePoints), gl.STATIC_DRAW);
	spherepositionBuffer.itemSize = 3;
	spherepositionBuffer.numItems = spherePoints.length / 3;

	sphereindexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereindexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	sphereindexBuffer.itemSize = 1;
	sphereindexBuffer.numItems = indexData.length;
}

function bindSphere()
{
	gl.bindBuffer(gl.ARRAY_BUFFER, spherepositionBuffer);
	gl.vertexAttribPointer(ATTRIBUTE_position, spherepositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereuvBuffer);
	gl.vertexAttribPointer(ATTRIBUTE_uv, sphereuvBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, spherenormalBuffer);
	gl.vertexAttribPointer(ATTRIBUTE_normal, spherenormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereindexBuffer);
}

function Sphere() 
{
	var latitudeBands = 30;
	var longitudeBands = 30;
	var radius = 0.1;

	var spherePoints = [];
	var sphereNormals = [];
	var sphereuv = [];
	for (var latNumber=0; latNumber <= latitudeBands; latNumber++) 
	{
		var theta = latNumber * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber=0; longNumber <= longitudeBands; longNumber++) 
		{
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / longitudeBands);
			var v = 1 - (latNumber / latitudeBands);

			sphereNormals.push(x);
			sphereNormals.push(y);
			sphereNormals.push(z);
			sphereuv.push(u);
			sphereuv.push(v);
			spherePoints.push(radius * x);
			spherePoints.push(radius * y);
			spherePoints.push(radius * z);
		}
	}

	var indexData = [];
	for (var latNumber=0; latNumber < latitudeBands; latNumber++) 
	{
		for (var longNumber=0; longNumber < longitudeBands; longNumber++) 
		{
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);

			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		}
	}
	loadSphereBuffer(spherePoints,sphereNormals,sphereuv, indexData);
}
