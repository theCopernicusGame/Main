 
    jupiterOrbitRadius = 530,
    jupiterOrbitAngle = -20,
    jupiterOrbitSpeed = 0.05;

    jupiterAndGanymede = new THREE.Object3D();
    // jupiterAndGanymede.rotation.z = 23.439281 * Math.PI / 180; 
    jupiterAndGanymede.receiveShadow = true; 

    ganymedeOrbitRadius = 32,
    ganymedeOrbitAngle = 20,
    ganymedeOrbitSpeed = 0.7;
 
    var jupiterGeometry = new THREE.SphereGeometry(23, 28.8, 15); 
    var jupiterMap  = textureLoader.load('assets/planetPics/jupitermap.jpg');
    var jupiterTexture =  new THREE.MeshPhongMaterial( { map: jupiterMap} );
    Jupiter = new THREE.Mesh( jupiterGeometry, jupiterTexture); 
    Jupiter.receiveShadow = false; 


    Ganymede = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 15),  new THREE.MeshPhongMaterial({

    map: textureLoader.load('assets/planetPics/plutomap1k.jpg'), 
    bumpMap: textureLoader.load('assets/planetPics/plutobump1k.jpg')
  
}));