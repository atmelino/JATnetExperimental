/*
 * This class does most of the work.
 * *********************************
 */
JSSurfacePlot = function(x, y, width, height, colourGradient, targetElement, fillRegions, tooltips, xTitle, yTitle,
		zTitle, renderPoints, backColour, axisTextColour, hideFlatMinPolygons, origin, startXAngle_canvas,
		startZAngle_canvas, rotationMatrix, zAxisTextPosition, glOptions, data, linePoints) {
	this.xTitle = xTitle;
	this.yTitle = yTitle;
	this.zTitle = zTitle;
	this.backColour = backColour;
	this.axisTextColour = axisTextColour;
	this.glOptions = glOptions;
	var targetDiv;
	var id;
	var canvas;
	this.context2D = null;
	var scale = JSSurfacePlot.DEFAULT_SCALE;
	this.data = data;
	var data3ds = null;
	this.numXPoints = 0;
	this.numYPoints = 0;
	var colourGradient;
	var mouseDown1 = false;
	var mouseDown3 = false;
	var mousePosX = null;
	var mousePosY = null;
	var lastMousePos = new Point(0, 0);
	var mouseButton1Up = null;
	var mouseButton3Up = null;
	var mouseButton1Down = new Point(0, 0);
	var mouseButton3Down = new Point(0, 0);
	this.glSurface = null;
	this.glAxes = null;
	this.glAxes2 = null;
	this.glLines = null;
	this.glSphere = null;
	this.glTextureQuad = null;
	this.glTextureSphere = null;
	this.gl = null;
	this.shaderProgram = null;
	this.shaderTextureProgram = null;
	this.mvMatrix = mat4.create();
	this.mvMatrixStack = [];
	this.pMatrix = mat4.create();
	var mouseDown = false;
	var lastMouseX = null;
	var lastMouseY = null;
	var shiftPressed = false;
	this.once = true;

	// printlnMessage('messages','JSSurfacePlot called');
	// /printlnMessage('messages', 'JSSurfacePlot data ' +
	// JSON.stringify(data));

	if (startXAngle_canvas != null && startXAngle_canvas != void 0)
		this.currentXAngle_canvas = startXAngle_canvas;
	else
		this.currentXAngle_canvas = JSSurfacePlot.DEFAULT_X_ANGLE_CANVAS;

	if (startZAngle_canvas != null && startZAngle_canvas != void 0)
		this.currentZAngle_canvas = startZAngle_canvas;
	else
		this.currentZAngle_canvas = JSSurfacePlot.DEFAULT_Z_ANGLE_CANVAS;

	if (rotationMatrix != null && rotationMatrix != void 0)
		this.rotationMatrix = rotationMatrix;
	else {
		this.rotationMatrix = mat4.create();
		mat4.identity(this.rotationMatrix);
		mat4.rotate(this.rotationMatrix, degToRad(JSSurfacePlot.DEFAULT_X_ANGLE_WEBGL), [ 1, 0, 0 ]);
		mat4.rotate(this.rotationMatrix, degToRad(JSSurfacePlot.DEFAULT_Y_ANGLE_WEBGL), [ 0, 0, 1 ]);
	}

	if (zAxisTextPosition != null && zAxisTextPosition != void 0)
		zTextPosition = zAxisTextPosition;

	this.initGL = function(canvas) {
		try {
			this.gl = canvas.getContext("experimental-webgl", {
				alpha : false
			});
			this.gl.viewportWidth = canvas.width;
			this.gl.viewportHeight = canvas.height;
		} catch (e) {
		}
		return true;
	};

	this.getShader = function(id) {
		// printlnMessage('messages', 'JSSurfacePlot id: ' + id);
		var shaderScript = document.getElementById(id);
		var str = "";
		var k = shaderScript.firstChild;

		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}

			k = k.nextSibling;
		}

		var shader;

		if (shaderScript.type == "x-shader/x-fragment") {
			shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
			shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		} else {
			return null;
		}

		this.gl.shaderSource(shader, str);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			alert(this.gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	};

	this.initShaders = function() {
		if (this.gl == null)
			return false;

		// Non-texture shaders
		this.shaderProgram = this.createProgram("shader-fs", "shader-vs");

		// Texture shaders
		this.shaderTextureProgram = this.createProgram("texture-shader-fs", "texture-shader-vs");

		// Axes shaders
		this.shaderAxesProgram = this.createProgram("axes-shader-fs", "axes-shader-vs");

		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			return false;
		}

		return true;
	};

	this.createProgram = function(fragmentShaderID, vertexShaderID) {

		var fragmentShader = this.getShader(fragmentShaderID);
		var vertexShader = this.getShader(vertexShaderID);

		var shaderProgram = this.gl.createProgram();
		this.gl.attachShader(shaderProgram, vertexShader);
		this.gl.attachShader(shaderProgram, fragmentShader);
		this.gl.linkProgram(shaderProgram);

		shaderProgram.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uMVMatrix");

		shaderProgram.nMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uNMatrix");
		shaderProgram.axesColour = this.gl.getUniformLocation(shaderProgram, "uAxesColour");
		shaderProgram.ambientColorUniform = this.gl.getUniformLocation(shaderProgram, "uAmbientColor");
		shaderProgram.lightingDirectionUniform = this.gl.getUniformLocation(shaderProgram, "uLightingDirection");
		shaderProgram.directionalColorUniform = this.gl.getUniformLocation(shaderProgram, "uDirectionalColor");

		return shaderProgram;
	};

	this.drawSceneOrig = function() {
		// printlnMessage('messages', 'JSSurfacePlot drawScene');

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

		var useLighting = true;

		if (useLighting) {
			this.gl.uniform3f(this.shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);

			var lightingDirection = [ 0.0, 0.0, 1.0 ];

			var adjustedLD = vec3.create();
			vec3.normalize(lightingDirection, adjustedLD);
			vec3.scale(adjustedLD, -1);
			this.gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, adjustedLD);

			this.gl.uniform3f(this.shaderProgram.directionalColorUniform, 0.8, 0.8, 0.8);
		}

		// Disable the vertex arrays for the current shader.
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

		//this.glTextureQuad.draw();
		this.glTextureSphere.draw();
		this.glAxes.draw();
		//this.glAxes2.draw();
		this.glLines.draw();
		this.glSphere.draw();
		//this.glSurface.draw();

		this.mvPopMatrix(this);
	};


	this.tick = function() {
		var self = this;

		if (this.gl == null)
			return;

		var animator = function() {
			if (self.gl == null || self.bail)
				return;

			 self.drawSceneOrig();
			requestAnimFrame(animator);
		};

		requestAnimFrame(animator);
	};

	this.webGLStart = function() {
		if (id)
			targetElement.removeChild(targetDiv);

		id = this.allocateId();

		this.createTargetDiv();

		if (!targetDiv)
			return;

		this.dataToRender = this.data.formattedValues;
		this.determineMinMaxZValues();
		canvas = document.createElement("canvas");
		canvas.className = "surfacePlotCanvas";
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.style.left = '0px';
		canvas.style.top = '0px';
		targetDiv.appendChild(canvas);

		this.initGL(canvas);
		this.initShaders();
		this.initMouse(canvas);

		this.createHiddenCanvasForGLText();

		if (this.glOptions.autoCalcZScale)
			this.calculateZScale();

		this.glOptions.xTicksNum = this.glOptions.xLabels.length - 1;
		this.glOptions.yTicksNum = this.glOptions.yLabels.length - 1;
		this.glOptions.zTicksNum = this.glOptions.zLabels.length - 1;
	};

	// ==============================================

	this.determineMinMaxZValues = function() {
		this.numXPoints = this.data.nRows;
		this.numYPoints = this.data.nCols;
		this.minZValue = Number.MAX_VALUE;
		this.maxZValue = Number.MIN_VALUE;

		for ( var i = 0; i < this.numXPoints; i++) {
			for ( var j = 0; j < this.numYPoints; j++) {
				var value = this.dataToRender[i][j];

				if (value < this.minZValue)
					this.minZValue = value;

				if (value > this.maxZValue)
					this.maxZValue = value;
			}
		}
	};

	this.render = function() {

		var r = hexToR(this.backColour) / 255;
		var g = hexToG(this.backColour) / 255;
		var b = hexToB(this.backColour) / 255;

		this.initWorldObjects(data3ds);
		this.gl.clearColor(r, g, b, 0); // Set the background colour.
		this.gl.enable(this.gl.DEPTH_TEST);
		this.tick();

		return;
	};

	var sort = function(array) {
		var len = array.length;

		if (len < 2) {
			return array;
		}

		var pivot = Math.ceil(len / 2);
		return merge(sort(array.slice(0, pivot)), sort(array.slice(pivot)));
	};

	var merge = function(left, right) {
		var result = [];
		while ((left.length > 0) && (right.length > 0)) {
			if (left[0].distanceFromCamera < right[0].distanceFromCamera) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		result = result.concat(left, right);
		return result;
	};

	this.getDefaultColourRamp = function() {
		var colour1 = {
			red : 0,
			green : 0,
			blue : 255
		};
		var colour2 = {
			red : 0,
			green : 255,
			blue : 255
		};
		var colour3 = {
			red : 0,
			green : 255,
			blue : 0
		};
		var colour4 = {
			red : 255,
			green : 255,
			blue : 0
		};
		var colour5 = {
			red : 255,
			green : 0,
			blue : 0
		};
		return [ colour1, colour2, colour3, colour4, colour5 ];
	};

	this.redraw = function() {
		var cGradient;

		printlnMessage('messages', 'JSSurfacePlot redraw called');
		if (colourGradient)
			cGradient = colourGradient;
		else
			cGradient = getDefaultColourRamp();

		this.colourGradientObject = new ColourGradient(this.minZValue, this.maxZValue, cGradient);

		var canvasWidth = width;
		var canvasHeight = height;

		var minMargin = 20;
		var drawingDim = canvasWidth - minMargin * 2;

		if (canvasWidth > canvasHeight) {
			drawingDim = canvasHeight - minMargin * 2;
			marginX = (canvasWidth - drawingDim) / 2;
		} else if (canvasWidth < canvasHeight) {
			drawingDim = canvasWidth - minMargin * 2;
			marginY = (canvasHeight - drawingDim) / 2;
		}

		var xDivision = 1 / (this.numXPoints - 1);
		var yDivision = 1 / (this.numYPoints - 1);
		var xPos, yPos;
		var i, j;
		data3ds = new Array();
		dataframe = new Array();
		var index = 0;
		var colIndex;

		for (i = 0, xPos = -0.5; i < this.numXPoints; i++, xPos += xDivision) {
			for (j = 0, yPos = 0.5; j < this.numYPoints; j++, yPos -= yDivision) {
				var x = xPos;
				var y = yPos;

				colIndex = this.numYPoints - 1 - j;

				// Reverse the y-axis to match the non-webGL surface.
				data3ds[index] = new Point3D(x, y, this.dataToRender[i][colIndex]);
				index++;
			}
		}

		// printlnMessage('messages', 'JSSurfacePlot redraw data3ds ' +
		// JSON.stringify(data3ds));

		this.render();
	};

	this.allocateId = function() {
		var count = 0;
		var name = "surfacePlot";

		do {
			count++;
		} while (document.getElementById(name + count))
		return name + count;
	};

	this.createTargetDiv = function() {
		targetDiv = document.createElement("div");
		targetDiv.id = id;
		targetDiv.className = "surfaceplot";
		targetDiv.style.background = '#ffffff';
		targetDiv.style.position = 'absolute';

		if (!targetElement)
			return;// document.body.appendChild(this.targetDiv);
		else {
			targetDiv.style.position = 'relative';
			targetElement.appendChild(targetDiv);
		}

		targetDiv.style.left = x + "px";
		targetDiv.style.top = y + "px";
	};

	this.mvPushMatrix = function(surfacePlot) {
		var copy = mat4.create();
		mat4.set(surfacePlot.mvMatrix, copy);
		surfacePlot.mvMatrixStack.push(copy);
	};

	this.mvPopMatrix = function(surfacePlot) {
		if (surfacePlot.mvMatrixStack.length == 0) {
			throw "Invalid popMatrix!";
		}

		surfacePlot.mvMatrix = surfacePlot.mvMatrixStack.pop();
	};

	this.setMatrixUniforms = function(program, pMatrix, mvMatrix) {
		this.gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
		this.gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);

		var normalMatrix = mat3.create();
		mat4.toInverseMat3(mvMatrix, normalMatrix);
		mat3.transpose(normalMatrix);
		this.gl.uniformMatrix3fv(program.nMatrixUniform, false, normalMatrix);
	};

	this.initWorldObjects = function(data3D) {
		this.glSurface = new GLSurface(data3D, this);
		this.glAxes = new GLAxes(data3D, this);
		this.glAxes2 = new GLAxes2(data3D, this);
		this.glLines = new GLLines(linePoints, this);
		this.glSphere = new GLSphere(data3D, this);
		//this.glTextureQuad = new glTextureQuad(linePoints, this);
		this.glTextureSphere = new glTextureSphere(linePoints, this);
	};

	// WebGL mouse handlers:
	this.handleMouseUp = function(event) {
		mouseDown = false;
	};

	this.rotate = function(deltaX, deltaY) {
		var newRotationMatrix = mat4.create();
		mat4.identity(newRotationMatrix);

		mat4.rotate(newRotationMatrix, degToRad(deltaX / 2), [ 0, 1, 0 ]);
		mat4.rotate(newRotationMatrix, degToRad(deltaY / 2), [ 1, 0, 0 ]);
		mat4.multiply(newRotationMatrix, this.rotationMatrix, this.rotationMatrix);
	}

	this.handleMouseMove = function(event, context) {

		if (!mouseDown) {
			return;
		}

		var newX = event.clientX;
		var newY = event.clientY;

		var deltaX = newX - lastMouseX;
		var deltaY = newY - lastMouseY;
		var newRotationMatrix = mat4.create();
		mat4.identity(newRotationMatrix);

		if (shiftPressed) // scale
		{
			var s = deltaY < 0 ? 1.05 : 0.95;
			mat4.scale(newRotationMatrix, [ s, s, s ]);
			mat4.multiply(newRotationMatrix, this.rotationMatrix, this.rotationMatrix);
		} else // rotate
		{
			mat4.rotate(newRotationMatrix, degToRad(deltaX / 2), [ 0, 1, 0 ]);
			mat4.rotate(newRotationMatrix, degToRad(deltaY / 2), [ 1, 0, 0 ]);
			mat4.multiply(newRotationMatrix, this.rotationMatrix, this.rotationMatrix);

			if (this.otherPlots) {
				var numPlots = this.otherPlots.length;
				for ( var i = 0; i < numPlots; i++) {
					this.otherPlots[i].rotate(deltaX, deltaY);
				}
			}
		}

		lastMouseX = newX;
		lastMouseY = newY;
	};

	this.initMouse = function(canvas) {
		var self = this;
		printlnMessage('messages','JSSurfacePlot.js initMouse called');

		var handleMouseDown = function(event) {
			shiftPressed = isShiftPressed(event);

			mouseDown = true;
			lastMouseX = event.clientX;
			lastMouseY = event.clientY;

			document.onmouseup = self.handleMouseUp;
			document.onmousemove = function(event) {
				self.handleMouseMove(event, self)
			};// self.handleMouseMove;
		};

		canvas.onmousedown = handleMouseDown;
		document.onmouseup = this.handleMouseUp;
		document.onmousemove = function(event) {
			self.handleMouseMove(event, self)
		};// this.handleMouseMove;

	};

	this.scaleAndNormalise = function(scaleFactor) {
		if (this.frames) {
			// Need to clone the data.
			var values = this.data.formattedValues.slice(0);
			var numRows = this.data.nRows;

			for ( var i = 0; i < this.numFrames; i++) {
				values[i] = this.data.formattedValues[i].slice(0);

				for ( var j = 0; j < numRows; j++)
					values[i][j] = this.data.formattedValues[i][j].slice(0);
			}

			// Now, do the scaling.
			var numRows = values[0].length;
			var numCols = values[0][0].length;

			for ( var k = 0; k < this.numFrames; k++)
				for ( var i = 0; i < numRows; i++)
					for ( var j = 0; j < numCols; j++)
						values[k][i][j] = (values[k][i][j] / this.maxZValue) * scaleFactor;

			this.dataToRender = values;
		} else {
			// Need to clone the data.
			var values = this.data.formattedValues.slice(0);
			var numRows = this.data.nRows;

			for ( var i = 0; i < numRows; i++)
				values[i] = this.data.formattedValues[i].slice(0);

			// Now, do the scaling.
			var numRows = values.length;
			var numCols = values[0].length;

			for ( var i = 0; i < numRows; i++)
				for ( var j = 0; j < numCols; j++)
					values[i][j] = (values[i][j] / this.maxZValue) * scaleFactor;

			this.dataToRender = values;
		}

		// Recalculate the new min and max values.
		this.determineMinMaxZValues();
	}

	this.log = function(base, value) {
		return Math.log(value) / Math.log(base);
	}

	this.nice_num = function(x, round) {
		var exp = Math.floor(log(10, x));
		var f = x / Math.pow(10, exp);
		var nf;

		if (round) {
			if (f < 1.5)
				nf = 1;
			else if (f < 3)
				nf = 2;
			else if (f < 7)
				nf = 5;
			else
				nf = 10;
		} else {
			if (f <= 1)
				nf = 1;
			else if (f <= 2)
				nf = 2;
			else if (f <= 5)
				nf = 5;
			else
				nf = 10;
		}

		return nf * Math.pow(10, exp);
	}

	this.calculateZScale = function() {
		// Calculate the z-axis labels.
		var maxAxisValue = this.nice_num(this.maxZValue);
		var labels = [];
		var ticks = 10;
		var interval = maxAxisValue / ticks;
		var rounded2dp;

		for ( var i = 0; i <= ticks; i++) {
			rounded2dp = Math.round(i * interval * 100) / 100;
			labels.push(rounded2dp);
		}

		this.glOptions.zLabels = labels;

		// Scale the values accordingly.
		var scaleFactor = this.maxZValue / maxAxisValue;
		this.scaleAndNormalise(scaleFactor);
	};

	this.createHiddenCanvasForGLText = function() {
		var hiddenCanvas = document.createElement("canvas");
		hiddenCanvas.setAttribute("width", 512);
		hiddenCanvas.setAttribute("height", 512);
		this.context2D = hiddenCanvas.getContext('2d');
		hiddenCanvas.style.display = 'none';
		targetDiv.appendChild(hiddenCanvas);
	};

	// Mouse events for the non-webGL version of the surface plot.
	this.mouseDownd = function(e) {
		if (isShiftPressed(e)) {
			mouseDown3 = true;
			mouseButton3Down = getMousePositionFromEvent(e);
		} else {
			mouseDown1 = true;
			mouseButton1Down = getMousePositionFromEvent(e);
		}
	};

	this.mouseUpd = function(e) {
		if (mouseDown1) {
			mouseButton1Up = lastMousePos;
		} else if (mouseDown3) {
			mouseButton3Up = lastMousePos;
		}

		mouseDown1 = false;
		mouseDown3 = false;
	};

	this.mouseIsMoving = function(e) {
		var self = e.target.owner;
		var currentPos = getMousePositionFromEvent(e);

		if (mouseDown1) {
			self.calculateRotation(currentPos);
		} else if (mouseDown3) {
			self.calculateScale(currentPos);
		} else {
			closestPointToMouse = null;
			var closestDist = Number.MAX_VALUE;

			for ( var i = 0; i < data3ds.length; i++) {
				var point = data3ds[i];
				var dist = distance({
					x : point.ax,
					y : point.ay
				}, currentPos);

				if (dist < closestDist) {
					closestDist = dist;
					closestPointToMouse = i;
				}
			}
		}

		return false;
	};

	function isShiftPressed(e) {
		var shiftPressed = 0;

		if (parseInt(navigator.appVersion) > 3) {
			var evt = navigator.appName == "Netscape" ? e : event;

			if (navigator.appName == "Netscape" && parseInt(navigator.appVersion) == 4) {
				// NETSCAPE 4 CODE
				var mString = (e.modifiers + 32).toString(2).substring(3, 6);
				shiftPressed = (mString.charAt(0) == "1");
			} else {
				// NEWER BROWSERS [CROSS-PLATFORM]
				shiftPressed = evt.shiftKey;
			}

			if (shiftPressed)
				return true;
		}

		return false;
	}

	function getMousePositionFromEvent(e) {
		if (e.layerX || e.layerX == 0) // Firefox
		{
			mousePosX = e.layerX;
			mousePosY = e.layerY;
		} else if (e.offsetX || e.offsetX == 0) // Opera
		{
			mousePosX = e.offsetX;
			mousePosY = e.offsetY;
		} else if (e.touches[0].pageX || e.touches[0].pageX == 0) // touch
		// events
		{
			mousePosX = e.touches[0].pageX;
			mousePosY = e.touches[0].pageY;
		}

		var currentPos = new Point(mousePosX, mousePosY);

		return currentPos;
	}

	this.calculateRotation = function(e) {
		lastMousePos = new Point(this.currentZAngle_canvas, this.currentXAngle_canvas);

		if (mouseButton1Up == null) {
			mouseButton1Up = new Point(this.currentZAngle_canvas, this.currentXAngle_canvas);
		}

		if (mouseButton1Down != null) {
			lastMousePos = new Point(mouseButton1Up.x + (mouseButton1Down.x - e.x),//
			mouseButton1Up.y + (mouseButton1Down.y - e.y));
		}

		this.currentZAngle_canvas = lastMousePos.x % 360;
		this.currentXAngle_canvas = lastMousePos.y % 360;

		closestPointToMouse = null;
		this.render();
	};

	this.calculateScale = function(e) {
		lastMousePos = new Point(0, JSSurfacePlot.DEFAULT_SCALE / JSSurfacePlot.SCALE_FACTOR);

		if (mouseButton3Up == null) {
			mouseButton3Up = new Point(0, JSSurfacePlot.DEFAULT_SCALE / JSSurfacePlot.SCALE_FACTOR);
		}

		if (mouseButton3Down != null) {
			lastMousePos = new Point(mouseButton3Up.x + (mouseButton3Down.x - e.x),//
			mouseButton3Up.y + (mouseButton3Down.y - e.y));
		}

		scale = lastMousePos.y * JSSurfacePlot.SCALE_FACTOR;

		if (scale < JSSurfacePlot.MIN_SCALE)
			scale = JSSurfacePlot.MIN_SCALE + 1;
		else if (scale > JSSurfacePlot.MAX_SCALE)
			scale = JSSurfacePlot.MAX_SCALE - 1;

		lastMousePos.y = scale / JSSurfacePlot.SCALE_FACTOR;

		closestPointToMouse = null;
		this.render();
	};

	this.cleanUp = function() {
		this.gl = null;

		canvas.onmousedown = null;
		document.onmouseup = null;
		document.onmousemove = null;

		this.numXPoints = 0;
		this.numYPoints = 0;		this.glTexture = null;

		canvas = null;
		canvasContext = null;
		this.data = null;
		this.colourGradientObject = null;
		this.glSurface = null;
		this.glAxes = null;
		this.glAxes2 = null;
		this.glLines = null;
		this.glSphere = null;
		this.glTextureQuad = null;
		this.glTextureSphere = null;
		this.shaderProgram = null;
		this.shaderTextureProgram = null;
		this.shaderAxesProgram = null;
		this.mvMatrix = null;
		this.mvMatrixStack = null;
		this.pMatrix = null;
	};



};

JSSurfacePlot.DEFAULT_X_ANGLE_CANVAS = 47;
JSSurfacePlot.DEFAULT_Z_ANGLE_CANVAS = 47;
JSSurfacePlot.DEFAULT_X_ANGLE_WEBGL = -70;
JSSurfacePlot.DEFAULT_Y_ANGLE_WEBGL = -42;
JSSurfacePlot.DATA_DOT_SIZE = 5;
JSSurfacePlot.DEFAULT_SCALE = 350;
JSSurfacePlot.MIN_SCALE = 50;
JSSurfacePlot.MAX_SCALE = 1100;
JSSurfacePlot.SCALE_FACTOR = 1.4;
