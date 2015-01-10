GLText2 = function(data3D, text, pos, angle, surfacePlot, axis, align) {
	this.shaderTextureProgram = surfacePlot.shaderTextureProgram;
	this.gl = surfacePlot.gl;
	this.setMatrixUniforms = surfacePlot.setMatrixUniforms;
	this.vertexTextureCoordBuffer = null;
	this.textureVertexPositionBuffer = null;
	this.textureVertexIndexBuffer = null;
	this.context2D = surfacePlot.context2D;
	this.mvPushMatrix = surfacePlot.mvPushMatrix;
	this.mvPopMatrix = surfacePlot.mvPopMatrix;
	this.texture;
	this.text = text;
	this.angle = angle;
	this.pos = pos;
	this.surfacePlot = surfacePlot;
	this.textMetrics = null;
	this.axis = axis;
	this.align = align;
	this.moonVertexPositionBuffer;
	this.moonVertexNormalBuffer;
	this.moonVertexTextureCoordBuffer;
	this.moonVertexIndexBuffer;
	this.moonTexture;
	this.mvMatrix = mat4.create();
	this.mvMatrixStack = [];
	this.pMatrix = mat4.create();
	this.original = true;

	this.setUpTextArea = function() {
		this.context2D.font = 'normal 28px Verdana';
		this.context2D.fillStyle = 'rgba(255,255,255,0)';
		this.context2D.fillRect(0, 0, 512, 512);
		this.context2D.lineWidth = 3;
		this.context2D.textAlign = 'left';
		this.context2D.textBaseline = 'top';
	};

	function isPowerOfTwo(value) {
		return ((value & (value - 1)) == 0);
	}

	this.initTextBuffers = function() {

		// Text texture vertices
		this.textureVertexPositionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVertexPositionBuffer);
		this.textureVertexPositionBuffer.itemSize = 3;
		this.textureVertexPositionBuffer.numItems = 4;
		this.shaderTextureProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderTextureProgram,
				"aTextureCoord");
		this.gl.vertexAttribPointer(this.shaderTextureProgram.textureCoordAttribute,
				this.textureVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVertexPositionBuffer);

		// Where we render the text.
		var texturePositionCoords = [ -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5 ];

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texturePositionCoords), this.gl.STATIC_DRAW);

		// Texture index buffer.
		this.textureVertexIndexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.textureVertexIndexBuffer);

		var textureVertexIndices = [ 0, 1, 2, 0, 2, 3 ];

		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(textureVertexIndices), this.gl.STATIC_DRAW);
		this.textureVertexIndexBuffer.itemSize = 1;
		this.textureVertexIndexBuffer.numItems = 6;

		// Text textures
		this.vertexTextureCoordBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		this.vertexTextureCoordBuffer.itemSize = 2;
		this.vertexTextureCoordBuffer.numItems = 4;
		this.gl.vertexAttribPointer(this.shaderTextureProgram.textureCoordAttribute,
				this.vertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);

		var textureCoords = [ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ];

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);
	};

	this.writeTextToCanvas = function(text, idx) {
		this.context2D.save();
		this.context2D.clearRect(0, 0, 512, 512);
		this.context2D.fillStyle = 'rgba(255, 255, 255, 0)';
		this.context2D.fillRect(0, 0, 512, 512);

		// Set the label colour.
		this.context2D.fillStyle = 'rgba(' + hexToR('#aaaaaa') + ', ' + hexToG('#000000') + ', ' + hexToB('#000000')
				+ ', 255)';
		this.textMetrics = this.context2D.measureText(text);

		if (this.align == "centre")
			this.context2D.fillText(text, 256 - this.textMetrics.width / 2, 0);

		this.gl.activeTexture(this.gl.TEXTURE0 + 0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
				this.context2D.canvas);

		if (isPowerOfTwo(this.context2D.canvas.width) && isPowerOfTwo(this.context2D.canvas.height)) {
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		} else {
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
		}

		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

		this.context2D.restore();
	};

	this.initTexture = function(message1, thisvar) {
		this.moonTexture = this.gl.createTexture();
		this.moonTexture.image = new Image();
		this.moonTexture.image.onload = function() {
			printlnMessage('messages', 'GLText2 image loaded');
			printlnMessage('messages', message1);
			printlnMessage('messages', thisvar);
			printlnMessage('messages', thisvar.align);

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

	this.initBuffers = function() {
		var latitudeBands = 30;
		var longitudeBands = 30;
		var radius = 2;

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

		this.moonVertexNormalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.moonVertexNormalBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalData), this.gl.STATIC_DRAW);
		this.moonVertexNormalBuffer.itemSize = 3;
		this.moonVertexNormalBuffer.numItems = normalData.length / 3;

		this.moonVertexTextureCoordBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.moonVertexTextureCoordBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordData), this.gl.STATIC_DRAW);
		this.moonVertexTextureCoordBuffer.itemSize = 2;
		this.moonVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

		this.moonVertexPositionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.moonVertexPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), this.gl.STATIC_DRAW);
		this.moonVertexPositionBuffer.itemSize = 3;
		this.moonVertexPositionBuffer.numItems = vertexPositionData.length / 3;

		this.moonVertexIndexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.moonVertexIndexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), this.gl.STATIC_DRAW);
		this.moonVertexIndexBuffer.itemSize = 1;
		this.moonVertexIndexBuffer.numItems = indexData.length;
	};

	// Call them up
	if (this.original) {
		// original label
		this.initTextBuffers();
		this.setUpTextArea();
		this.texture = this.gl.createTexture();
		this.writeTextToCanvas(this.text, this.idx);
	} else { // from lesson example
		this.initTexture("test", this);
		this.initBuffers();
	}
};

GLText2.prototype.draw = function() {
	if (this.original) {
		this.mvPushMatrix(this.surfacePlot);

		var rotationMatrix = mat4.create();
		mat4.identity(rotationMatrix);

		if (this.axis == "x") {
			mat4.translate(rotationMatrix, [ 0.5, 0.5, 0.0 ]);
			mat4.translate(rotationMatrix, [ this.pos.x - 0.5, this.pos.y + 0.47, this.pos.z - 0.5 ]);
			mat4.rotate(rotationMatrix, degToRad(this.angle), [ 0, 0, 1 ]);
			mat4.translate(rotationMatrix, [ -0.5, -0.5, 0 ]);
		}
		mat4.multiply(this.surfacePlot.mvMatrix, rotationMatrix);

		// Enable blending for transparency.
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.enable(this.gl.BLEND);
		this.gl.disable(this.gl.DEPTH_TEST);

		// Text
		this.currentShader = this.shaderTextureProgram;
		this.gl.useProgram(this.currentShader);

		// Enable the vertex arrays for the current shader.
		this.currentShader.vertexPositionAttribute = this.gl.getAttribLocation(this.currentShader, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.currentShader.vertexPositionAttribute);
		this.currentShader.textureCoordAttribute = this.gl.getAttribLocation(this.currentShader, "aTextureCoord");
		this.gl.enableVertexAttribArray(this.currentShader.textureCoordAttribute);

		this.shaderTextureProgram.samplerUniform = this.gl.getUniformLocation(this.shaderTextureProgram, "uSampler");

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVertexPositionBuffer);
		this.gl.vertexAttribPointer(this.currentShader.vertexPositionAttribute,
				this.textureVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
		this.gl.vertexAttribPointer(this.currentShader.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize,
				this.gl.FLOAT, false, 0, 0);

		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.uniform1i(this.currentShader.samplerUniform, 0);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.textureVertexIndexBuffer);

		this.setMatrixUniforms(this.currentShader, this.surfacePlot.pMatrix, this.surfacePlot.mvMatrix);

		this.gl.drawElements(this.gl.TRIANGLES, this.textureVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

		// Disable blending for transparency.
		this.gl.disable(this.gl.BLEND);
		this.gl.enable(this.gl.DEPTH_TEST);

		// Disable the vertex arrays for the current shader.
		this.gl.disableVertexAttribArray(this.currentShader.vertexPositionAttribute);
		this.gl.disableVertexAttribArray(this.currentShader.textureCoordAttribute);

		this.mvPopMatrix(this.surfacePlot);

	} else { // from lesson example
		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight,
		// 0.1, 100.0, pMatrix);

		this.gl.uniform1i(this.shaderTextureProgram.useLightingUniform, false);

		// mat4.identity(mvMatrix);

		// mat4.translate(mvMatrix, [ 0, 0, -6 ]);

		// mat4.multiply(mvMatrix, moonRotationMatrix);

		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.moonTexture);
		this.gl.uniform1i(this.shaderTextureProgram.samplerUniform, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.moonVertexPositionBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.vertexPositionAttribute,
				this.moonVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.moonVertexTextureCoordBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.textureCoordAttribute,
				this.moonVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.moonVertexNormalBuffer);
		this.gl.vertexAttribPointer(this.shaderTextureProgram.vertexNormalAttribute,
				this.moonVertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.moonVertexIndexBuffer);
		// setMatrixUniforms();
		this.gl.drawElements(this.gl.TRIANGLES, this.moonVertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
	}
};
