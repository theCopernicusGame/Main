//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 
nOrbitRadius = 650,
nOrbitAngle = -100,
nOrbitSpeed = 0.2;


var neptuneGeometry = new THREE.SphereGeometry(21, 28.8, 14); 
var neptuneMap  = textureLoader.load('assets/planetPics/neptunemap.jpg');
//var venusBump = textureLoader.load('assets/planetPics/venusbump.jpg');
var neptuneTexture =  new THREE.MeshPhongMaterial( { map: neptuneMap} );
Neptune = new THREE.Mesh( neptuneGeometry, neptuneTexture); 
Neptune.receiveShadow = true; 
