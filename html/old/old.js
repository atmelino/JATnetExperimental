


	function liveClicked() {
		if (document.getElementById('livecb').checked) {
			//doTimer();
			printlnMessage('messages', 'live is on');
			printlnMessage('messages', document.getElementById('cbStop').checked);
			document.getElementById('cbStop').checked = false;
			//document.getElementById('cbStop').checked=false;
			//$("#cbStop").prop("checked", false);

			$('input[name=fastForward]').attr('checked', true);

		} else {
			//stopCount();
		}
	}


// skyBox/FOG
		var skyBoxGeometry = new THREE.CubeGeometry(1000 * gridSize, 1000 * gridSize, 1000 * gridSize);
		var skyBoxMaterial = new THREE.MeshBasicMaterial({
			color : 0x9999ff,
			side : THREE.BackSide
		});
		var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
		scene.add(skyBox);
		//scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

	
	var BGChanger = function() {
		console.log('example');
	}
	//gui.add(parameters, 'background', bgList).name('background').onChange(BGChanger);




		//satellite.position.set(0, 30, 0);

		// 		z = 1126.5079268573745;
		// 		y = 3989.067891143869;
		// 		x = 7340.005746153715;
		// 		satellite.position.set(y, z, x);



		if (false) {
		var sphereGeo = new THREE.SphereGeometry(earthRadius, segments, segments);

			var colors = THREE.ImageUtils.loadTexture("../lib/images/earth-day.jpg");
			// 		var colors = THREE.ImageUtils.loadTexture("../lib/images/land_ocean_ice_cloud_2048.jpg");
			var earthMaterial = new THREE.MeshLambertMaterial({
				color : 0xffffff,
				map : colors,
				transparent : true,
				opacity : 0.8
			});
			earthSphere = new THREE.Mesh(sphereGeo, earthMaterial);
			scene.add(earthSphere);
		}
		
		


		if (false) {
			var sphereGeo = new THREE.SphereGeometry(radius + 1, 64, 32);
			var colors = THREE.ImageUtils.loadTexture("../lib/images/earthNight4K.jpg");
			var earthMaterialNight = new THREE.MeshLambertMaterial({
				//color : 0xffffff,
				map : colors,
				transparent : true,
				opacity : 0.3,
				//emissive : 0xffffff,
				emissive : 0xcccccc,
			});
			earthSphereNight = new THREE.Mesh(sphereGeo, earthMaterialNight);
			scene.add(earthSphereNight);
		}

			// document.getElementById('iframe_a').contentWindow.scrollTo(0,500);
			// this.contentWindow.document.documentElement.scrollTop=0;


// $("#scroll").click(function() {
// alert("Handler for .click() called.");
// document.getElementById('iframe_a').contentWindow.scrollTo(0, 0);
// });

function scroll() {
	//alert("Handler for .click() called.");
	//document.getElementById('iframe_a').contentWindow.scrollTo(100, 100);
	//document.getElementById('mainarea').contentWindow.scrollTo(100, 100);

	document.location.href = "#top";
}

// $("#iframe_a").ready(function () {
// alert('iFrame loaded!');
// });



// $('#iframe_a').attr('src', 'Applications.html');

	// $('#container').load('home.html');
	// document.title = 'JAT';
	// $('#container').load(page);



		// 		var lineGeometry = new THREE.Geometry();
		// 		var vertArray = lineGeometry.vertices;
		// 		for ( var i = 0; i < 12; i++) {
		// 			vertArray.push(new THREE.Vector3(Math.random() * i * 1000, Math.random() * i * 1000, Math.random() * i * 1000));
		// 		}
		// 		lineGeometry.computeLineDistances();
		// 		var lineMaterial = new THREE.LineBasicMaterial({
		// 			color : 0xcc0000
		// 		});
		// 		var line = new THREE.Line(lineGeometry, lineMaterial);
		// 		scene.add(line);


	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = '64px Arial';
	var s = '-10000         10000';
	canvas.width = context.measureText(s).width;
	canvas.height = Math.ceil(64 * 1.25);
	context.font = '64px Arial';
	context.fillStyle = "#FF0000";
	context.fillText(s, 0, 64);

	var tex = new THREE.Texture(canvas);
	tex.needsUpdate = true;

	var plane = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width * 10, canvas.height * 10), new THREE.MeshBasicMaterial({
		map : tex,
		color : 0xFFFFFF,
		opacity : 1
	}));
	plane.doubleSided = true;
	plane.position.set(0, -gridSize, 1.1 * gridSize);
	plane.rotation.x = -Math.PI / 2;
	//scene.add(plane);


function PHPtest()
{

	var thisIP="<?php echo $_SERVER['SERVER_ADDR'];?>";
    //alert("<?php echo $_SERVER['SERVER_ADDR'];?>");
    //alert(thisIP);

}


function redirect()
{

	var thisIP="<?php echo $_SERVER['SERVER_ADDR'];?>";
	newAddress="http://"+thisIP+":8080/JATServlet/JS3DPlot/JS3DPlot_orbit02.html";
	linkClick(newAddress);
}

// $('div.menu a').click(function() {
// // printlnMessage('messages',this.id);
// if (this.id == 'WebApps')
// linkClick('WebApps.php', 'Web Apps');
// else
// linkClick(this.id + '.html', 'JAT ' + this.id);
// // alert(this.href);
// return false;
// });

// $('.has-sub').click(function(e) {
// alert('clicked');
// e.preventDefault();
// $(this).parent().toggleClass('tap');
// });
// $('.myhome').click(function(e) {
// alert('clicked');
// linkClick('home.html', 'JAT');
// });
// $('.Documentation').click(function(e) {
// linkClick('Documentation.html', 'Documentation');
// });
// $('.Applications').click(function(e) {
// linkClick('Applications.html', 'Applications');
// });
// $('.WebApps').click(function(e) {
// linkClick('WebApps.html', 'Web Apps');
// });
// $('.Examples').click(function(e) {
// linkClick('Examples.html', 'Examples');
// });
// $('.Development').click(function(e) {
// linkClick('Development.html', 'Development');
// });
// $('.Testing').click(function(e) {
// linkClick('Testing.html', 'Testing');
// });
// $('.Licenses').click(function(e) {
// linkClick('Licenses.html', 'Licenses');
// });
// $('.Support').click(function(e) {
// linkClick('Support.html', 'Support');
// });
// $('.Screenshots').click(function(e) {
// linkClick('Screenshots.html', 'Screenshots');
// });

// <li><a class='Screenshots'>Screenshots</a></li>

