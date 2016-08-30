'use strict';

// initialize the manage to handle all loaded events
var imgManager = new THREE.LoadingManager();
var objManager = new THREE.LoadingManager();
imgManager.onProgress = function ( item, loaded, total ) {
  console.log( 'Loaded: ', item, " - ", "item", loaded, "of", total );
}

imgManager.onLoad = function() {
  console.log('All images loaded!');
}

imgManager.onError = function() {
  console.log('LOADING ERROR.')
}

objManager.onProgress = function ( item, loaded, total ) {
  console.log( 'Loaded: ', item, " - ", "item", loaded, "of", total );
}

objManager.onLoad = function() {
  console.log('All objects loaded!');
  allItemsLoaded();
}

objManager.onError = function() {
  console.log('LOADING ERROR.')
}

var imgLoader = new THREE.ImageLoader(imgManager);
var objLoader = new THREE.OBJLoader(objManager);
var textureLoader = new THREE.TextureLoader();

$(document).ready(function () {
  if ($('.loading-container').length) {

    var $imgloader = $('.loading-container');
    var $loadingimg = $('<div id="canvasloader-container" class="onepix-imgloader"><p>Your galaxy is loading...</p></div>');

    $loadingimg.attr("src", "images/flexslider/loading.gif");
    $imgloader.prepend($loadingimg);

    var cl = new CanvasLoader('canvasloader-container');
    cl.setColor('#4f4f4f');
    cl.setDiameter(45);
    cl.setDensity(75);
    cl.setRange(0.7);
    cl.setSpeed(3);
    cl.setFPS(22);
    cl.show();
  }
})

function allItemsLoaded() {
  $('.onepix-imgloader').fadeOut();
  $('.loading-container > *:not(.onepix-imgloader)').fadeTo(35000, 100);
  $('#start-scan').css('visibility', 'visible');
}
