		// note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
		var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(10, 10);
		// DoubleSide: render texture on both sides of mesh
		var floorMaterial = new THREE.MeshBasicMaterial({
			map : floorTexture,
			side : THREE.DoubleSide
		});
		var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.position.y = -0.5;
		floor.rotation.x = Math.PI / 2;
		//scene.add(floor);
