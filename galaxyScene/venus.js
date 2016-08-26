

venusOrbitRadius = 200,
venusOrbitAngle = 40,
venusOrbitSpeed = 0.2;


var venusGeometry = new THREE.SphereGeometry(15, 28.8, 14); 
var venusMap  = textureLoader.load('assets/planetPics/venusmap.jpg');
var venusBump = textureLoader.load('assets/planetPics/venusbump.jpg');
var venusTexture =  new THREE.MeshPhongMaterial( { map: venusMap, bumpMap: venusBump} );
Venus = new THREE.Mesh( venusGeometry, venusTexture); 
Venus.receiveShadow = true; 
