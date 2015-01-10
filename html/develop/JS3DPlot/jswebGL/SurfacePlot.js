/*
 * SurfacePlot.js
 *
 *
 * Written by Greg Ross
 *
 * Copyright 2012 ngmoco, LLC.  Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.  You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0.  Unless required by applicable
 * law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the
 * License.
 *
 */
/*
 * This is the main class and entry point of the tool
 * and represents the Google viz API.
 * ***************************************************
 */
SurfacePlot = function(container) {
	this.containerElement = container;

	this.redraw = function() {
		this.surfacePlot.init();
		this.surfacePlot.redraw();
	};
};

SurfacePlot.prototype.draw = function(data, linePoints, options, basicPlotOptions, glOptions) {
	var xPos = options.xPos;
	var yPos = options.yPos;
	var w = options.width;
	var h = options.height;
	var colourGradient = options.colourGradient;

	var fillPolygons = basicPlotOptions.fillPolygons;
	var tooltips = basicPlotOptions.tooltips;
	var renderPoints = basicPlotOptions.renderPoints;

	var xTitle = options.xTitle;
	var yTitle = options.yTitle;
	var zTitle = options.zTitle;
	var backColour = options.backColour;
	var axisTextColour = options.axisTextColour;
	var hideFlatMinPolygons = options.hideFlatMinPolygons;
	var origin = options.origin;
	var startXAngle_canvas = options.startXAngle;
	var startZAngle_canvas = options.startZAngle;
	var zAxisTextPosition = options.zAxisTextPosition;

	// printlnMessage('messages', 'surfacePlot data '+JSON.stringify(data));

	if (this.surfacePlot) {

		this.surfacePlot.cleanUp();
		this.containerElement.innerHTML = "";

		startXAngle_canvas = this.surfacePlot.currentXAngle_canvas;
		startZAngle_canvas = this.surfacePlot.currentZAngle_canvas;
		var rotationMatrix = this.surfacePlot.rotationMatrix;

	}

	this.surfacePlot = new JSSurfacePlot(xPos, yPos, w, h, colourGradient, this.containerElement, fillPolygons,
			tooltips, xTitle, yTitle, zTitle, renderPoints, backColour, axisTextColour, hideFlatMinPolygons, origin, startXAngle_canvas, startZAngle_canvas, rotationMatrix, zAxisTextPosition,
			glOptions, data,linePoints);

	this.surfacePlot.webGLStart();
	this.surfacePlot.redraw();
};

Array.prototype.clone = function() {
	var arr = this.slice(0);
	for ( var i = 0; i < this.length; i++) {
		if (this[i].clone) {
			arr[i] = this[i].clone();
		}
	}
	return arr;
}


SurfacePlot.prototype.getChart = function() {
	return this.surfacePlot;
}

SurfacePlot.prototype.cleanUp = function() {
	if (this.surfacePlot == null)
		return;

	this.surfacePlot.cleanUp();
	this.surfacePlot = null;
}

/**
 * Given two coordinates, return the Euclidean distance between them
 */
function distance(p1, p2) {
	return Math.sqrt(((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)));
}

/*
 * Matrix3d: This class represents a 3D matrix.
 * ********************************************
 */
Matrix3d = function() {
	this.matrix = new Array();
	this.numRows = 4;
	this.numCols = 4;

	this.init = function() {
		this.matrix = new Array();

		for ( var i = 0; i < this.numRows; i++) {
			this.matrix[i] = new Array();
		}
	};

	this.getMatrix = function() {
		return this.matrix;
	};

	this.matrixReset = function() {
		for ( var i = 0; i < this.numRows; i++) {
			for ( var j = 0; j < this.numCols; j++) {
				this.matrix[i][j] = 0;
			}
		}
	};

	this.matrixIdentity = function() {
		this.matrixReset();
		this.matrix[0][0] = this.matrix[1][1] = this.matrix[2][2] = this.matrix[3][3] = 1;
	};

	this.matrixCopy = function(newM) {
		var temp = new Matrix3d();
		var i, j;

		for (i = 0; i < this.numRows; i++) {
			for (j = 0; j < this.numCols; j++) {
				temp.getMatrix()[i][j] = (this.matrix[i][0] * newM.getMatrix()[0][j])
						+ (this.matrix[i][1] * newM.getMatrix()[1][j]) + (this.matrix[i][2] * newM.getMatrix()[2][j])
						+ (this.matrix[i][3] * newM.getMatrix()[3][j]);
			}
		}

		for (i = 0; i < this.numRows; i++) {
			this.matrix[i][0] = temp.getMatrix()[i][0];
			this.matrix[i][1] = temp.getMatrix()[i][1];
			this.matrix[i][2] = temp.getMatrix()[i][2];
			this.matrix[i][3] = temp.getMatrix()[i][3];
		}
	};

	this.matrixMult = function(m1, m2) {
		var temp = new Matrix3d();
		var i, j;

		for (i = 0; i < this.numRows; i++) {
			for (j = 0; j < this.numCols; j++) {
				temp.getMatrix()[i][j] = (m2.getMatrix()[i][0] * m1.getMatrix()[0][j])
						+ (m2.getMatrix()[i][1] * m1.getMatrix()[1][j]) + (m2.getMatrix()[i][2] * m1.getMatrix()[2][j])
						+ (m2.getMatrix()[i][3] * m1.getMatrix()[3][j]);
			}
		}

		for (i = 0; i < this.numRows; i++) {
			m1.getMatrix()[i][0] = temp.getMatrix()[i][0];
			m1.getMatrix()[i][1] = temp.getMatrix()[i][1];
			m1.getMatrix()[i][2] = temp.getMatrix()[i][2];
			m1.getMatrix()[i][3] = temp.getMatrix()[i][3];
		}
	};

	this.toString = function() {
		return this.matrix.toString();
	}

	this.init();
};

/*
 * Point3D: This class represents a 3D point.
 * ******************************************
 */
Point3D = function(x, y, z) {
	this.displayValue = "";

	this.lx;
	this.ly;
	this.lz;
	this.lt;

	this.wx;
	this.wy;
	this.wz;
	this.wt;

	this.ax;
	this.ay;
	this.az;
	this.at;

	this.dist;

	this.initPoint = function() {
		this.lx = this.ly = this.lz = this.ax = this.ay = this.az = this.at = this.wx = this.wy = this.wz = 0;
		this.lt = this.wt = 1;
	};

	this.init = function(x, y, z) {
		this.initPoint();
		this.lx = x;
		this.ly = y;
		this.lz = z;

		this.ax = this.lx;
		this.ay = this.ly;
		this.az = this.lz;
	};

	this.init(x, y, z);
};

/*
 * Polygon: This class represents a polygon on the surface plot.
 * ************************************************************
 */
Polygon = function(cameraPosition, isAxis) {
	this.points = new Array();
	this.cameraPosition = cameraPosition;
	this.isAxis = isAxis;
	this.centroid = null;
	this.distanceFromCamera = null;

	this.isAnAxis = function() {
		return this.isAxis;
	};

	this.addPoint = function(point) {
		this.points[this.points.length] = point;
	};

	this.distance = function() {
		return this.distance2(this.cameraPosition, this.centroid);
	};

	this.calculateDistance = function() {
		this.distanceFromCamera = this.distance();
	};

	this.calculateCentroid = function() {
		var xCentre = 0;
		var yCentre = 0;
		var zCentre = 0;

		var numPoints = this.points.length * 1.0;

		for ( var i = 0; i < numPoints; i++) {
			xCentre += this.points[i].ax;
			yCentre += this.points[i].ay;
			zCentre += this.points[i].az;
		}

		xCentre /= numPoints;
		yCentre /= numPoints;
		zCentre /= numPoints;

		this.centroid = new Point3D(xCentre, yCentre, zCentre);
	};

	this.distance2 = function(p1, p2) {
		return ((p1.ax - p2.ax) * (p1.ax - p2.ax)) + ((p1.ay - p2.ay) * (p1.ay - p2.ay))
				+ ((p1.az - p2.az) * (p1.az - p2.az));
	};

	this.getPoint = function(i) {
		return this.points[i];
	};
};

/*
 * PolygonComaparator: Class used to sort arrays of polygons.
 * ************************************************************
 */
PolygonComaparator = function(p1, p2) {
	var diff = p1.distanceFromCamera - p2.distanceFromCamera;

	if (diff == 0)
		return 0;
	else if (diff < 0)
		return -1;
	else if (diff > 0)
		return 1;

	return 0;
};

/*
 * Th3dtran: Class for matrix manipuation.
 * ************************************************************
 */
Th3dtran = function() {
	this.rMat;
	this.rMatrix;
	this.objectMatrix;

	this.init = function() {
		this.rMat = new Matrix3d();
		this.rMatrix = new Matrix3d();
		this.objectMatrix = new Matrix3d();

		this.initMatrix();
	};

	this.initMatrix = function() {
		this.objectMatrix.matrixIdentity();
	};

	this.translate = function(x, y, z) {
		this.rMat.matrixIdentity();
		this.rMat.getMatrix()[3][0] = x;
		this.rMat.getMatrix()[3][1] = y;
		this.rMat.getMatrix()[3][2] = z;

		this.objectMatrix.matrixCopy(this.rMat);
	};

	this.rotate = function(x, y, z) {
		var rx = x * (Math.PI / 180.0);
		var ry = y * (Math.PI / 180.0);
		var rz = z * (Math.PI / 180.0);

		this.rMatrix.matrixIdentity();
		this.rMat.matrixIdentity();
		this.rMat.getMatrix()[1][1] = Math.cos(rx);
		this.rMat.getMatrix()[1][2] = Math.sin(rx);
		this.rMat.getMatrix()[2][1] = -(Math.sin(rx));
		this.rMat.getMatrix()[2][2] = Math.cos(rx);
		this.rMatrix.matrixMult(this.rMatrix, this.rMat);

		this.rMat.matrixIdentity();
		this.rMat.getMatrix()[0][0] = Math.cos(ry);
		this.rMat.getMatrix()[0][2] = -(Math.sin(ry));
		this.rMat.getMatrix()[2][0] = Math.sin(ry);
		this.rMat.getMatrix()[2][2] = Math.cos(ry);
		this.rMat.matrixMult(this.rMatrix, this.rMat);

		this.rMat.matrixIdentity();
		this.rMat.getMatrix()[0][0] = Math.cos(rz);
		this.rMat.getMatrix()[0][1] = Math.sin(rz);
		this.rMat.getMatrix()[1][0] = -(Math.sin(rz));
		this.rMat.getMatrix()[1][1] = Math.cos(rz);
		this.rMat.matrixMult(this.rMatrix, this.rMat);

		this.objectMatrix.matrixCopy(this.rMatrix);
	};

	this.scale = function(scale) {
		this.rMat.matrixIdentity();
		this.rMat.getMatrix()[0][0] = scale;
		this.rMat.getMatrix()[1][1] = scale;
		this.rMat.getMatrix()[2][2] = scale;

		this.objectMatrix.matrixCopy(this.rMat);
	};

	this.ChangeObjectPoint = function(p) {
		p.ax = (p.lx * this.objectMatrix.getMatrix()[0][0] + p.ly * this.objectMatrix.getMatrix()[1][0] + p.lz
				* this.objectMatrix.getMatrix()[2][0] + this.objectMatrix.getMatrix()[3][0]);
		p.ay = (p.lx * this.objectMatrix.getMatrix()[0][1] + p.ly * this.objectMatrix.getMatrix()[1][1] + p.lz
				* this.objectMatrix.getMatrix()[2][1] + this.objectMatrix.getMatrix()[3][1]);
		p.az = (p.lx * this.objectMatrix.getMatrix()[0][2] + p.ly * this.objectMatrix.getMatrix()[1][2] + p.lz
				* this.objectMatrix.getMatrix()[2][2] + this.objectMatrix.getMatrix()[3][2]);

		return p;
	};

	this.init();
};

/*
 * Point: A simple 2D point.
 * ************************************************************
 */
Point = function(x, y) {
	this.x = x;
	this.y = y;
};

/*
 * This function displays tooltips and was adapted from original code by Michael
 * Leigeber. See http://www.leigeber.com/
 */
Tooltip = function(useExplicitPositions, tooltipColour) {
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt, t, c, b, h;
	var ie = document.all ? true : false;

	this.show = function(v, w) {
		if (tt == null) {
			tt = document.createElement('div');
			tt.style.color = tooltipColour;

			tt.style.position = 'absolute';
			tt.style.display = 'block';

			t = document.createElement('div');

			t.style.display = 'block';
			t.style.height = '5px';
			t.style.marginleft = '5px';
			t.style.overflow = 'hidden';

			c = document.createElement('div');

			b = document.createElement('div');

			tt.appendChild(t);
			tt.appendChild(c);
			tt.appendChild(b);
			document.body.appendChild(tt);

			if (!ie) {
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
			} else
				tt.style.opacity = 1;

		}

		if (!useExplicitPositions)
			document.onmousemove = this.pos;

		tt.style.display = 'block';
		c.innerHTML = '<span style="font-weight:bold; font-family: arial;">' + v + '</span>';
		tt.style.width = w ? w + 'px' : 'auto';

		if (!w && ie) {
			t.style.display = 'none';
			b.style.display = 'none';
			tt.style.width = tt.offsetWidth;
			t.style.display = 'block';
			b.style.display = 'block';
		}

		if (tt.offsetWidth > maxw) {
			tt.style.width = maxw + 'px';
		}

		h = parseInt(tt.offsetHeight) + top;

		if (!ie) {
			clearInterval(tt.timer);
			tt.timer = setInterval(function() {
				fade(1)
			}, timer);
		}
	};

	this.setPos = function(e) {
		tt.style.top = e.y + 'px';
		tt.style.left = e.x + 'px';
	};

	this.pos = function(e) {
		var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
		var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
		tt.style.top = (u - h) + 'px';
		tt.style.left = (l + left) + 'px';
		tt.style.zIndex = 999999999999;
	};

	function fade(d) {
		var a = alpha;

		if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
			var i = speed;

			if (endalpha - a < speed && d == 1) {
				i = endalpha - a;
			} else if (alpha < speed && d == -1) {
				i = a;
			}

			alpha = a + (i * d);
			tt.style.opacity = alpha * .01;
			tt.style.filter = 'alpha(opacity=' + alpha + ')';
		} else {
			clearInterval(tt.timer);

			if (d == -1) {
				tt.style.display = 'none';
			}
		}
	}

	this.hide = function() {
		if (tt == null)
			return;

		if (!ie) {
			clearInterval(tt.timer);
			tt.timer = setInterval(function() {
				fade(-1)
			}, timer);
		} else {
			tt.style.display = 'none';
		}
	};
};

degToRad = function(degrees) {
	return degrees * Math.PI / 180;
};

function hexToR(h) {
	return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
	return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
	return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
	return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

log = function(base, value) {
	return Math.log(value) / Math.log(base);
};
