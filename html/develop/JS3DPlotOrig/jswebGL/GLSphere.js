/*
 * A webGL sphere
 */
GLSphere = function(data3D, surfacePlot) {
	this.shaderProgram = surfacePlot.shaderProgram;
	this.currentShader = null;
	this.gl = surfacePlot.gl;
	this.numXPoints;
	this.numYPoints;
	this.data3D = data3D;
	this.colourGradientObject = surfacePlot.colourGradientObject;
	this.setMatrixUniforms = surfacePlot.setMatrixUniforms;

	this.surfaceVertexPositionBuffer = null;
	this.surfaceVertexColorBuffer = null;
	this.surfaceVertexNormalBuffer = null;
	this.surfaceVertexIndexBuffer = null;
	this.surfacePlot = surfacePlot;


	this.createVertices = function(param, fourpoints, vertices, colors, vertexNormals) {
		//printlnMessage('messages', param);
		//printlnMessage('messages', fourpoints[0]);
		// a=fourpoints[0];
		// b=fourpoints[1];
		// c=fourpoints[2];

		// var point1 = new Point3D(a,b,c);
		var point1 = new Point3D(fourpoints[0], fourpoints[1], fourpoints[2]);
		var point2 = new Point3D(fourpoints[3], fourpoints[4], fourpoints[5]);
		var point3 = new Point3D(fourpoints[6], fourpoints[7], fourpoints[8]);
		var point4 = new Point3D(fourpoints[9], fourpoints[10], fourpoints[11]);

		// Create surface vertices.
		var rawP1 = point1;
		var rawP2 = point2;
		var rawP3 = point3;
		var rawP4 = point4;

		vertices.push(rawP1.ax);
		vertices.push(rawP1.ay);
		vertices.push(rawP1.az);

		vertices.push(rawP2.ax);
		vertices.push(rawP2.ay);
		vertices.push(rawP2.az);

		vertices.push(rawP3.ax);
		vertices.push(rawP3.ay);
		vertices.push(rawP3.az);

		vertices.push(rawP4.ax);
		vertices.push(rawP4.ay);
		vertices.push(rawP4.az);

		// Surface colours.
		// var rgb1 = this.colourGradientObject.getColour(rawP1.lz * 1.0);
		// var rgb2 = this.colourGradientObject.getColour(rawP2.lz * 1.0);
		// var rgb3 = this.colourGradientObject.getColour(rawP3.lz * 1.0);
		//var rgb4 = this.colourGradientObject.getColour(rawP4.lz * 1.0);

		var rgb1 = this.colourGradientObject.getColour(0.1);
		var rgb2 = this.colourGradientObject.getColour(0.2);
		var rgb3 = this.colourGradientObject.getColour(0.6);
		var rgb4 = this.colourGradientObject.getColour(0.7);

		colors.push(rgb1.red / 255);
		colors.push(rgb1.green / 255);
		colors.push(rgb1.blue / 255, 1.0);
		colors.push(rgb2.red / 255);
		colors.push(rgb2.green / 255);
		colors.push(rgb2.blue / 255, 1.0);
		colors.push(rgb3.red / 255);
		colors.push(rgb3.green / 255);
		colors.push(rgb3.blue / 255, 1.0);
		colors.push(rgb4.red / 255);
		colors.push(rgb4.green / 255);
		colors.push(rgb4.blue / 255, 1.0);

		// Normal of triangle 1.
		var v1 = [ rawP2.ax - rawP1.ax, rawP2.ay - rawP1.ay, rawP2.az - rawP1.az ];
		var v2 = [ rawP3.ax - rawP1.ax, rawP3.ay - rawP1.ay, rawP3.az - rawP1.az ];
		var cp1 = vec3.create();
		cp1 = vec3.cross(v1, v2);
		cp1 = vec3.normalize(v1, v2);

		// Normal of triangle 2.
		v1 = [ rawP3.ax - rawP1.ax, rawP3.ay - rawP1.ay, rawP3.az - rawP1.az ];
		v2 = [ rawP4.ax - rawP1.ax, rawP4.ay - rawP1.ay, rawP4.az - rawP1.az ];
		var cp2 = vec3.create();
		cp2 = vec3.cross(v1, v2);
		cp2 = vec3.normalize(v1, v2);

		// Store normals for lighting.
		vertexNormals.push(cp1[0]);
		vertexNormals.push(cp1[1]);
		vertexNormals.push(cp1[2]);
		vertexNormals.push(cp1[0]);
		vertexNormals.push(cp1[1]);
		vertexNormals.push(cp1[2]);
		vertexNormals.push(cp2[0]);
		vertexNormals.push(cp2[1]);
		vertexNormals.push(cp2[2]);
		vertexNormals.push(cp2[0]);
		vertexNormals.push(cp2[1]);
		vertexNormals.push(cp2[2]);

		// return('test');
		// return(fourpoints);
		// return(point1);
		return (vertices);
	};

	this.initSurfaceBuffers = function() {
		var vertices = [];
		var colors = [];
		var vertexNormals = [];

		// this.createVertices('hello');
		// printlnMessage('messages', this.createVertices('hello'));
		// printlnMessage('messages', 'GLSphere data3D ' +
		// JSON.stringify(this.data3D));

		var pointArray = [ 0, 0, 0, .5, 0, 0, 0.5, 0.3, 0, 0.3, 0.3, 0.3 ];
		var fourPoints = this.createVertices('hello', pointArray, vertices, colors, vertexNormals);
		// printlnMessage('messages', 'GLSphere fourPoints' +
		// JSON.stringify(fourPoints));
		pointArray = [ -.3, 0, 0, -.5, -.2, -.3, 0.5, 0.3, 0, -0.3, 0.3, 0.2 ];
		var fourPoints = this.createVertices('hello', pointArray, vertices, colors, vertexNormals);

		// printlnMessage('messages', 'GLSphere array length-' + ' vertices ' +
		// vertices.length + ' colors '
		// + colors.length + ' vertexNormals ' + vertexNormals.length);
		//printlnMessage('messages', 'GLSphere vertices ' + JSON.stringify(vertices));
		//printVectorArray('vertices', vertices);
		//printlnMessage('messages', 'GLSphere colors ' + JSON.stringify(colors));
		//printlnMessage('messages', 'GLSphere vertexNormals ' + JSON.stringify(vertexNormals));
		// printVectorArray('vertexNormals', vertexNormals);

		var latitudeBands = 30;
		var longitudeBands = 30;
		var radius = 0.1;

		var vertexPositionData = [];
		var normalData = [];
		var textureCoordData = [];
		for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * Math.PI / latitudeBands;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * Math.PI / longitudeBands;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				var u = 1 - (longNumber / longitudeBands);
				var v = 1 - (latNumber / latitudeBands);

				normalData.push(x);
				normalData.push(y);
				normalData.push(z);
				textureCoordData.push(u);
				textureCoordData.push(v);
				vertexPositionData.push(radius * x);
				vertexPositionData.push(radius * y);
				vertexPositionData.push(radius * z);

				var rgb1 = this.colourGradientObject.getColour(0.1);
				var rgb2 = this.colourGradientObject.getColour(0.2);
				var rgb3 = this.colourGradientObject.getColour(0.6);
				var rgb4 = this.colourGradientObject.getColour(0.7);

				colors.push(rgb1.red / 255);
				colors.push(rgb1.green / 255);
				colors.push(rgb1.blue / 255, 1.0);

			}
		}

		var indexData = [];
		for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
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

		this.surfaceVertexNormalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexNormalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalData), this.gl.DYNAMIC_DRAW);
		this.surfaceVertexNormalBuffer.itemSize = 3;
		this.surfaceVertexNormalBuffer.numItems = normalData.length / 3;

		this.surfaceVertexTextureCoordBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexTextureCoordBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordData), this.gl.STATIC_DRAW);
		this.surfaceVertexTextureCoordBuffer.itemSize = 2;
		this.surfaceVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;
		
		this.surfaceVertexColorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexColorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.DYNAMIC_DRAW);
		this.surfaceVertexColorBuffer.itemSize = 4;
		this.surfaceVertexColorBuffer.numItems = vertices.length / 3;

		this.surfaceVertexPositionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), this.gl.DYNAMIC_DRAW);
		this.surfaceVertexPositionBuffer.itemSize = 3;
		this.surfaceVertexPositionBuffer.numItems = vertexPositionData.length / 3;

		this.surfaceVertexIndexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.surfaceVertexIndexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), this.gl.DYNAMIC_DRAW);
		this.surfaceVertexIndexBuffer.itemSize = 1;
		this.surfaceVertexIndexBuffer.numItems = indexData.length;
	};

	this.updateSurface = function(data) {
		var vertices = [];
		var colors = [];
		var vertexNormals = [];

		pointArray = [ -.3, 0, 0, -.5, -.2, -.3, 0.5, 0.3, 0, -0.3, 0.3, 0.2 ];
		var fourPoints = this.createVertices('hello', pointArray, vertices, colors, vertexNormals);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexPositionBuffer);
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertices));

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexNormalBuffer);
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(vertexNormals));

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexColorBuffer);
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(colors));

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.surfaceVertexIndexBuffer);

		var numQuads = ((this.numXPoints - 1) * (this.numYPoints - 1)) / 2;
		var surfaceVertexIndices = [];

		for ( var i = 0; i < (numQuads * 8); i += 4) {
			surfaceVertexIndices.push(i);
			surfaceVertexIndices.push(i + 1);
			surfaceVertexIndices.push(i + 2);
			surfaceVertexIndices.push(i);
			surfaceVertexIndices.push(i + 2);
			surfaceVertexIndices.push(i + 3);
		}

		this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(surfaceVertexIndices));
	};

	this.initSurfaceBuffers();
};

GLSphere.prototype.draw = function() {
	this.currentShader = this.shaderProgram;
	this.gl.useProgram(this.currentShader);

	// Enable the vertex arrays for the current shader.
	this.currentShader.vertexPositionAttribute = this.gl.getAttribLocation(this.currentShader, "aVertexPosition");
	this.gl.enableVertexAttribArray(this.currentShader.vertexPositionAttribute);
	this.currentShader.vertexNormalAttribute = this.gl.getAttribLocation(this.currentShader, "aVertexNormal");
	this.gl.enableVertexAttribArray(this.currentShader.vertexNormalAttribute);
	this.currentShader.vertexColorAttribute = this.gl.getAttribLocation(this.currentShader, "aVertexColor");
	this.gl.enableVertexAttribArray(this.currentShader.vertexColorAttribute);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexPositionBuffer);
	this.gl.vertexAttribPointer(this.currentShader.vertexPositionAttribute, this.surfaceVertexPositionBuffer.itemSize,
			this.gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexColorBuffer);
	this.gl.vertexAttribPointer(this.currentShader.vertexColorAttribute, this.surfaceVertexColorBuffer.itemSize,
			this.gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceVertexNormalBuffer);
	this.gl.vertexAttribPointer(this.currentShader.vertexNormalAttribute, this.surfaceVertexNormalBuffer.itemSize,
			this.gl.FLOAT, false, 0, 0);

	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.surfaceVertexIndexBuffer);

	this.setMatrixUniforms(this.currentShader, this.surfacePlot.pMatrix, this.surfacePlot.mvMatrix);

	this.gl.drawElements(this.gl.TRIANGLES, this.surfaceVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

	// Disable the vertex arrays for the current shader.
	this.gl.disableVertexAttribArray(this.currentShader.vertexPositionAttribute);
	this.gl.disableVertexAttribArray(this.currentShader.vertexNormalAttribute);
	this.gl.disableVertexAttribArray(this.currentShader.vertexColorAttribute);
};
