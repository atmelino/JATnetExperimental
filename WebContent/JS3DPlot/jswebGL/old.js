



		// printlnMessage('messages', 'GLSphere array length-' + ' vertices ' +
		// vertices.length + ' colors '
		// + colors.length + ' vertexNormals ' + vertexNormals.length);
		//printlnMessage('messages', 'GLSphere vertices ' + JSON.stringify(vertices));
		//printVectorArray('vertices', vertices);
		//printlnMessage('messages', 'GLSphere colors ' + JSON.stringify(colors));
		//printlnMessage('messages', 'GLSphere vertexNormals ' + JSON.stringify(vertexNormals));
		// printVectorArray('vertexNormals', vertexNormals);


		var vertexNormals = [];
		var vertexNormals = [];

		pointArray = [ -.3, 0, 0, -.5, -.2, -.3, 0.5, 0.3, 0, -0.3, 0.3, 0.2 ];
		var fourPoints = this.createVertices('hello', pointArray, vertices, colors, vertexNormals);

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



	this.moonTexture;

	this.testMessage = "hello";
	this.cubeVertexPositionBuffer;
	this.cubeVertexTextureCoordBuffer;
	this.cubeVertexIndexBuffer;

this.drawSceneLines = function() {

		this.mvPushMatrix(this);

		this.gl.useProgram(this.shaderProgram);

		// Enable the vertex arrays for the current shader.
		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		mat4.perspective(5, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
		mat4.identity(this.mvMatrix);
		mat4.translate(this.mvMatrix, [ 0.0, -0.1, -19.0 ]);
		mat4.multiply(this.mvMatrix, this.rotationMatrix);

		// Disable the vertex arrays for the current shader.
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		// this.glLines.draw();

		// code from initLinesBuffers in GLLines.js
		var linesVertexPositionBuffer = null;
		var vertices = [];
		vertices = vertices.concat(0, 0, 0);
		vertices = vertices.concat(1, 0, 0);
		vertices = vertices.concat(1, 0, 0);
		vertices = vertices.concat(.5, .6, 2.3);
		vertices = vertices.concat(.5, .6, 2.3);
		vertices = vertices.concat(0, 0, .4);
		vertices = vertices.concat(0, 0, .4);
		vertices = vertices.concat(0.3, 0.3, .4);

		if (this.once) {
			printlnMessage('messages', 'JSSurfacePlot.js drawSceneLines vertices:' + JSON.stringify(vertices));
			// printlnMessage('messages', 'JSSurfacePlot.js drawSceneLines
			// vertices
			// length: ' + vertices.length);
			this.once = false;
		}
		linesVertexPositionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, linesVertexPositionBuffer);

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.DYNAMIC_DRAW);
		linesVertexPositionBuffer.itemSize = 3;
		linesVertexPositionBuffer.numItems = vertices.length / 3;
		// end code from initLinesBuffers in GLLines.js

		// code from draw in GLLines.js
		this.gl.useProgram(this.shaderAxesProgram);

		// Enable the vertex array for the current shader.
		this.shaderAxesProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderAxesProgram,
				"aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderAxesProgram.vertexPositionAttribute);

		// Set the colour of the lines.
		this.gl.uniform3f(this.shaderAxesProgram.axesColour, 0.9, 0.0, 0.1);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, linesVertexPositionBuffer);
		this.gl.vertexAttribPointer(this.shaderAxesProgram.vertexPositionAttribute, linesVertexPositionBuffer.itemSize,
				this.gl.FLOAT, false, 0, 0);

		this.gl.lineWidth(2);
		this.setMatrixUniforms(this.shaderAxesProgram, this.pMatrix, this.mvMatrix);
		this.gl.drawArrays(this.gl.LINES, 0, linesVertexPositionBuffer.numItems);

		// Enable the vertex array for the current shader.
		this.gl.disableVertexAttribArray(this.shaderAxesProgram.vertexPositionAttribute);
		// end code from draw in GLLines.js

		this.mvPopMatrix(this);
	};

	this.drawSceneMoon = function() {

		this.mvPushMatrix(this);

		this.gl.useProgram(this.shaderProgram);

		// Enable the vertex arrays for the current shader.
		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		mat4.perspective(5, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
		mat4.identity(this.mvMatrix);
		mat4.translate(this.mvMatrix, [ 0.0, -0.1, -19.0 ]);
		mat4.multiply(this.mvMatrix, this.rotationMatrix);

		// Disable the vertex arrays for the current shader.
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		var cubeVertexPositionBuffer;
		var cubeVertexTextureCoordBuffer;
		var cubeVertexIndexBuffer;

		cubeVertexPositionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		vertices = [ -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, ];
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		cubeVertexPositionBuffer.itemSize = 3;
		cubeVertexPositionBuffer.numItems = 4;

		cubeVertexTextureCoordBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		var textureCoords = [ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, ];
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
		cubeVertexTextureCoordBuffer.itemSize = 2;
		cubeVertexTextureCoordBuffer.numItems = 4;

		cubeVertexIndexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		var cubeVertexIndices = [ 0, 1, 2, 0, 2, 3, ];
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
		cubeVertexIndexBuffer.itemSize = 1;
		cubeVertexIndexBuffer.numItems = 6;

		// code from lesson05
		this.gl.useProgram(this.shaderTextureProgram);

		this.shaderTextureProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderTextureProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderTextureProgram.vertexPositionAttribute);

		this.shaderTextureProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderTextureProgram, "aTextureCoord");
		this.gl.enableVertexAttribArray(this.shaderTextureProgram.textureCoordAttribute);

		this.shaderTextureProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uPMatrix");
		this.shaderTextureProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uMVMatrix");
		this.shaderTextureProgram.samplerUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uSampler");

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, this.gl.FLOAT,
				false, 0, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT,
				false, 0, 0);

		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.moonTexture);
		this.gl.uniform1i(this.shaderTextureProgram.samplerUniform, 0);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		//setMatrixUniforms();
		this.setMatrixUniforms(this.shaderTextureProgram, this.pMatrix, this.mvMatrix);
		this.gl.drawElements(this.gl.TRIANGLES, cubeVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

		
		this.glLines.draw();
		this.glAxes.draw();
		this.glSurface.draw();

		this.mvPopMatrix(this);
	};
	this.drawSceneMoonFirst = function() {

		this.mvPushMatrix(this);

		this.gl.useProgram(this.shaderProgram);

		// Enable the vertex arrays for the current shader.
		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		mat4.perspective(5, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
		mat4.identity(this.mvMatrix);

		mat4.translate(this.mvMatrix, [ 0.0, -0.1, -19.0 ]);

		mat4.multiply(this.mvMatrix, this.rotationMatrix);

		// Disable the vertex arrays for the current shader.
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		var cubeVertexPositionBuffer;
		var cubeVertexTextureCoordBuffer;
		var cubeVertexIndexBuffer;

		cubeVertexPositionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		vertices = [ -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, ];
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		cubeVertexPositionBuffer.itemSize = 3;
		cubeVertexPositionBuffer.numItems = 4;

		cubeVertexTextureCoordBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		var textureCoords = [ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, ];
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
		cubeVertexTextureCoordBuffer.itemSize = 2;
		cubeVertexTextureCoordBuffer.numItems = 4;

		cubeVertexIndexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		var cubeVertexIndices = [ 0, 1, 2, 0, 2, 3, ];
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
		cubeVertexIndexBuffer.itemSize = 1;
		cubeVertexIndexBuffer.numItems = 6;

		// code from lesson05
		this.gl.useProgram(this.shaderTextureProgram);

		this.shaderTextureProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderTextureProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderTextureProgram.vertexPositionAttribute);

		this.shaderTextureProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderTextureProgram, "aTextureCoord");
		this.gl.enableVertexAttribArray(this.shaderTextureProgram.textureCoordAttribute);

		this.shaderTextureProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uPMatrix");
		this.shaderTextureProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uMVMatrix");
		this.shaderTextureProgram.samplerUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uSampler");

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);

		mat4.identity(this.mvMatrix);

		mat4.translate(this.mvMatrix, [ 0.0, 0.0, -5.0 ]);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, this.gl.FLOAT,
				false, 0,	 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT,
				false, 0, 0);

		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.moonTexture);
		this.gl.uniform1i(this.shaderTextureProgram.samplerUniform, 0);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
		//setMatrixUniforms();
		this.setMatrixUniforms(this.shaderTextureProgram, this.pMatrix, this.mvMatrix);
		this.gl.drawElements(this.gl.TRIANGLES, cubeVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

		this.mvPopMatrix(this);
	};

	this.initTexture(this);
	
	
	this.initTexture = function(thisvar) {
		this.moonTexture = this.gl.createTexture();
		this.moonTexture.image = new Image();
		this.moonTexture.image.onload = function() {
			// printlnMessage('messages', 'JSSurfacePlot.js GLText2 image
			// loaded');
			// printlnMessage('messages', thisvar);
			// printlnMessage('messages', thisvar.testMessage);

			thisvar.gl.pixelStorei(thisvar.gl.UNPACK_FLIP_Y_WEBGL, true);
			thisvar.gl.bindTexture(thisvar.gl.TEXTURE_2D, thisvar.moonTexture);
			thisvar.gl.texImage2D(thisvar.gl.TEXTURE_2D, 0, thisvar.gl.RGBA, thisvar.gl.RGBA, thisvar.gl.UNSIGNED_BYTE,
					thisvar.moonTexture.image);
			thisvar.gl.texParameteri(thisvar.gl.TEXTURE_2D, thisvar.gl.TEXTURE_MAG_FILTER, thisvar.gl.LINEAR);
			thisvar.gl.texParameteri(thisvar.gl.TEXTURE_2D, thisvar.gl.TEXTURE_MIN_FILTER,
					thisvar.gl.LINEAR_MIPMAP_NEAREST);
			thisvar.gl.generateMipmap(thisvar.gl.TEXTURE_2D);

			thisvar.gl.bindTexture(thisvar.gl.TEXTURE_2D, null);
		};

		this.moonTexture.image.src = "moon.gif";
	};
	// self.drawSceneLines();
	//self.drawSceneMoonFirst();
	//self.drawSceneMoon();

	this.initTextureSphereBuffers();

	
	
