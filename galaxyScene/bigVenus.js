var venusGeometry = new THREE.SphereGeometry(30, 28.8, 20); 
var venusMap  = textureLoader.load('assets/planetPics/venusmap.jpg');
var venusBump = textureLoader.load('assets/planetPics/venusbump.jpg');
var venusTexture =  new THREE.MeshPhongMaterial( { map: venusMap, bumpMap: venusBump} );
BigVenus = new THREE.Mesh( venusGeometry, venusTexture); 
BigVenus.receiveShadow = true; 