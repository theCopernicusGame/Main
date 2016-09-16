//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 

uOrbitRadius = 530,
uOrbitAngle = -70,
uOrbitSpeed = 0.04;


var uranusGeometry = new THREE.SphereGeometry(15, 28.8, 20); 
var uranusMap  = textureLoader.load('assets/planetPics/uranusmap.jpg');
var uranusTexture =  new THREE.MeshPhongMaterial( { map: uranusMap} );
Uranus = new THREE.Mesh( uranusGeometry, uranusTexture); 
Uranus.receiveShadow = true; 


var uiRingMap  = textureLoader.load('assets/planetPics/saturnringcolor.jpg');
var uiRing = new THREE.Mesh(new THREE.RingGeometry(24.5, 28, 50), new THREE.MeshLambertMaterial({color: 0x334455,  side: THREE.DoubleSide, alphaMap: ringAlphaMap}));
uiRing.rotation.x = Math.PI / 1.15;

var umRing = new THREE.Mesh(new THREE.RingGeometry(19, 21, 50), new THREE.MeshLambertMaterial({color: 0x334455, side: THREE.DoubleSide, alphaMap: ringAlphaMap}));
umRing.rotation.x = Math.PI / 1.15;

var uoRing = new THREE.Mesh(new THREE.RingGeometry(30, 34, 50), new THREE.MeshLambertMaterial({color: 0x334455, side: THREE.DoubleSide, alphaMap: ringAlphaMap}));
uoRing.rotation.x = Math.PI / 1.15;
