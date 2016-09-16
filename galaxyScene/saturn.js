//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 

saturnOrbitRadius = 405,
saturnOrbitAngle = -165,
saturnOrbitSpeed = 0.03;

var saturnGeometry = new THREE.SphereGeometry(15, 28.8, 14); 
var saturnMap  = textureLoader.load('assets/planetPics/saturnmap.jpg');
var saturnTexture =  new THREE.MeshPhongMaterial( { map: saturnMap} );
Saturn = new THREE.Mesh( saturnGeometry, saturnTexture); 
Saturn.receiveShadow = true; 
Saturn.rotation.x = Math.PI / .5;


var ringMap  = textureLoader.load('assets/planetPics/saturnringcolor.jpg');
var ringAlphaMap = textureLoader.load('assets/planetPics/saturnringpattern.gif');
var Ring = new THREE.Mesh(new THREE.RingGeometry(24.5, 28, 50), new THREE.MeshPhongMaterial({color: 0x334455, side: THREE.DoubleSide}));
Ring.rotation.x = Math.PI / 1.15;

var iRing = new THREE.Mesh(new THREE.RingGeometry(19, 24, 50), new THREE.MeshPhongMaterial({color: 0x334455, side: THREE.DoubleSide}));
iRing.rotation.x = Math.PI / 1.15;
