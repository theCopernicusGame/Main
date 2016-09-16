//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 
 
marsOrbitRadius = 355,
marsOrbitAngle = 75,
marsOrbitSpeed = 0.04;


var marsGeometry = new THREE.SphereGeometry(15, 28.8, 14); 
var marsMap  = textureLoader.load('assets/planetPics/mars_1k_color.jpg');
var marsBump = textureLoader.load('assets/planetPics/marsbump1k.jpg');
var marsNormal = textureLoader.load('assets/planetPics/mars_1k_normal.jpg');
var marsTexture =  new THREE.MeshPhongMaterial( { map: marsMap, bumpMap: marsBump, normalMap: marsNormal} );
Mars = new THREE.Mesh( marsGeometry, marsTexture); 
Mars.receiveShadow = true; 