//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 

venusOrbitRadius = 200,
venusOrbitAngle = 40,
venusOrbitSpeed = 0.2;


var venusGeometry = new THREE.SphereGeometry(15, 28.8, 14); 
var venusMap  = textureLoader.load('assets/planetPics/venusmap.jpg');
var venusBump = textureLoader.load('assets/planetPics/venusbump.jpg');
var venusTexture =  new THREE.MeshPhongMaterial( { map: venusMap, bumpMap: venusBump} );
Venus = new THREE.Mesh( venusGeometry, venusTexture); 
Venus.receiveShadow = true; 
