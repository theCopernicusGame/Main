/*
Copyright (c) 2012 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var HT = HT || {};
var counter = true, startTime, endTime, that;
HT.Tracker = function(params){
  this.params = params || {};

  this.mask = new CV.Image();
  this.eroded = new CV.Image();
  this.contours = [];

  this.skinner = new HT.Skinner();
};

HT.Tracker.prototype.detect = function(image){
  this.skinner.mask(image, this.mask);
  if (this.params.fast){
    this.blackBorder(this.mask);
  } else {
    CV.erode(this.mask, this.eroded);
    CV.dilate(this.eroded, this.mask);
  }
  this.contours = CV.findContours(this.mask);
  return this.findCandidate(this.contours, image.width * image.height * 0.05, 0.005);
};

HT.Tracker.prototype.returnTimeObj = function(){ //PULLING THE OBJECT CONTAINING PLAYER HAND VELOCITY FROM SKINNER.MASK
  //console.log('timeObJ', this.skinner.finalTimeObj)
  return this.skinner.finalTimeObj;
};
HT.Tracker.prototype.clear = function(){
   this.skinner.finalTimeObj.counter = 0;
   //console.log('inside HT.clear', this.skinner.finalTimeObj);
};



HT.Tracker.prototype.findCandidate = function(contours, minSize, epsilon){
  var contour, candidate;

  contour = this.findMaxArea(contours, minSize);
  if (contour){
    contour = CV.approxPolyDP(contour, contour.length * epsilon);

    candidate = new HT.Candidate(contour);
  }

  return candidate;
};

HT.Tracker.prototype.findMaxArea = function(contours, minSize){
  var len = contours.length, i = 0,
      maxArea = -Infinity, area, contour;

  for (; i < len; ++ i){
    area = CV.area(contours[i]);
    if (area >= minSize){

      if (area > maxArea) {
        maxArea = area;

        contour = contours[i];
      }
    }
  }

  return contour;
};

HT.Tracker.prototype.blackBorder = function(image){
  var img = image.data, width = image.width, height = image.height,
      pos = 0, i;

  for (i = 0; i < width; ++ i){
    img[pos ++] = 0;
  }

  for (i = 2; i < height; ++ i){
    img[pos] = img[pos + width - 1] = 0;

    pos += width;
  }

  for (i = 0; i < width; ++ i){
    img[pos ++] = 0;
  }

  return image;
};

HT.Candidate = function(contour){
  this.contour = contour;
  this.hull = CV.convexHull(contour);
  this.defects = CV.convexityDefects(contour, this.hull);
};

HT.Skinner = function(){
  that = this;
  this.finalTimeObj = {
    trackFlag: 0, 
    flag: 0, 
    counter: 0, 
    coordinate: {}
   };
   this.usePicture = {
    averageR: 0, 
    averageG: 0, 
    averageB: 0, 
  };  
  this.middle = {
    r: 0, 
    g: 0, 
    b: 0
  }; 
};

HT.Skinner.prototype.mask = function(imageSrc, imageDst){
  var test = that.finalTimeObj;
  var src = imageSrc.data, dst = imageDst.data, len = src.length,
      i = 0, j = 0,
      r, g, b, h, s, v, value;
     
  for(; i < len; i += 4){
    if (i === len - 1 && counter === true) {
      console.log('IIII', i); 
      counter = false; 
    }
    r = src[i];
    g = src[i + 1];
    b = src[i + 2];
    // if (counter % 1000 === 0) console.log('r',r, 'g',g, 'b',b, that.usePicture);
    v = Math.max(r, g, b);
    s = v === 0? 0: 255 * ( v - Math.min(r, g, b) ) / v;
    h = 0;

    if (0 !== s){
      if (v === r){
        h = 30 * (g - b) / s;
      }else if (v === g){
        h = 60 + ( (b - r) / s);
      }else{
        h = 120 + ( (r - g) / s);
      }
      if (h < 0){
        h += 360;
      }
    }

    value = 0;

    if (v >= 15 && v <= 250){
      if (h >= 3 && h <= 33){
        value = 255;
      }
    }
    //THE BELOW IS MY PATCH USING RGB FROM THE V.LARGE OBJECT CONTAINING ALL PIXEL RGB/BRIGHTNESS INFO
    //CAPTURED 6x/SECOND TO SCAN FOR PLAYER HAND, TRACK HAND SPEED
    // if (r > 145 && r < 149 && g > 98 && g < 102 && b > 86 && b < 90){
    //   console.log('MATCH!', i);
    //   that.finalTimeObj.counter++; 
    // }
    // else if (r > 227 && r < 255 && b > 196 && b < 231 && g > 184 && g < 226){
    //    console.log('MATCH!', i);
    //   that.finalTimeObj.counter++; 
    // }
    // else if (r > 204 && r < 252 && b > 149 && b < 205 && g > 205 && g < 238){
    //    console.log('MATCH!', i);
    //   that.finalTimeObj.counter++; 
    // }
     if (r > that.middle.r - 3 && r < that.middle.r + 3 && g > that.middle.g - 3 && g < that.middle.g + 3 && b > that.middle.b - 3 && b < that.middle.b + 3 && that.finalTimeObj.coordinate[i] === undefined){
       that.finalTimeObj.counter++;
      console.log('MATCH', 'r', r, 'g', g, 'b', b, 'i', i, 'counter', that.finalTimeObj.counter);
      that.finalTimeObj.coordinate[i] = true;  
    }
    // else if (r > 135 && r < 170 && b > 73 && b < 104 && g > 60 && g < 88 && that.finalTimeObj.coordinate[i] === undefined){
    //    that.finalTimeObj.counter++; 
    //    that.finalTimeObj.coordinate[i] = true;  
    //   //console.log('MATCH type 2, counter', that.finalTimeObj.counter);
    //   setTimeout(function(){ 
    //     if (that.finalTimeObj.counter > 200) console.log('you moved your hand slooooooow,', that.finalTimeObj.counter, ' matches'); 
    //     else if (that.finalTimeObj.counter >= 70 && that.finalTimeObj.counter < 200) console.log('you moved your hand medium-slow', that.finalTimeObj.counter, ' matches'); 
    //     else if (that.finalTimeObj.counter > 21 && that.finalTimeObj.counter < 70) console.log('you moved your hand at a medium pace', that.finalTimeObj.counter, ' matches'); 
    //     else if (that.finalTimeObj.counter > 12 && that.finalTimeObj.counter < 21) console.log('you moved your hand fast', that.finalTimeObj.counter, ' matches'); 
    //     else if (that.finalTimeObj.counter > 2 && that.finalTimeObj.counter < 12) console.log('you moved your hand very fast!', that.finalTimeObj.counter, ' matches'); 
    //     that.finalTimeObj.counter = 0; 
    //     that.finalTimeObj.coordinate = {}; 
        
    //   }, 2000); 
    // }
    
    dst[j ++] = value;
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

   // setTimeout(function(){ 
   //      if (that.finalTimeObj.counter > 200) console.log('you moved your hand slooooooow, ', that.finalTimeObj.counter, ' matches');
   //      else if (that.finalTimeObj.counter >= 70 && that.finalTimeObj.counter < 200) console.log('you moved your hand medium-slow', that.finalTimeObj.counter, ' matches'); 
   //      else if (that.finalTimeObj.counter > 21 && that.finalTimeObj.counter < 70) console.log('you moved your hand at a medium pace', that.finalTimeObj.counter, ' matches'); 
   //      else if (that.finalTimeObj.counter > 12 && that.finalTimeObj.counter < 21) console.log('you moved your hand fast', that.finalTimeObj.counter, ' matches'); 
   //      else if (that.finalTimeObj.counter > 2 && that.finalTimeObj.counter < 12) console.log('you moved your hand very fast!', that.finalTimeObj.counter, ' matches'); 
   //      that.finalTimeObj.counter = 0; 
   //      that.finalTimeObj.coordinate = {}; 
       
   //    }, 2000); 
   // console.log('counter', that.finalTimeObj.counter); 
  return imageDst;
};

HT.Skinner.prototype.checkPic = function(imageSrc){
  var pictureObj  = {}; 
    var len = imageSrc.data.length, src = imageSrc.data;  
    console.log('picture Length - data', len); 
     var i = 0, r, g, b, averageR = 0, averageB = 0, averageG = 0, picCounter = 0; 
      that.middle.r = src[90000], that.middle.g = src[90001], that.middle.b = src[90002]; 
     console.log('middle?', src[90000], src[90001], src[90002])
     //if (counter % 100 === 0) console.log(src);
  for(; i < len; i += 4){
    r = src[i];
    g = src[i + 1];
    b = src[i + 2];
    
    if (i > 90000 && i < 91000){
    averageR += r; 
     averageG += g; 
     averageB += b; 
  }
   
  
   
    
 
  picCounter++; 
   
     
  }
  that.usePicture.averageR = averageR / 250; 
  that.usePicture.averageG = averageG / 250; 
  that.usePicture.averageB = averageB / 250; 
  console.log('averageObj', that.usePicture); 
};



