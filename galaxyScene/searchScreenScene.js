var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
var renderer = new THREE.WebGLRenderer({ clearColor: 0x000000, alpha: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);
var geometry = new THREE.BoxGeometry(7, 7, 7, 10, 10, 10);
var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});
var cube = new THREE.Mesh(geometry, material);

Venus.position.x = 15; 
Venus.position.z = 10; 
Venus.position.y = -5; 

scene.add(Venus);



  scene.add(sunLight1);
  scene.add(sunLight2);
 scene.add(sunLight3);
  scene.add(sunLight5);
 

theSun.position.z = -110; 
theSun.position.y = 5; 
theSun.position.x = -45; 
scene.add(theSun);

camera.position.z = 50;        
 scene.add(searchLight);
  scene.add( aLight );
 scene.add(light); 

function render() {
requestAnimationFrame(render);
Venus.rotation.y += 0.006;
theSun.rotation.y -= 0.003; 
renderer.render(scene, camera);
};
render();