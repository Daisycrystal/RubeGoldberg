var gl;
var program;

var ballTexture;
var mvMatrix = mat4();
var pMatrix = mat4();

function initializeShaders() 
{
	program = initShaders( gl, "vertex-shader", "fragment-shader" );	//  Load shaders and initialize attribute buffers
	gl.useProgram( program );

	program.vertexPositionAttribute = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(program.vertexPositionAttribute);

	program.textureCoordAttribute = gl.getAttribLocation(program, "vUV");
	gl.enableVertexAttribArray(program.textureCoordAttribute);

	// program.vertexNormalAttribute = gl.getAttribLocation(program, "normal");
	// gl.enableVertexAttribArray(program.vertexNormalAttribute);

	program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");

	program.samplerUniform = gl.getUniformLocation(program, "uSampler");
}

function initTexture() 
{
	ballTexture = gl.createTexture();
	ballTexture.image = new Image();
	ballTexture.image.onload = function () 
	{
		gl.bindTexture(gl.TEXTURE_2D, ballTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ballTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	ballTexture.image.src = "./Images/ball.png";
}

var positionBuffer;
//var normalBuffer;
var uvBuffer;
var indexBuffer;

function initBuffers() 
{
	var latitudeBands = 30;
	var longitudeBands = 30;
	var radius = 2;

	var points = [];
	var normals = [];
	var uv = [];
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

			normals.push(x);
			normals.push(y);
			normals.push(z);
			uv.push(u);
			uv.push(v);
			points.push(radius * x);
			points.push(radius * y);
			points.push(radius * z);
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

	//normalBuffer = gl.createBuffer();
	//gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	//normalBuffer.itemSize = 3;
	//normalBuffer.numItems = normals.length / 3;

	uvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
	uvBuffer.itemSize = 2;
	uvBuffer.numItems = uv.length / 2;

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	positionBuffer.itemSize = 3;
	positionBuffer.numItems = points.length / 3;

	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = indexData.length;
}

var eye = vec3(0, 0.5, 2.5);		// position and orientation of the camera
var at = vec3(0, 0, 0);				// target point
var up = vec3(0, 1, 0);				// up vector
var deg=0;
function drawScene() 
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	pMatrix = perspective(45,1,0.1,100);
	mvMatrix = lookAt(eye, at, up);
	mvMatrix = mult(mvMatrix,rotate(deg,[1,0,0]));
	deg++;
	mvMatrix = mult(mvMatrix,scale([0.25,0.25,0.25]));
	

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ballTexture);
	gl.uniform1i(program.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(program.vertexPositionAttribute, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.vertexAttribPointer(program.textureCoordAttribute, uvBuffer.itemSize, gl.FLOAT, false, 0, 0);

	//gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	//gl.vertexAttribPointer(program.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.uniformMatrix4fv(program.pMatrixUniform, false, flatten(pMatrix));
	gl.uniformMatrix4fv(program.mvMatrixUniform, false, flatten(mvMatrix));
	gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	requestAnimFrame(drawScene);
}

window.onload = function webGLStart() 
{
	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL( canvas );					//setup WebGL
	if ( !gl ) { alert( "WebGL isn't available" ); }		//if webgl is not supported, display appropriate message

	gl.viewport( 0, 0, canvas.width, canvas.height );		//viewing area is the entire canvas
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );			
	initializeShaders();
	initBuffers();
	initTexture();
	gl.enable(gl.DEPTH_TEST);
	drawScene();
}
