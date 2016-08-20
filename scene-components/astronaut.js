'use strict';

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
  console.log( item, loaded, total );
};
var onError = function(xhr) {
};

var imageMap = new THREE.Texture();
var normalMap = new THREE.Texture();
var specMap = new THREE.Texture();
var floorImage = new THREE.Texture();
var loader = new THREE.OBJLoader( manager );

var loader = new THREE.ImageLoader(manager);
loader.load('assets/astronaut/Astronaut_DI.jpg', function(img) {
  imageMap.image = img;
  imageMap.needsUpdate = true;
});

loader.load('assets/astronaut/Astronaut_NI.jpg', function(img) {
  normalMap.image = img;
  normalMap.needsUpdate = true;
});

loader.load('assets/astronaut/Astronaut_SI.jpg', function(img) {
  specMap.image = img;
  specMap.needsUpdate = true;
});


loader.load('assets/finalMoonPics/Larissa-Texture.png', function(img) {
  floorImage.image = img;
  floorImage.needsUpdate = true;
});
