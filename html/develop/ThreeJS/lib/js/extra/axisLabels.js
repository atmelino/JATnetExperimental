function makeAxisLabel(scene) {

	// add 3D text
	var materialFront = new THREE.MeshBasicMaterial({
		color : 0xff0000
	});
	var materialSide = new THREE.MeshBasicMaterial({
		color : 0x000088
	});
	var materialArray = [ materialFront, materialSide ];
	var textGeom = new THREE.TextGeometry("X", {
		size : gridSize/10,
		height : gridSize/100,
		curveSegments : 3,
		font : "helvetiker",
		weight : "bold",
		style : "normal",
		bevelThickness : 1,
		bevelSize : 2,
		bevelEnabled : true,
		material : 0,
		extrudeMaterial : 1
	});
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold

	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeom, textMaterial);

	textGeom.computeBoundingBox();
	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

	//textMesh.position.set(-0.5 * textWidth, 50, 100);
	textMesh.position.set(gridSize, 0, 0);
	textMesh.rotation.x = -Math.PI / 4;
	scene.add(textMesh);

	
	// add 3D text
	var materialFront = new THREE.MeshBasicMaterial({
		color : 0xff0000
	});
	var materialSide = new THREE.MeshBasicMaterial({
		color : 0x000088
	});
	var materialArray = [ materialFront, materialSide ];
	var textGeom = new THREE.TextGeometry("Y", {
		size : gridSize / 10,
		height : gridSize / 100,
		curveSegments : 3,
		font : "helvetiker",
		weight : "bold",
		style : "normal",
		bevelThickness : 1,
		bevelSize : 2,
		bevelEnabled : true,
		material : 0,
		extrudeMaterial : 1
	});
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold

	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeom, textMaterial);

	textGeom.computeBoundingBox();
	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

	// textMesh.position.set(-0.5 * textWidth, 50, 100);
	textMesh.position.set(0, gridSize, 0);
	textMesh.rotation.x = -Math.PI / 4;
	scene.add(textMesh);

	// Z
	var textGeom = new THREE.TextGeometry("Z", {
		size : gridSize / 10,
		height : gridSize / 100,
		curveSegments : 3,
		font : "helvetiker",
		weight : "bold",
		style : "normal",
		bevelThickness : 1,
		bevelSize : 2,
		bevelEnabled : true,
		material : 0,
		extrudeMaterial : 1
	});
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold

	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeom, textMaterial);

	textGeom.computeBoundingBox();
	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

	// textMesh.position.set(-0.5 * textWidth, 50, 100);
	textMesh.position.set(0, 0, gridSize);
	textMesh.rotation.z = -Math.PI / 4;
	scene.add(textMesh);

}
