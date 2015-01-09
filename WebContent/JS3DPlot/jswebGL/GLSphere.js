/*
 * A webGL sphere
 */
GLSphere = function(data3D, surfacePlot) {
	this.shaderProgram = surfacePlot.shaderProgram;
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

	this.initSurfaceBuffers = function() {
		var colors = [];
		var latitudeBands = 30;
		var longitudeBands = 30;
		var radius = 0.1;

		var vertexPositionData = [];
		var normalData = [];
		var textureCoordData = [];
		var indexData = [];

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
		this.surfaceVertexColorBuffer.numItems = colors.length / 3;

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
