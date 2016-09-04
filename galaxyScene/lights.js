var light = new THREE.PointLight( 0xFAFAFA, 1);
light.position.set( 0, 0, 0 );

var searchLight = new THREE.PointLight( 0xFAFAFA, 3);
light.position.set( -45, 5, -110 );


var sunLight1 = new THREE.SpotLight(0xFFFFFF, 4);
sunLight1.position.set(0, 150, 0);
sunLight1.angle = .5; 
sunLight1.target = theSun; 
sunLight1.distance = 150; 
sunLight1.decay = 1; 


var sunLight2 = new THREE.SpotLight(0xFFFFFF, 4);
sunLight2.position.set(0, -150, 0);
sunLight2.target = theSun;
sunLight2.angle = .9;  
sunLight2.distance = 150;
sunLight2.decay = 1;  


var sunLight3 = new THREE.SpotLight(0xFFFFFF, 3);
sunLight3.position.set(100, 0, 0);
sunLight3.target = theSun;
sunLight3.angle = .9;  
sunLight3.distance = 100; 
sunLight3.decay = 1; 


var sunLight4 = new THREE.SpotLight(0xFFFFFF, 6);
sunLight4.position.set(0, 0, 100);
sunLight4.target = theSun;
sunLight4.angle = .9;  
sunLight4.distance = 100; 
sunLight4.decay = 1; 


var sunLight5 = new THREE.SpotLight(0xFFFFFF, 3);
sunLight5.position.set(-100, 0, 30);
sunLight5.target = theSun;
sunLight5.angle = .6;  
sunLight5.distance = 100; 
sunLight5.decay = 1; 


var sunLight6 = new THREE.SpotLight(0xFFFFFF, 2);
sunLight6.position.set(80, 50, 80);
sunLight6.target = theSun;
sunLight6.angle = .6;  
sunLight6.distance = 130; 


var sunLight7 = new THREE.SpotLight(0xFFFFFF, 1.1);
sunLight7.position.set(-100, 50, 80);
sunLight7.target = theSun;
sunLight7.angle = .5;  
sunLight7.distance = 140; 


var sunLight8 = new THREE.SpotLight(0xFFFFFF, 2);
sunLight8.position.set(-100, -50, 50);
sunLight8.target = theSun;
sunLight8.angle = .5;  
sunLight8.distance = 100; 


 var sunLight9 = new THREE.SpotLight(0xFFFFFF, 2);
sunLight9.position.set(80, -50, 80);
sunLight9.target = theSun;
sunLight9.angle = .6;  
sunLight9.distance = 130; 


var sunLight10 = new THREE.SpotLight(0xFFFFFF, 1.5);
sunLight10.position.set(-100, 80, 120);
sunLight10.target = theSun;
sunLight10.angle = .5;  
sunLight10.distance = 150; 


var sunLight11 = new THREE.SpotLight(0xFFFFFF, 1.5);
sunLight11.position.set(-100, -80, 120);
sunLight11.target = theSun;
sunLight11.angle = .5;  
sunLight11.distance = 150; 


 var sunLight12 = new THREE.SpotLight(0xFFFFFF, 1.5);
sunLight12.position.set(-100, 50, 80);
sunLight12.target = theSun;
sunLight12.angle = .5;  
sunLight12.distance = 140; 




var aLight = new THREE.AmbientLight( 0x334455 ); // soft white light

lightHelper1 = new THREE.SpotLightHelper( sunLight1 );
lightHelper2 = new THREE.SpotLightHelper( sunLight2 );
lightHelper3 = new THREE.SpotLightHelper( sunLight3 );
lightHelper4 = new THREE.SpotLightHelper( sunLight4 );
lightHelper5 = new THREE.SpotLightHelper( sunLight5 );
lightHelper9 = new THREE.SpotLightHelper( sunLight9 );
lightHelper6 = new THREE.SpotLightHelper( sunLight6 );
lightHelper7 = new THREE.SpotLightHelper( sunLight7 );
lightHelper8 = new THREE.SpotLightHelper (sunLight8); 
lightHelper10 = new THREE.SpotLightHelper (sunLight10); 
lightHelper11 = new THREE.SpotLightHelper (sunLight11); 
lightHelper12 = new THREE.SpotLightHelper (sunLight12); 
   
     