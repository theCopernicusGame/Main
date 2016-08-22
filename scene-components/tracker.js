'use strict';
//THE FOLLOWING IS TRACKING HANDS USING JS-HANDTRACKING

var finalTime = {}, demo, newFinalTime = {flag: true}, imageCounter = 0;
var DEMO = function(){
  startTime = undefined, endTime = undefined;
  this.startTime = startTime; this.endTime = endTime, this.finalTime = undefined, this.skinner = undefined;
};

DEMO.prototype.clear = function(){
  this.tracker.clear();
};

DEMO.prototype.start = function() {
  var that = this;
  this.tracker = new HT.Tracker();
  this.video = document.getElementById("myVideo");
  this.canvas = document.getElementById("canvas");
  this.context = this.canvas.getContext("2d");
  this.canvas.width = parseInt(this.canvas.style.width);
  this.canvas.height = parseInt(this.canvas.style.height);
  this.image = this.context.createImageData(
  this.canvas.width * 0.2, this.canvas.height * 0.2);
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (navigator.getUserMedia){
    navigator.getUserMedia({video: true},
    function(stream){ return that.videoReady(stream); },
    function(error){ return that.videoError(error); } );
  }
};

DEMO.prototype.videoReady = function(stream){
  if (window.webkitURL) {
    this.video.src = window.webkitURL.createObjectURL(stream);
  } else if (video.mozSrcObject !== undefined) {
    this.video.mozSrcObject = stream;
  } else {
    this.video.src = stream;
  }
  //this.tick();
};

DEMO.prototype.videoError = function(error){
};

DEMO.prototype.tick = function(){
  if (user.trackFlag === true){
    console.log('*************IN TICK'); 
    var that = this, image, candidate;
    requestAnimationFrame( function() { return that.tick(); } );
    if (this.video) {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA){
        image = this.snapshot();
        candidate = this.tracker.detect(image);
        this.draw(candidate);
      }
    }
  }
};

DEMO.prototype.snapshot = function(){
  this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  imageCounter++;

  return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
};

DEMO.prototype.draw = function(candidate){
  if (candidate){
    this.drawHull(candidate.hull, "red");
    this.drawDefects(candidate.defects, "blue");
    this.context.putImageData(
    this.createImage(this.tracker.mask, this.image),
    this.canvas.width - this.image.width,
    this.canvas.height - this.image.height);
  }
};

DEMO.prototype.drawHull = function(hull, color){
  finalTime = this.tracker.returnTimeObj(); //THIS IS THE ADDED METHOD THAT RETURNS THE OBJECT CAPTURING THE SPEED OF THE PLAYERS HAND
  if (finalTime.counter > 0) waitABit();
  var len = hull.length, i = 1;
  if (len > 0){
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = color;
    this.context.moveTo(hull[0].x, hull[0].y);
    if (hull[0].y > 0  && hull[0].x > 60 && hull[0].x < 90 & this.startTime === undefined){
      //console.log('yStart', hull[0].y);
      this.startTime = Date.now();
      //console.log('start', (this.startTime / 1000) % 60); //KEPT IN TO TEST TRACKING
    }
    if (hull[0].y > 110 && this.startTime !== undefined && this.endTime === undefined){
     // console.log('yEnd', hull[0].y);
      this.endTime = Date.now();
      this.finalTime = this.endTime - this.startTime;
     // console.log('endTime', this.endTime);
     // console.log('howMuch', (this.finalTime / 1000) % 60);
      finalTime = (this.finalTime / 1000) % 60;
      //this.startTime = undefined, this.endTime = undefined;  //MULTIPLE THROWS POSSIBLE WITH THIS
    }
    for (; i < len; ++ i){
      this.context.lineTo(hull[i].x, hull[i].y);
    }
    this.context.stroke();
    this.context.closePath();
  }
};

DEMO.prototype.drawDefects = function(defects, color){
  var len = defects.length, i = 0, point;
  if (len > 0){
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = color;
  for (; i < len; ++ i){
    point = defects[i].depthPoint;
    this.context.strokeRect(point.x - 4, point.y - 4, 8, 8);
  }
  this.context.stroke();
  this.context.closePath();
  }
};

DEMO.prototype.createImage = function(imageSrc, imageDst){
  var src = imageSrc.data, dst = imageDst.data,
    width = imageSrc.width, span = 4 * width,
    len = src.length, i = 0, j = 0, k = 0, fun = dst;
  for(i = 0; i < len; i += span){
    for(j = 0; j < width; j += 5){
      dst[k] = dst[k + 1] = dst[k + 2] = src[i];
      dst[k + 3] = 255;
      k += 4;
      i += 5;
    }
  }
  return imageDst;
};

$('#canvas').css('visibility', 'hidden');
demo = new DEMO();

demo.start();


function waitABit(){
  setTimeout(function(){
    newFinalTime.counter = finalTime.counter;
  }, 700);
}
