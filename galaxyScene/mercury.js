var mercuryOrbitRadius = 120,
    mercuryOrbitAngle = -100,
    mercuryOrbitSpeed = 0.8;

var mercuryGeometry = new THREE.SphereGeometry(7, 28.8, 14); 
var mercuryMap  = textureLoader.load('assets/planetPics/mercurymap.jpg');
var mercuryBump = textureLoader.load('assets/planetPics/mercurybump.jpg');
var mercuryTexture =  new THREE.MeshPhongMaterial( { map: mercuryMap, bumpMap: mercuryBump} );
Mercury = new THREE.Mesh( mercuryGeometry, mercuryTexture); 
Mercury.receiveShadow = true; 
