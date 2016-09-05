'use strict';

var minMaxColors = {}, pixelsNeededIndex = [];

$(function() {
  var infoP = $('<p id="hand-info">Place hand over circle to correctly scan pixelation.</p>');
  var allowWebcam = $('#allow-webcam');
  var transparentCircle = $('#transparent-circle');
  var snapContainer = $('#take-snapshot');
  //modal functionality - fadeout for click to scan hand button, then fade back in when done reading how to play
  $('#gear').click(function(){
    $('#bg').animate({ opacity: .3 });
    $('#start-scan').animate({ opacity: 0 });
  }); 
  $('.btn-secondary').click(function(){
     $('#start-scan').animate({ opacity: 1 });
      $('#bg').animate({ opacity: 1 });
  }); 
   $('#myModal').click(function(){
     $('#start-scan').animate({ opacity: 1 });
      $('#bg').animate({ opacity: 1 });
  }); 



   //scan hand and start scanning functionality
  $('#start-scan').click(function() {
    $('#line-graph').animate({ opacity: 0 });
    $('#start-scan').remove();
    $('#start-tracking').css('visibility','visible').fadeOut(1).delay(4000).fadeIn(1500);
    //show frame over video
    snapContainer.css('display', 'block');

    //display info message
    allowWebcam.prepend(infoP);


    //capture snapshot of hand && tell user
    setTimeout(function() {
      var canvas = document.getElementById('process-image');
      var canvas2 = document.getElementById('snapShot');

      var context1 = canvas.getContext('2d');
      var photo = document.getElementById('whiteCircle')

      var context2 = canvas2.getContext('2d');
      var video = document.getElementById('myVideo');

        //REMOVE THROWBALL DIV
        //$('#throwBall').hide();

      var image = context1.drawImage(photo, 0, 0, 160, 120);
      var imageData = context1.getImageData(0, 0, canvas.width, canvas.height);

      var vid = context2.drawImage(video, 0, 0, 160, 120);
      var videoData = context2.getImageData(0, 0, canvas.width, canvas.height);

      var arrRed = [];
      var arrGreen = [];
      var arrBlue = [];

      for (var i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] > 235) {

           imageData.data[i] = videoData.data[i];
           if (imageData.data[i] > 25) {
             arrRed.push(imageData.data[i]);
             pixelsNeededIndex.push(i);
           }

           imageData.data[i + 1] = videoData.data[i + 1];
           if (imageData.data[i + 1] > 25) arrGreen.push(imageData.data[i + 1]);

           imageData.data[i + 2] = videoData.data[i + 2];
           if (imageData.data[i + 2] > 25) arrBlue.push(imageData.data[i + 2]);
        }

      }

      function average(arr) {
        let maxLow = {};

        let average = Math.floor(arr.reduce(function(acc, i) {
          return acc + i;
        }, 0) / arr.length);

        maxLow.lowest = average - 2;
        maxLow.max = average + 2;
        return maxLow;
      }

      let reds = average(arrRed);
      let greens = average(arrGreen);
      let blues = average(arrBlue);

      minMaxColors.lowRed = reds.lowest;
      minMaxColors.maxRed = reds.max;
      minMaxColors.lowGreen = greens.lowest;
      minMaxColors.maxGreen = greens.max;
      minMaxColors.lowBlue = blues.lowest;
      minMaxColors.maxBlue = blues.max;

      context1.putImageData(imageData, 0, 0);
      // demo.checkPicture(imageData)

      transparentCircle.css('backgroundColor', 'green');
    }, 4000);
  });

  $('#start-tracking').click(function() {
    if (singleplayer === false) $('#start-tracking').attr("disabled", true);
    var text = ["Tracking starts in 3 seconds!", "Tracking starts in 2 seconds!", "Tracking starts in 1 second!"];
    var wordCounter = 0;
    var countDown = setInterval(change, 1200);
    function change() {
      infoP.css('backgroundColor', 'rgba(40,40,40,0.9)');
      infoP.fadeOut(0).fadeIn(1000);
      infoP.text(text[wordCounter]);
      wordCounter++;
      if(wordCounter > text.length) {
        startTracking();
        clearInterval(countDown);
        infoP.css('backgroundColor', 'rgba(0,0,0,0)');
      }
    }

    //remove info box
    setTimeout(function() {
      infoP.text('');
      snapContainer.fadeOut();
    }, 5000);

    function startTracking() {
      setTimeout(function() {
        user.trackFlag = true;
        demo.tick();
      }, 1500);
    }
  });

});
