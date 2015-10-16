var points = [];
var gl;
var canvas;
var dotted_circle;
var dashed_circle;

window.onload=function init()
	{
		//  Setup WebGL
	canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );    //background: grey    
	gl.viewport( 0, 0, canvas.width, canvas.height );

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	//model setup
	// setupCircle(.75);
	// dotted_circle=points.length;
	// setupCircle(1);
	// dashed_circle=points.length-dotted_circle;
	pt1 = setupCircle(0.5);
	pt2=setupCircle(1);
	for(i=0; i<=360; i++)
	{
		points.push(pt2[i]);
		points.push(pt1[i]);
	}
	points.push(pt2[0]);
		points.push(pt1[0]);
	//variable association
	// Load the data into the GPU
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	render();
	};

function setupCircle(radius)
{
	var theta=0, deg=0;
	var x=0, y=0;
	var p =vec2(0,0);
	var pts=[];
	while(theta <= 2*3.14) //radians
	{
		x = radius * Math.cos(theta);
		y = radius * Math.sin(theta);
		p = vec2(x,y);
		pts.push(p);
		deg++;
		theta=(deg*3.14/180);
	}
	return pts;
}
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	// gl.drawArrays( gl.POINTS, 0, dotted_circle );
	// gl.drawArrays(gl.LINES, dotted_circle+1, dashed_circle-1);
	gl.drawArrays(gl.TRIANGLE_STRIP,0, 724);
}