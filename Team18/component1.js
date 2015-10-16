var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timer = new Timer();
var omega = 40;

var date = new Date();
var t;
var videoElement;
var UNIFORM_mvpMatrix;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;

var cubepositionBuffer; 
var cubenormalBuffer;
var cubeuvBuffer;
var spherepositionBuffer; 
var spherenormalBuffer;
var sphereuvBuffer;
var ringpositionBuffer; 
var ringnormalBuffer;
var ringuvBuffer;

var tableTexture, ballTexture, ringTexture;

var viewMatrix;
var projectionMatrix;
var mvpMatrix;

var shininess = 50;
var lightPosition = vec3(0.0, 0.0, 0.0);

//var eye = vec3(1,4.5,1); //to look at the ball and slide from up
//var eye= vec3(-2.2,2.2,0); //right above the ball and 1st component
var eye= vec3(0,4,10);
//var at = vec3(-1, 0, 0); when eye is at 1,4.5,1
var at = vec3(0,0,0);

var up = vec3(0, 1, 0);

var xdir=-0.25, ydir=-0.25, zdir=-2.75;
var xdeg=0, ydeg=0, zdeg=0;

var program;

function initializeShaders()
{
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );

    ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
    gl.enableVertexAttribArray( ATTRIBUTE_uv);
	
	UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
    UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");
}

function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    document.getElementById("play-button").disabled = true;


	////////////////////////////////////////////////
			
	// videoElement = document.getElementById("video");
	// videoElement.addEventListener("canplaythrough", startVideo, true);
	// videoElement.addEventListener("ended", videoDone, true);
	// video.preload = "auto";
	// videoElement.src = "./Images/Examplevideo.ogv";

	///////////////////////////////////////////////
    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    var cubePoints = [];
    var cubeNormals = [];
    var cubeuv = [];
	//wallAndFloor();
    Cube(vertices, cubePoints, cubeNormals, cubeuv);
	Sphere();
	Ring();
///////////////////////////////////////////////////////////////////////////////////
	remoteTexture = gl.createTexture();
    remoteTexture.image = new Image();
    remoteTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, remoteTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, remoteTexture.image);
        gl.generateMipmap( gl.TEXTURE_2D );
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  //       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
    remoteTexture.image.src="./Images/remote.jpg";
 //////////////////////////////////////////////////////////////////////////////////////
	floorTexture = gl.createTexture();
    floorTexture.image = new Image();
    floorTexture.image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, floorTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, floorTexture.image);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    floorTexture.image.src = "./Images/Floor.png";
   
    sofaTexture = gl.createTexture();
    sofaTexture.image = new Image();
    sofaTexture.image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, sofaTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sofaTexture.image);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    sofaTexture.image.src = "./Images/Sofa.png";
   
   
    wallTexture1 = gl.createTexture();
    wallTexture1.image = new Image();
    wallTexture1.image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, wallTexture1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wallTexture1.image);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    wallTexture1.image.src = "./Images/Wall.png";
   
    wallTexture2 = gl.createTexture();
    wallTexture2.image = new Image();
    wallTexture2.image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, wallTexture2);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wallTexture2.image);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    wallTexture2.image.src = "./Images/Wall2.png";



 ////////////////////////////////////////////////////////////////////////////
    tableTexture = gl.createTexture();
    tableTexture.image = new Image();
    tableTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, tableTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tableTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
    tableTexture.image.src = "./Images/plywood.jpg";
	
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
	
	ringTexture = gl.createTexture();
	ringTexture.image = new Image();
	ringTexture.image.onload = function () 
	{
		gl.bindTexture(gl.TEXTURE_2D, ringTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ringTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	ringTexture.image.src = "./Images/circusRing.png";
	
	dominoTexture = gl.createTexture();
    dominoTexture.image = new Image();
    dominoTexture.image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, dominoTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dominoTexture.image);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    dominoTexture.image.src = "./Images/domino.png";
	
	wall1Texture = gl.createTexture();
    wall1Texture.image = new Image();
    wall1Texture.image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, wall1Texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wall1Texture.image);
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    wall1Texture.image.src = "./Images/wall.png";
	
	// wall234Texture = gl.createTexture();
 //    wall234Texture.image = new Image();
 //    wall234Texture.image.onload = function()
 //    {
 //        gl.bindTexture(gl.TEXTURE_2D, wall234Texture);
 //        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wall234Texture.image);
 //        gl.generateMipmap( gl.TEXTURE_2D );
 //        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
 //        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
 //        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
 //        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
 //        gl.generateMipmap(gl.TEXTURE_2D);
 //        gl.bindTexture(gl.TEXTURE_2D, null);
 //    }
 //    wall234Texture.image.src = "./Images/wall234.png";
	
	// floorTexture = gl.createTexture();
 //    floorTexture.image = new Image();
 //    floorTexture.image.onload = function()
 //    {
 //        gl.bindTexture(gl.TEXTURE_2D, floorTexture);
 //        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, floorTexture.image);
 //        gl.generateMipmap( gl.TEXTURE_2D );
 //        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
 //        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
 //        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
 //        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
 //        gl.generateMipmap(gl.TEXTURE_2D);
 //        gl.bindTexture(gl.TEXTURE_2D, null);
 //    }
 //    floorTexture.image.src = "./Images/floor.png";
	
	initializeShaders();

	viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(45, 1, 0.001, 1000);
	gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
	gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

    timer.reset();
    gl.enable(gl.DEPTH_TEST);

	window.onkeydown = function(event)  //callback function for keydown
    {
        //var key = String.fromCharCode(event.keyCode);
        switch(event.keyCode) 
        {
            case 37: 
            if (xdir<=4){
            ydeg--; xdir+=0.25;}//   <-   left arrow- translate in x dir and rotate about y axis
                      break;
            case 38: 
            if (ydir>=-4.5)
            ydir-=0.25; //up arrow - so the object should be moved down in ydir; 
                      break;
            case 39:  
            if (xdir>=-1.2){
            ydeg++; xdir-=0.25;} //  ->  right arrow- translate in -x dir and rotate about y axis
                      break;
            case 40:  
            	if (ydir<=1)
            	ydir+=0.25; //down arrow - so the object should be moved up in ydir; 
            	
                      break;
            case 73:  
            if (zdir<=3)
            zdir+=0.25; //i- move camera forward. so enlarge image
                      break;
            // case 74:  

            // xdir+=0.25; //j- move camera left. so image goes right
            //           break;
            // case 75:  xdir-=0.25; //k- move camera right. images goes left
            //           break;
            case 77:  
            if (zdir>=-3)
            zdir-=0.25; //m- move camera back. so increase distance along z axis between image and camera
                      break;
            default:  break;
        }
    }
    audio1 = document.getElementById('ball_rolling');
    audio1.src = "./Sound/Ball_Rolling.wav";
    audio2 = document.getElementById('domino_falling');
    audio2.src = "./Sound/Drop_floor.wav";
    render();
}
////////////////////////////////////////////////////////////////////////////////////
var squareNormal=[], squareUV=[], squarePoints=[], squarepositionBuffer, squareNormalBuffer, squareuvBuffer;

///////////////////////////////////////////////////////////////////////////////////

// function bindSquare()
// {
    // gl.bindBuffer( gl.ARRAY_BUFFER, squarepositionBuffer );
    // gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    // gl.bindBuffer( gl.ARRAY_BUFFER, squareNormalBuffer );
    // gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    // gl.bindBuffer( gl.ARRAY_BUFFER, squareuvBuffer );
    // gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );
// }

var tstart=0;
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	//time += timer.getElapsedTime()/1000;
	//drawRoom();
	calculateVelocity();
	drawTable();
	drawSlide();
	drawCircusRing();
	drawDomino();
	drawSphere();
	drawChair();
	drawWall();
	drawRemote();
	if (dominoAngle[4]>=80)
	{
		drawTV();
	}
	else
		{
			drawTVOff();
		}
	
    window.requestAnimFrame( render );
}

// function drawRoom()
// {
	// bindSquare();
	// gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, wall234Texture);
	// gl.uniform1i(UNIFORM_sampler, 0);
	// gl.uniform1f(UNIFORM_shininess,  shininess);
	
	// mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	// mvMatrix = mult(mvMatrix, translate([0,0,-3]));
	// gl.drawArrays(gl.TRIANGLE_STRIP,0,4);	
// }

var dominoAngle=[0,0,0,0,0];
var cumDec=0;
function drawDomino()
{
	bindCube();	
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dominoTexture);
	gl.uniform1i(UNIFORM_sampler, 0);
	gl.uniform1f(UNIFORM_shininess,  shininess);

	//dominoeffect();
	for (var i=0.2, j=0; j < 5; i+=0.2, j++)
	{
		//cumDec=0;
		mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
		mvMatrix = mult(mvMatrix, translate([i,1.32,0]));
				
		if (dominoAngle[j]<=90 && dominoAngle[j] >10)
		{
			// cumDec-=0.005;
			// if (cumDec <= -0.18)
				// cumDec=-0.18;
			mvMatrix = mult(mvMatrix, translate([0.0007*dominoAngle[j],-0.002*dominoAngle[j],0]));
			if(j==4 && dominoAngle[j]>=85)
			{
				mvMatrix = mult(mvMatrix, translate([0.0007*dominoAngle[j],-0.0004*dominoAngle[j],0]));
			}
		}
		mvMatrix = mult(mvMatrix, rotate(dominoAngle[j],[0,0,-1]));
		mvMatrix = mult(mvMatrix, scale([0.05,0.5,0.3]));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
		gl.drawArrays( gl.TRIANGLES, 0, 36);
	}
}

function drawCircusRing()
{
	bindCube();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ringTexture);
	gl.uniform1i(UNIFORM_sampler, 0);
	gl.uniform1f(UNIFORM_shininess,  shininess);
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([-0.3,1.15,0.00]));
	mvMatrix = mult(mvMatrix, scale([0.1,0.2,0.1]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	bindRing();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ringTexture);
	gl.uniform1i(UNIFORM_sampler, 0);
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([-0.31,0,0.00]));
	mvMatrix = mult(mvMatrix, rotate(90,[0,1,0]));
	mvMatrix = mult(mvMatrix, translate([-0.05,1.497,0]));
	mvMatrix = mult(mvMatrix, scale([0.5,0.5,0.5]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 724);
}

function drawTable()
{
	bindCube();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tableTexture);
	gl.uniform1i(UNIFORM_sampler, 0);
	gl.uniform1f(UNIFORM_shininess,  shininess);
	////4legs
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([1.45,-0.05,1]));
	mvMatrix = mult(mvMatrix, scale([0.1,2,0.1]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([1.45,-0.05,-1]));
	mvMatrix = mult(mvMatrix, scale([0.1,2,0.1]));
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
	gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([-1.45,-0.05,1]));
	mvMatrix = mult(mvMatrix, scale([0.1,2,0.1]));
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([-1.45,-0.05,-1]));
	mvMatrix = mult(mvMatrix, scale([0.1,2,0.1]));
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
	
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([0,1,0]));
	mvMatrix = mult(mvMatrix, scale([4,0.1,2.2]));
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
}

function drawSlide()
{
	bindCube();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tableTexture);
	gl.uniform1i(UNIFORM_sampler, 0);
	gl.uniform1f(UNIFORM_shininess,  shininess);
	
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, rotate(45, [0,0,1]));
	mvMatrix = mult(mvMatrix, translate([0,2.01,0]));
	
	mvMatrix = mult(mvMatrix, scale([0.1,1,0.16]));
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 6);
	gl.drawArrays( gl.TRIANGLES, 18, 12);
	
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([-0.99,1.2,0]));
	mvMatrix = mult(mvMatrix, rotate(135, [0,0,1]));
	
	mvMatrix = mult(mvMatrix, scale([0.1,0.35,0.16]));
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 6);
	gl.drawArrays( gl.TRIANGLES, 18, 12);
}

var sphereRotSpeed=0;
var sphereSpinDir=-1;
var bounceback=0;
function drawSphere()
{
	bindSphere();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ballTexture);
	gl.uniform1i(UNIFORM_sampler, 0);
	var sphereshine=0;
	gl.uniform1f(UNIFORM_shininess,  sphereshine);
	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	if(bounceback==0)
		mvMatrix = mult(mvMatrix, translate(newPos));
	else
		mvMatrix = mult(mvMatrix, translate(newPos1));
	mvMatrix = mult(mvMatrix,scale([0.625,0.625,0.625]));
	if (sphereSpinDir < 0 )
	{
		mvMatrix = mult(mvMatrix, rotate(sphereRotSpeed, [0,0,-1]));
		sphereRotSpeed+=10;
	}
	else
	{
		mvMatrix = mult(mvMatrix, rotate(sphereRotSpeed, [0,0,1]));
		sphereRotSpeed-=5;
		sphereRotSpeed < 0 ? sphereRotSpeed=0: sphereRotSpeed=sphereRotSpeed;
	}
	gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereindexBuffer);
	gl.drawElements(gl.TRIANGLES, sphereindexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
}

var initialPos = [-1.8,1.8,-0.0]; //45 degrees angle- so keep x and y values same. start from 1.8,1.8,0. touches table at 1.1,1.1,0.
var u = 0;
var v = 0;
var xFriction=0.002;
var newPos = initialPos;
var begindomino = [];
var initialPos1 = [];
var stage2u=0;
var stage3range=0;
var stage3u=0;
var initialtime=0;
var stage1Flag=1, stage3Flag=1;
var timeStage1 = 0, timeStage2=0, timeStage3=0, timeStage4=0;
var videoFlag=1;

function drawTV()
{	
	tvTexture = gl.createTexture();
    tvTexture.image = new Image();
    tvTexture.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, tvTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tvTexture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
    }
 	tvTexture.image.src="./Images/Examplevideo.ogv";
 	if (videoFlag==1){
 	videoElement = document.getElementById("video");
	videoElement.addEventListener("canplaythrough", startVideo, true);
	videoElement.addEventListener("ended", videoDone, true);
	video.preload = "auto";
	videoElement.src = "./Images/Examplevideo.ogv";
	videoFlag=0;
	}
	bindCube();
	initTVTextures();
	updateTVTexture();

	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([4.4,2.2,0.2]));
	mvMatrix = mult(mvMatrix, scale([0.025,3.2,4.5]));
	mvMatrix=mult (mvMatrix,rotate(180,[1,0,0]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);

}

function drawTVOff()
{
	bindCube();
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
	gl.uniform1i(UNIFORM_sampler, 0);

	mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
	mvMatrix = mult(mvMatrix, translate([4.4,2.2,0.2]));
	mvMatrix = mult(mvMatrix, scale([0.025,3.2,4.5]));
	mvMatrix=mult (mvMatrix,rotate(180,[1,0,0]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);

}

function initTVTextures() {
  //tvTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tvTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
function updateTVTexture() {
  gl.bindTexture(gl.TEXTURE_2D, tvTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, videoElement);
}
var intervalID;
function startVideo() {
  videoElement.play();
  intervalID = setInterval(drawTV, 15);
}

function videoDone() {
  clearInterval(intervalID);
}

function calculateVelocity()
{
 	initialPos = newPos;
	if(initialPos[0] < -1.114)
	{	
		// if (stage1Flag==1)
		// {
			// initialtime = Date.now()/1000;
			// stage1Flag=0;
		// }
		// var time1 = Date.now() / 1000 - initialtime; 
		timeStage1+=(1/60);
		v = u + (6.929) * timeStage1; //a= 9.8*sin(45)
		newPos = add(initialPos, vec3(v/1000,-v/1000,0));
		
		if (initialPos[1]<1.14)
		{
			stage2u=v;
			//initialtime = Date.now()/1000;
			// newPos = add(initialPos, vec3(v/50,v/50,0));
			//alert(newPos);
		}
		audio1.play();
	}
	else if ( initialPos[0] <= -0.859 )
	{
		
		//var time1 = Date.now() / 1000 - initialtime; 
		audio1.pause();
		v = stage2u - (6.929) * timeStage2; //a= 9.8*sin(45)
		timeStage2+=(1/60);
		newPos = add(initialPos, vec3(v/1000,v/1000,0));
		stage3u = v;
		// stage3range = stage3u * stage3u * 1 / 9.8;
	}
	else if ( initialPos[0] < 0.125)
	{
		// if (stage3Flag==1)
		// {
			// initialtime = Date.now()/1000;
			// stage3Flag=0;
		// }
		// var time1 = Date.now() / 1000 -initialtime; 
		timeStage3+=(1/60);
		var x = stage3u * timeStage3 / Math.sqrt(2);
		var y = stage3u * timeStage3 /Math.sqrt(2) - 0.5 * 9.8 * timeStage3 * timeStage3;
		newPos = add(initialPos, vec3(x/750,y/750,0));
		// newPos[0] = newPos[0] + (stage3u * time1 / Math.sqrt(2));
		// newPos[1] = newPos[1]+(stage3u * time1 / Math.sqrt(2));
		// newPos[2] = newPos[2];
		// if (initialPos[1]<1.12) //no use
		// {
			// newPos = [-0.857 + stage3range/2,1.12,0];
		// }
		
		
	} 
	else
	{
		initialPos1=newPos;
		bounceback=1;
		sphereSpinDir=1;
		//stage3u/=1.06;
		dominoeffect();
		bounce();
	}
 }
 var newPos1=[0,0,0];
 var stage4Flag=1;
 function bounce()
 {
	// if (stage4Flag==1)
		// {
			// initialtime = Date.now()/1000;
			// stage4Flag=0;
		// }
	//newPos1 = initialPos1;
	//
	// var time1 = Date.now() / 1000 -initialtime; 
	timeStage4+=(1/60);
	var x = stage3u * timeStage4 / Math.sqrt(2);
	var y = stage3u * timeStage4 /Math.sqrt(2) - 0.75 * 9.8 * timeStage4 * timeStage4;
	//y=Math.max(y,-4.5);
	//x= Math.max(x,0.0);
	if (newPos1[1]>=1.12 || newPos1[1]==0)
		newPos1 = add(initialPos1, vec3(-x/45,y/45,0));
	else
		rollAndStop();
	
 }
 var fl=1;
 
 var repeat=50;
 var deg1=0;
 var constant=0;
function rollAndStop()
{
	//deg1+=0.01;
   
	//mvMatrix=mult(mvMatrix,scale(vec3(0.05,0.05,0.05)));
	if(repeat>0)
	{newPos1[0]=newPos1[0]+0.001;
	newPos[1]=1.12;	
	repeat--;	}
	
	
	// if (deg1>0.8 && fl==0)
    // {
        // mvMatrix=mult(mvMatrix,translate(vec3(constant*10,0,0)));
        // mvMatrix=mult(mvMatrix,rotate(constant*1000,[0,0,-1]));
        // constant-=0.001;
        // if (constant<=0.0){
            // mvMatrix=mult(mvMatrix,translate(vec3(constant*10,0,0)));
            // fl=1;
        // }
    // }
    // else if (fl==0){
    // mvMatrix=mult(mvMatrix,translate(vec3(deg1*10,0,0)));
    // mvMatrix=mult(mvMatrix,rotate(deg1*1000,[0,0,-1]));
    // constant=deg1;
        // }
        // if (fl==1)
		// {
            // mvMatrix=mult(mvMatrix,translate(vec3(constant*10,0,0)));
        // }
}

 var state = 0;
 function dominoeffect()
 {
 	if(audio2.ended == true)
 	{
 		audio2.pause();
 		audio2.currentTime = 0.0;
 	}
	if ( begindomino[0] > 0.15);
	{
		dominoAngle[0]+=1;
		if(state == 0)
		{
			audio2.play();
			state = 1;
		}
		dominoAngle[0]=Math.min(dominoAngle[0],76);
		var thresholdAngle= Math.asin(3/5) * 180/3.14-5;
		if(dominoAngle[0]>= thresholdAngle)
			{
				dominoAngle[1]+=1;
				dominoAngle[0]-=0.5;
				dominoAngle[1]=Math.min(dominoAngle[1],75);
			}
		
		if(dominoAngle[1]>= thresholdAngle)
			{
				dominoAngle[2]+=1.15;
				dominoAngle[1]-=0.35;
				dominoAngle[2]=Math.min(dominoAngle[2],75);
			}
		if(dominoAngle[2]>= thresholdAngle)
			{
				dominoAngle[3]+=1.5;
				dominoAngle[2]-=0.25;
				dominoAngle[3]=Math.min(dominoAngle[3],75);
			}
		if(dominoAngle[3]>= thresholdAngle)
			{
				dominoAngle[4]+=2;
				dominoAngle[3]-=0.05;
				dominoAngle[4]=Math.min(dominoAngle[4],80);
			}
	}}

function drawChair()
 	{
    bindCube();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sofaTexture);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1f(UNIFORM_shininess,  shininess);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([-3,-0.1,-0.02]));
    mvMatrix = mult(mvMatrix, scale([0.8,1.5,2]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([-3.35,0.5,-0.02]));
    mvMatrix = mult(mvMatrix, scale([0.1,1.8,2]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([-3,0.1,0.9]));
    mvMatrix = mult(mvMatrix, scale([0.8,1.8,0.2]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([-3,0.1,-0.9]));
    mvMatrix = mult(mvMatrix, scale([0.8,1.8,0.2]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
 }
 
 
 function drawWall()
 {
    //Back wall
    bindCube();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture1);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1f(UNIFORM_shininess,  shininess);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([0,4,-8]));
    mvMatrix = mult(mvMatrix, scale([15,10,0.1]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
   
    //Left Side wall
    bindCube();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture2);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1f(UNIFORM_shininess,  shininess);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([-7.5,4,-0.5]));
    mvMatrix = mult(mvMatrix, scale([0.1,10,15]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
   
    //Right Side wall
    bindCube();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture2);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1f(UNIFORM_shininess,  shininess);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([4.5,4,-0.5]));
    mvMatrix = mult(mvMatrix, scale([0.1,10,15]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
   
    //Floor
    bindCube();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1f(UNIFORM_shininess,  shininess);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([0,-1,-0.5]));
    mvMatrix = mult(mvMatrix, scale([15,0.1,20]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
 
		
 }


 function drawRemote()
 {

 	bindCube();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, remoteTexture);
    gl.uniform1i(UNIFORM_sampler, 0);
    gl.uniform1f(UNIFORM_shininess,  shininess);
   
    mvMatrix = mult(viewMatrix, translate([xdir,ydir,zdir]));
    mvMatrix = mult(mvMatrix, translate([1.35,1.12,0]));
    mvMatrix = mult(mvMatrix, scale([0.2,0.1,0.5]));
    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36);
 }