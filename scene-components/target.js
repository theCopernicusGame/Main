

var targetMaterial = new THREE.MeshPhongMaterial( 
    { color: 0xffffff, vertexColors: THREE.FaceColors } );
    
    var targetGeometry = new THREE.CubeGeometry( .5, .5, .5, 3, 3, 3 );
    for ( var i = 0; i < targetGeometry.faces.length; i++ ) 
    {
        face  = targetGeometry.faces[ i ];    
        face.color.setRGB( Math.random(), Math.random(), Math.random() );       
    }
    var targetGeometry2 = new THREE.CubeGeometry( .5, .5, .5, 3, 3, 3 );
    for ( var i = 0; i < targetGeometry2.faces.length; i++ ) 
    {
        face  = targetGeometry2.faces[ i ];    
        face.color.setRGB( Math.random(), Math.random(), Math.random() );       
    }
    target = new Physijs.BoxMesh( targetGeometry2, targetMaterial, 1, .3 );
    target.position.set(-8, .5, 0);
    target.receiveShadow = true;
    target.castShadow = true;

    target2 = new Physijs.BoxMesh( targetGeometry, targetMaterial, 1, .3 );
    target2.position.set(3, .5, 0);
    target2.receiveShadow = true;
    target2.castShadow = true;
   