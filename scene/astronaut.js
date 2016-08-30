'use strict';

var imageMap = new THREE.Texture();
var normalMap = new THREE.Texture();
var specMap = new THREE.Texture();

imgLoader.load('/assets/astronaut/Astronaut_DI.jpg', function(img) {
  imageMap.image = img;
  imageMap.needsUpdate = true;
});

imgLoader.load('/assets/astronaut/Astronaut_NI.jpg', function(img) {
  normalMap.image = img;
  normalMap.needsUpdate = true;
});

imgLoader.load('/assets/astronaut/Astronaut_SI.jpg', function(img) {
  specMap.image = img;
  specMap.needsUpdate = true;
});
