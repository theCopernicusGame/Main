var sunGeometry = new THREE.SphereGeometry(55, 28.8, 20); 
var sunMap  = textureLoader.load('assets/planetPics/sunmap.jpg');
var sunTexture =  new THREE.MeshPhongMaterial( { map: sunMap} );
theSun = new THREE.Mesh( sunGeometry, sunTexture); 
theSun.rotation.z = 23.439281 * Math.PI / 180; //tilt of earth in radians;
theSun.position.set(0,0,0); 