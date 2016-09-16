//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 

var sunGeometry = new THREE.SphereGeometry(55, 28.8, 20); 
var sunMap  = textureLoader.load('assets/planetPics/sunmap.jpg');
var sunTexture =  new THREE.MeshPhongMaterial( { map: sunMap} );
theSun = new THREE.Mesh( sunGeometry, sunTexture); 
theSun.rotation.z = 23.439281 * Math.PI / 180; //tilt of earth in radians;
theSun.position.set(0,0,0); 