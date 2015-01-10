/*
 * This class does most of the work.
 * *********************************
 */
JSSurfacePlot = function(x, y, width, height, colourGradient, targetElement, fillRegions, tooltips, xTitle, yTitle,
		zTitle, renderPoints, backColour, axisTextColour, hideFlatMinPolygons, tooltipColour, origin,
		startXAngle_canvas, startZAngle_canvas, rotationMatrix, zAxisTextPosition, glOptions, data, linePoints) {
	this.xTitle = xTitle;
	this.yTitle = yTitle;
	this.zTitle = zTitle;
	this.backColour = backColour;
	this.axisTextColour = axisTextColour;
	this.glOptions = glOptions;
	var targetDiv;
	var id;
	var canvas;
	var canvasContext = null;
	this.context2D = null;
	var scale = JSSurfacePlot.DEFAULT_SCALE;
	var zTextPosition = 0.5;

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

	this.data = data;
	var data3ds = null;
	var dataframes = null;
	var displayValues = null;
	this.numXPoints = 0;
	this.numYPoints = 0;
	var transformation;
	var cameraPosition;
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
	var closestPointToMouse = null;
	var xAxisHeader = "";
	var yAxisHeader = "";
	var zAxisHeader = "";
	var xAxisTitleLabel = new Tooltip(true);
	var yAxisTitleLabel = new Tooltip(true);
	var zAxisTitleLabel = new Tooltip(true);
	var tTip = new Tooltip(false, tooltipColour);

	this.glSurface = null;
	this.glAxes = null;
	this.glLines = null;
	this.glTexture = null;
	this.glSphere = null;
	this.useWebGL = false;
	this.gl = null;
	this.shaderProgram = null;
	this.shaderTextureProgram = null;
	this.mvMatrix = mat4.create();
	this.mvMatrixStack = [];
	this.pMatrix = mat4.create();
	var mouseDown = false;
	var lastMouseX = null;
	var lastMouseY = null;
	var canvas_support_checked = false;
	var canvas_supported = true;

	this.reRender = function(data, glOptions) {
		printlnMessage('messages', 'JSSurfacePlot reRender called');

		this.bail = true;
		this.glOptions = glOptions;
		this.data = data;
		this.dataToRender = this.data.formattedValues;
		this.frames = this.data.frames;
		this.determineMinMaxZValues();

		if (!this.useWebGL) {
			var maxAxisValue = this.nice_num(this.maxZValue);
			this.scaleAndNormalise(this.maxZValue / maxAxisValue);
		} else {
			if (this.glOptions.autoCalcZScale)
				this.calculateZScale();

			this.glOptions.xTicksNum = this.glOptions.xLabels.length - 1;
			this.glOptions.yTicksNum = this.glOptions.yLabels.length - 1;
			this.glOptions.zTicksNum = this.glOptions.zLabels.length - 1;
		}

		var cGradient;

		if (colourGradient)
			cGradient = colourGradient;
		else
			cGradient = getDefaultColourRamp();

		this.colourGradientObject = new ColourGradient(this.minZValue, this.maxZValue, cGradient);

		var canvasWidth = width;
		var canvasHeight = height;

		var minMargin = 20;
		var drawingDim = canvasWidth - minMargin * 2;
		var marginX = minMargin;
		var marginY = minMargin;

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
		var numPoints = this.numXPoints * this.numYPoints;
		data3ds = new Array();
		dataframe = new Array();
		var index = 0;
		var colIndex;

		printlnMessage('messages', 'JSSurfacePlot this.frames is ' + this.frames);

		if (this.frames) {
			for ( var k = 0; k < this.numFrames; k++) {
				index = 0;
				dataframe = new Array();
				for (i = 0, xPos = -0.5; i < this.numXPoints; i++, xPos += xDivision) {
					for (j = 0, yPos = 0.5; j < this.numYPoints; j++, yPos -= yDivision) {
						var x = xPos;
						var y = yPos;

						if (this.useWebGL)
							colIndex = this.numYPoints - 1 - j;
						else
							colIndex = j;

						// Reverse the y-axis to match the non-webGL surface.
						dataframe[index] = new Point3D(x, y, this.dataToRender[k][i][colIndex]);
						index++;
					}
				}
				data3ds.push(dataframe);
			}
		} else {
			for (i = 0, xPos = -0.5; i < this.numXPoints; i++, xPos += xDivision) {
				for (j = 0, yPos = 0.5; j < this.numYPoints; j++, yPos -= yDivision) {
					var x = xPos;
					var y = yPos;

					if (this.useWebGL)
						colIndex = this.numYPoints - 1 - j;
					else
						colIndex = j;

					// Reverse the y-axis to match the non-webGL surface.
					data3ds[index] = new Point3D(x, y, this.dataToRender[i][colIndex]);
					index++;
				}
			}
		}

		var r = hexToR(this.backColour) / 255;
		var g = hexToG(this.backColour) / 255;
		var b = hexToB(this.backColour) / 255;

		this.initWorldObjects(data3ds);

		this.gl.clearColor(r, g, b, 0); // Set the background colour.
		this.gl.enable(this.gl.DEPTH_TEST);

		this.allFramesRendered = false;
		this.bail = false;
		this.tick();

	};

	function getInternetExplorerVersion() // Returns the version of Internet
	// Explorer or a -1
	// (indicating the use of another browser).
	{
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return rv;
	}

	function supports_canvas() {
		if (canvas_support_checked)
			return canvas_supported;

		canvas_support_checked = true;
		canvas_supported = !!document.createElement('canvas').getContext;
		return canvas_supported;
	}

	this.init = function() {
		if (id)
			targetElement.removeChild(targetDiv);

		id = this.allocateId();

		transformation = new Th3dtran();

		this.createTargetDiv();

		if (!targetDiv)
			return;

		this.dataToRender = this.data.formattedValues;
		this.frames = this.data.frames;
		this.determineMinMaxZValues();
		this.createCanvas();

		if (!this.useWebGL) {
			var maxAxisValue = this.nice_num(this.maxZValue);
			this.scaleAndNormalise(this.maxZValue / maxAxisValue);
		} else {
			if (this.glOptions.autoCalcZScale)
				this.calculateZScale();

			this.glOptions.xTicksNum = this.glOptions.xLabels.length - 1;
			this.glOptions.yTicksNum = this.glOptions.yLabels.length - 1;
			this.glOptions.zTicksNum = this.glOptions.zLabels.length - 1;
		}
	};

	this.determineMinMaxZValues = function() {
		this.numXPoints = this.data.nRows;
		this.numYPoints = this.data.nCols;
		this.minZValue = Number.MAX_VALUE;
		this.maxZValue = Number.MIN_VALUE;

		if (this.frames) {
			this.numFrames = this.dataToRender.length;
			for ( var k = 0; k < this.numFrames; k++) {
				for ( var i = 0; i < this.numXPoints; i++) {
					for ( var j = 0; j < this.numYPoints; j++) {
						var value = this.dataToRender[k][i][j];

						if (value < this.minZValue)
							this.minZValue = value;

						if (value > this.maxZValue)
							this.maxZValue = value;
					}
				}
			}
		} else {
			for ( var i = 0; i < this.numXPoints; i++) {
				for ( var j = 0; j < this.numYPoints; j++) {
					var value = this.dataToRender[i][j];

					if (value < this.minZValue)
						this.minZValue = value;

					if (value > this.maxZValue)
						this.maxZValue = value;
				}
			}
		}
	}

	this.cleanUp = function() {
		this.gl = null;

		canvas.onmousedown = null;
		document.onmouseup = null;
		document.onmousemove = null;

		this.numXPoints = 0;
		this.numYPoints = 0;
		canvas = null;
		canvasContext = null;
		this.data = null;
		this.colourGradientObject = null;
		this.glSurface = null;
		this.glAxes = null;
		this.glLines = null;
		this.glTexture = null;
		this.glSphere = null;
		this.shaderProgram = null;
		this.shaderTextureProgram = null;
		this.shaderAxesProgram = null;
		this.mvMatrix = null;
		this.mvMatrixStack = null;
		this.pMatrix = null;
	}

	function hideTooltip() {
		tTip.hide();
	}

	function displayTooltip(e) {
		var position = new Point(e.x, e.y);
		tTip.show(tooltips[closestPointToMouse], 200);
	}

	this.render = function() {

		if (this.useWebGL) // Render shiny WebGL surface plot.
		{
			var r = hexToR(this.backColour) / 255;
			var g = hexToG(this.backColour) / 255;
			var b = hexToB(this.backColour) / 255;

			this.initWorldObjects(data3ds);
			this.gl.clearColor(r, g, b, 0); // Set the background colour.
			this.gl.enable(this.gl.DEPTH_TEST);
			this.tick();

			return;
		} else // Render not quite so shiny non-GL surface-plot.
		{
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			canvasContext.fillStyle = this.backColour;
			canvasContext.fillRect(0, 0, canvas.width, canvas.height);

			var canvasWidth = width;
			var canvasHeight = height;

			var minMargin = 20;
			var drawingDim = canvasWidth - minMargin * 2;
			var marginX = minMargin;
			var marginY = minMargin;

			transformation.init();
			transformation.rotate(this.currentXAngle_canvas, 0.0, this.currentZAngle_canvas);
			transformation.scale(scale);

			if (origin != null && origin != void 0)
				transformation.translate(origin.x, origin.y, 0.0);
			else
				transformation.translate(drawingDim / 2.0 + marginX, drawingDim / 2.0 + marginY, 0.0);

			cameraPosition = new Point3D(drawingDim / 2.0 + marginX, drawingDim / 2.0 + marginY, -1000.0);

			if (renderPoints) {
				for (i = 0; i < data3ds.length; i++) {
					var point3d = data3ds[i];
					canvasContext.fillStyle = '#ff2222';
					var transformedPoint = transformation.ChangeObjectPoint(point3d);
					transformedPoint.dist = distance({
						x : transformedPoint.ax,
						y : transformedPoint.ay
					}, {
						x : cameraPosition.ax,
						y : cameraPosition.ay
					});

					var x = transformedPoint.ax;
					var y = transformedPoint.ay;

					canvasContext.beginPath();
					var dotSize = JSSurfacePlot.DATA_DOT_SIZE;

					canvasContext.arc((x - (dotSize / 2)), (y - (dotSize / 2)), 1, 0, self.Math.PI * 2, true);
					canvasContext.fill();
				}
			}

			var axes = this.createAxes();
			var polygons = this.createPolygons(data3ds);

			for (i = 0; i < axes.length; i++)
				polygons[polygons.length] = axes[i];

			// Sort the polygons so that the closest ones are rendered last
			// and therefore are not occluded by those behind them.
			// This is really Painter's algorithm.
			polygons.sort(PolygonComaparator);

			canvasContext.lineWidth = 1;
			canvasContext.strokeStyle = '#888';
			canvasContext.lineJoin = "round";

			for (i = 0; i < polygons.length; i++) {
				var polygon = polygons[i];

				if (polygon.isAnAxis()) {
					var p1 = polygon.getPoint(0);
					var p2 = polygon.getPoint(1);

					canvasContext.beginPath();
					canvasContext.moveTo(p1.ax, p1.ay);
					canvasContext.lineTo(p2.ax, p2.ay);
					canvasContext.stroke();
				} else {
					var p1 = polygon.getPoint(0);
					var p2 = polygon.getPoint(1);
					var p3 = polygon.getPoint(2);
					var p4 = polygon.getPoint(3);

					var colourValue = (p1.lz * 1.0 + p2.lz * 1.0 + p3.lz * 1.0 + p4.lz * 1.0) / 4.0;

					var rgbColour = this.colourGradientObject.getColour(colourValue);
					var colr = "rgb(" + rgbColour.red + "," + rgbColour.green + "," + rgbColour.blue + ")";
					canvasContext.fillStyle = colr;

					canvasContext.beginPath();
					canvasContext.moveTo(p1.ax, p1.ay);
					canvasContext.lineTo(p2.ax, p2.ay);
					canvasContext.lineTo(p3.ax, p3.ay);
					canvasContext.lineTo(p4.ax, p4.ay);
					canvasContext.lineTo(p1.ax, p1.ay);

					if (fillRegions)
						canvasContext.fill();
					else
						canvasContext.stroke();
				}
			}

			if (supports_canvas())
				this.renderAxisText(axes);
		}
	};

	this.renderAxisText = function(axes) {
		var xLabelPoint = new Point3D(0.0, 0.5, 0.0);
		var yLabelPoint = new Point3D(-0.5, 0.0, 0.0);
		var zLabelPoint = new Point3D(-0.5, 0.5, zTextPosition);

		var transformedxLabelPoint = transformation.ChangeObjectPoint(xLabelPoint);
		var transformedyLabelPoint = transformation.ChangeObjectPoint(yLabelPoint);
		var transformedzLabelPoint = transformation.ChangeObjectPoint(zLabelPoint);

		var xAxis = axes[0];
		var yAxis = axes[1];
		var zAxis = axes[2];

		canvasContext.fillStyle = this.axisTextColour;

		if (xAxis.distanceFromCamera > yAxis.distanceFromCamera) {
			var xAxisLabelPosX = transformedxLabelPoint.ax;
			var xAxisLabelPosY = transformedxLabelPoint.ay;
			canvasContext.fillText(xTitle, xAxisLabelPosX, xAxisLabelPosY);
		}

		if (xAxis.distanceFromCamera < yAxis.distanceFromCamera) {
			var yAxisLabelPosX = transformedyLabelPoint.ax;
			var yAxisLabelPosY = transformedyLabelPoint.ay;
			canvasContext.fillText(yTitle, yAxisLabelPosX, yAxisLabelPosY);
		}

		if (xAxis.distanceFromCamera < zAxis.distanceFromCamera) {
			var zAxisLabelPosX = transformedzLabelPoint.ax;
			var zAxisLabelPosY = transformedzLabelPoint.ay;
			canvasContext.fillText(zTitle, zAxisLabelPosX, zAxisLabelPosY);
		}
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

	this.createAxes = function() {
		var axisOrigin = new Point3D(-0.5, 0.5, 0);
		var xAxisEndPoint = new Point3D(0.5, 0.5, 0);
		var yAxisEndPoint = new Point3D(-0.5, -0.5, 0);
		var zAxisEndPoint = new Point3D(-0.5, 0.5, 1);

		var transformedAxisOrigin = transformation.ChangeObjectPoint(axisOrigin);
		var transformedXAxisEndPoint = transformation.ChangeObjectPoint(xAxisEndPoint);
		var transformedYAxisEndPoint = transformation.ChangeObjectPoint(yAxisEndPoint);
		var transformedZAxisEndPoint = transformation.ChangeObjectPoint(zAxisEndPoint);

		var axes = new Array();

		var xAxis = new Polygon(cameraPosition, true);
		xAxis.addPoint(transformedAxisOrigin);
		xAxis.addPoint(transformedXAxisEndPoint);
		xAxis.calculateCentroid();
		xAxis.calculateDistance();
		axes[axes.length] = xAxis;

		var yAxis = new Polygon(cameraPosition, true);
		yAxis.addPoint(transformedAxisOrigin);
		yAxis.addPoint(transformedYAxisEndPoint);
		yAxis.calculateCentroid();
		yAxis.calculateDistance();
		axes[axes.length] = yAxis;

		var zAxis = new Polygon(cameraPosition, true);
		zAxis.addPoint(transformedAxisOrigin);
		zAxis.addPoint(transformedZAxisEndPoint);
		zAxis.calculateCentroid();
		zAxis.calculateDistance();
		axes[axes.length] = zAxis;

		return axes;
	};

	this.createPolygons = function(data3D) {
		var i;
		var j;
		var polygons = new Array();
		var index = 0;

		for (i = 0; i < this.numXPoints - 1; i++) {
			for (j = 0; j < this.numYPoints - 1; j++) {
				var polygon = new Polygon(cameraPosition, false);

				var rawP1 = data3D[j + (i * this.numYPoints)];
				var rawP2 = data3D[j + (i * this.numYPoints) + this.numYPoints];
				var rawP3 = data3D[j + (i * this.numYPoints) + this.numYPoints + 1];
				var rawP4 = data3D[j + (i * this.numYPoints) + 1];

				if (hideFlatMinPolygons
						&& (rawP2.lz == this.minZValue || (rawP1.lz == this.minZValue && rawP4.lz == this.minZValue) || ((rawP4.lz == this.minZValue || rawP3.lz == this.minZValue)
								&& i > 1 && j > 0)))
					continue;

				var p1 = transformation.ChangeObjectPoint(rawP1);
				var p2 = transformation.ChangeObjectPoint(rawP2);
				var p3 = transformation.ChangeObjectPoint(rawP3);
				var p4 = transformation.ChangeObjectPoint(rawP4);

				polygon.addPoint(p1);
				polygon.addPoint(p2);
				polygon.addPoint(p3);
				polygon.addPoint(p4);
				polygon.calculateCentroid();
				polygon.calculateDistance();

				polygons[index] = polygon;
				index++;
			}
		}

		return polygons;
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
		var marginX = minMargin;
		var marginY = minMargin;

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
		var numPoints = this.numXPoints * this.numYPoints;
		data3ds = new Array();
		dataframe = new Array();
		var index = 0;
		var colIndex;

		// printlnMessage('messages', 'JSSurfacePlot this.frames is ' +
		// this.frames);

		if (this.frames) {
			for ( var k = 0; k < this.numFrames; k++) {
				index = 0;
				dataframe = new Array();
				for (i = 0, xPos = -0.5; i < this.numXPoints; i++, xPos += xDivision) {
					for (j = 0, yPos = 0.5; j < this.numYPoints; j++, yPos -= yDivision) {
						var x = xPos;
						var y = yPos;

						if (this.useWebGL)
							colIndex = this.numYPoints - 1 - j;
						else
							colIndex = j;

						// Reverse the y-axis to match the non-webGL surface.
						dataframe[index] = new Point3D(x, y, this.dataToRender[k][i][colIndex]);
						index++;
					}
				}
				data3ds.push(dataframe);
			}
		} else {
			for (i = 0, xPos = -0.5; i < this.numXPoints; i++, xPos += xDivision) {
				for (j = 0, yPos = 0.5; j < this.numYPoints; j++, yPos -= yDivision) {
					var x = xPos;
					var y = yPos;

					if (this.useWebGL)
						colIndex = this.numYPoints - 1 - j;
					else
						colIndex = j;

					// printlnMessage('messages', 'JSSurfacePlot redraw
					// dataToRender '
					// + JSON.stringify(this.dataToRender[i][colIndex]));

					// Reverse the y-axis to match the non-webGL surface.
					data3ds[index] = new Point3D(x, y, this.dataToRender[i][colIndex]);
					index++;
				}
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

	this.getShader = function(id) {
		var shaderScript = document.getElementById(id);

		if (!shaderScript) {
			return null;
		}

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

	this.createProgram = function(fragmentShaderID, vertexShaderID) {
		if (this.gl == null)
			return null;

		var fragmentShader = this.getShader(fragmentShaderID);
		var vertexShader = this.getShader(vertexShaderID);

		if (fragmentShader == null || vertexShader == null)
			return null;

		var program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		program.pMatrixUniform = this.gl.getUniformLocation(program, "uPMatrix");
		program.mvMatrixUniform = this.gl.getUniformLocation(program, "uMVMatrix");

		program.nMatrixUniform = this.gl.getUniformLocation(program, "uNMatrix");
		program.axesColour = this.gl.getUniformLocation(program, "uAxesColour");
		program.ambientColorUniform = this.gl.getUniformLocation(program, "uAmbientColor");
		program.lightingDirectionUniform = this.gl.getUniformLocation(program, "uLightingDirection");
		program.directionalColorUniform = this.gl.getUniformLocation(program, "uDirectionalColor");

		return program;
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
		if (this.frames) {
			this.glSurface = new GLSurface(data3D[0], this);
			this.glAxes = new GLAxes(data3D[0], this);
			this.glLines = new GLLines(linePoints, this);
			// labelPos = {
			// x : 0.4,
			// y : 0.4,
			// z : 0.4
			// };
			// this.glTexture2 = new GLTexture2(this, data3D[0], "bla",
			// labelPos, 90, "x");
			//this.glTexture = new GLTexture(this);
			this.glSphere = new GLSphere(data3D[0], this);
		} else {
			this.glSurface = new GLSurface(data3D, this);
			this.glAxes = new GLAxes(data3D, this);
			this.glLines = new GLLines(linePoints, this);
			// labelPos = {
			// x : 0.4,
			// y : 0.4,
			// z : 0.4
			// };
			// this.glTexture2 = new GLTexture2(this, data3D, "bla", labelPos,
			// 90, "x");
			//this.glTexture = new GLTexture(this);
			this.glSphere = new GLSphere(data3D, this);
		}
	};

	// WebGL mouse handlers:
	var shiftPressed = false;

	this.handleMouseUp = function(event) {
		mouseDown = false;
	};

	this.drawScene = function() {
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

		this.glAxes.draw();
		this.glLines.draw();
		//this.glTexture.draw();
		//this.glTexture2.draw();
		this.glSphere.draw();

		if (this.frames && !this.allFramesRendered) {

			var timeNow = new Date().getTime();

			elapsed = timeNow - lastTime;

			if (elapsed > 1000 / this.glOptions.framesPerSecond) {
				if (!this.currentFrame) {
					this.currentFrame = 1;
				}

				this.glSurface.updateSurface(data3ds[this.currentFrame]);

				if (this.currentFrame < this.numFrames - 1)
					this.currentFrame++;
				else {
					this.allFramesRendered = true;
					this.currentFrame = 0;
				}

				lastTime = timeNow;
			}

		}

		this.glSurface.draw();
		// var timeNow = new Date().getTime();
		// printlnMessage('messages','JSSurfacePlot() before draw'+timeNow);
		// this.glSurface2.draw();
		// printlnMessage('messages','JSSurfacePlot() after draw');

		this.mvPopMatrix(this);
	};

	var lastTime = 0;
	var elapsed = 0;

	this.tick = function() {
		var self = this;

		if (this.gl == null)
			return;

		var animator = function() {
			if (self.gl == null || self.bail)
				return;

			self.drawScene();
			requestAnimFrame(animator);
		};

		requestAnimFrame(animator);
	};

	this.isWebGlEnabled = function() {
		var enabled = true;

		if (this.glOptions.chkControlId && document.getElementById(this.glOptions.chkControlId))
			enabled = document.getElementById(this.glOptions.chkControlId).checked;

		return enabled && this.initShaders();
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

	this.initGL = function(canvas) {
		var canUseWebGL = false;

		try {
			this.gl = canvas.getContext("experimental-webgl", {
				alpha : false
			});
			this.gl.viewportWidth = canvas.width;
			this.gl.viewportHeight = canvas.height;
		} catch (e) {
		}

		if (this.gl) {
			canUseWebGL = this.isWebGlEnabled();
			var self = this;

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
		}

		return canUseWebGL;
	};

	this.initCanvas = function() {
		canvas.className = "surfacePlotCanvas";
		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		canvas.style.left = '0px';
		canvas.style.top = '0px';

		targetDiv.appendChild(canvas);
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
	}

	this.createCanvas = function() {
		canvas = document.createElement("canvas");

		if (!supports_canvas()) {
			G_vmlCanvasManager.initElement(canvas);
			canvas.style.width = width;
			canvas.style.height = height;
		} else {
			this.initCanvas();
			this.useWebGL = this.initGL(canvas);
		}

		if (!this.useWebGL) {
			targetDiv.removeChild(canvas);
			canvas = document.createElement("canvas");

			this.initCanvas();

			canvasContext = canvas.getContext("2d");
			canvasContext.font = "bold 18px sans-serif";
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);

			canvasContext.fillStyle = '#000';

			canvasContext.fillRect(0, 0, canvas.width, canvas.height);

			canvasContext.beginPath();
			canvasContext.rect(0, 0, canvas.width, canvas.height);
			canvasContext.strokeStyle = '#888';
			canvasContext.stroke();

			canvas.owner = this;
			canvas.onmousemove = this.mouseIsMoving;
			canvas.onmouseout = hideTooltip;
			canvas.onmousedown = this.mouseDownd;
			canvas.onmouseup = this.mouseUpd;

			canvas.addEventListener("touchstart", this.mouseDownd, false);
			canvas.addEventListener("touchmove", this.mouseIsMoving, false);
			canvas.addEventListener("touchend", this.mouseUpd, false);
			canvas.addEventListener("touchcancel", hideTooltip, false);
		} else
			this.createHiddenCanvasForGLText();
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
			hideTooltip();
			self.calculateRotation(currentPos);
		} else if (mouseDown3) {
			hideTooltip();
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

			if (closestDist > 32) {
				hideTooltip();
				return;
			}

			displayTooltip(currentPos);
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
		if (getInternetExplorerVersion() > -1) {
			var e = window.event;

			if (e.srcElement.getAttribute('Stroked')) {
				if (mousePosX == null || mousePosY == null)
					return;
			} else {
				mousePosX = e.offsetX;
				mousePosY = e.offsetY;
			}
		} else if (e.layerX || e.layerX == 0) // Firefox
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

	this.init();
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
