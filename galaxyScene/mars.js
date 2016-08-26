 
marsOrbitRadius = 355,
marsOrbitAngle = 50,
marsOrbitSpeed = 0.04;


var marsGeometry = new THREE.SphereGeometry(15, 28.8, 14); 
var marsMap  = textureLoader.load('assets/planetPics/mars_1k_color.jpg');
var marsBump = textureLoader.load('assets/planetPics/marsbump1k.jpg');
var marsNormal = textureLoader.load('assets/planetPics/mars_1k_normal.jpg');
var marsTexture =  new THREE.MeshPhongMaterial( { map: marsMap, bumpMap: marsBump, normalMap: marsNormal} );
Mars = new THREE.Mesh( marsGeometry, marsTexture); 
Mars.receiveShadow = true; 