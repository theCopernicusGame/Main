//Each planet has it's own orbitRadius (dist. from sun), Orbit Angle (initial starting position in it's elliptical pattern) and speed
//Each planet is using a combination of maps - color map is the visual look, bump map adds the appearance of mountains (topography)
//specular map adds reflectiveness re light. 
earthOrbitRadius = 300,
earthOrbitAngle = 80,
earthOrbitSpeed = 0.1,

moonOrbitRadius = 24,
moonOrbitAngle = 20,
moonOrbitSpeed = 0.7;


var textureLoader = new THREE.TextureLoader();
theEarthAndMoon = new THREE.Object3D();
theEarthAndMoon.rotation.z = 23.439281 * Math.PI / 180; //tilt of earth in radians;
theEarthAndMoon.receiveShadow = true; 


var earthGeometry = new THREE.SphereGeometry(15, 28.8, 15);
var earthMap  = textureLoader.load('assets/planetPics/earthmap1k.jpg');
var earthBump = textureLoader.load('assets/planetPics/earthbump1k.jpg');
var earthSpec = textureLoader.load('assets/planetPics/earthspec1k.jpg');
var earthTexture =  new THREE.MeshPhongMaterial( { map: earthMap, bumpMap: earthBump, specularMap: earthMap} );
var theEarth = new THREE.Mesh(earthGeometry, earthTexture );


var cloudGeometry   = new THREE.SphereGeometry(15.5, 28.8, 14.4);
var canvasCloud = textureLoader.load('assets/planetPics/earth_clouds.png');
var cloudMaterial  = new THREE.MeshPhongMaterial( {map: canvasCloud, transparent: true, depthWrite: false, opacity: .7} );
var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);


theMoon = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 15),  new THREE.MeshPhongMaterial({

    map: textureLoader.load('assets/planetPics/moonmap1k.jpg'), 
    bumpMap: textureLoader.load('assets/planetPics/moonbump1k.jpg')
  
}));


