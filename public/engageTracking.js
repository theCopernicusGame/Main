'use strict';

var minMaxColors = {}, pixelsNeededIndex = [], handScanned = false;

$(function() {
  var swipeNum = $('#swipe-num');
  var allowWebcam = $('#allow-webcam');
  var transparentCircle = $('#transparent-circle');
  var snapContainer = $('#take-snapshot');
  var closeGif = $('<button class="newGame" id="closeGif">Got It!</button>');

   //scan hand and start scanning functionality
  $('#start-scan').click(function() {
    handScanned = true;
    $('#line-graph').animate({ opacity: 0 });
    $('#show-video').animate({ opacity: 1 });
    $('#take-snapshot').animate({ opacity: 1 });
    $('#line-graph').animate({ opacity: 0 });
    $('#bg').animate({ opacity: .3 });
    $('#how-to-play').animate({ opacity: 1 }); // figure out how to keep this opaque
    $('#start-tracking').attr("disabled", false);
    $('#start-scan').remove();

    //show frame over video
    snapContainer.css('display', 'block');


    //capture snapshot of hand && tell user
    setTimeout(function() {
      var canvas = document.getElementById('process-image');
      var canvas2 = document.getElementById('snapShot');

      var context1 = canvas.getContext('2d');
      var photo = document.getElementById('whiteCircle')

      var context2 = canvas2.getContext('2d');
      var video = document.getElementById('myVideo');

      var image = context1.drawImage(photo, 0, 0, 160, 120);
      var imageData = context1.getImageData(0, 0, canvas.width, canvas.height);

      var vid = context2.drawImage(video, 0, 0, 200, 200);
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

        maxLow.lowest = average - 4;
        maxLow.max = average + 4;
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

      transparentCircle.css('backgroundColor', 'green');
      $('#show-video p').text('GREAT!').css('text-align', 'center');
      setTimeout(function() {
        $('#show-video').animate({ opacity: 0 }, 250);
        $('#take-snapshot').animate({ opacity: 0 }, 500);
        showTracking();
      }, 1000);
    }, 6000);
  });

  function showTracking() {
    $('#tracking-container').delay(500).animate({ opacity: 1 }, 1000);
    $('#start-tracking').delay(500).animate({ opacity: 1 }, 1000);
  }

  $('#start-tracking').on('mousedown', function(event) {
    event.preventDefault(); // fixes spacebar event triggering by removing autofocus
    $('#line-graph').animate({ opacity: 0 });
    $('#tracking-container').animate({ opacity: 0 });
    $('#infoPanel').animate({ opacity: 1 });
    $('#how-to-play').animate({ opacity: 1 });
    $('#bg').animate({ opacity: 1 });
    if (singleplayer === false) $('#start-tracking').attr("disabled", true); // gotta put this somewhere else, because on multiplayer button disappears but is still clickable

    //start tracking software on countdown
    $('#swipe-countdown').animate({ opacity: 1 });
    var text = [3,2,1,"SWIPE!"];
    var wordCounter = 0;
    var countDown = setInterval(change, 1500);

    function change() {
      swipeNum.animate({ opacity: 1 });
      swipeNum.text(text[wordCounter]);
      swipeNum.animate({ opacity: 0 });

      wordCounter++;
      if(wordCounter > text.length) {
        startTracking();
        clearInterval(countDown);
        swipeNum.html("");
      }
    }

    //remove info box
    setTimeout(function() {
      $('#swipe-countdown').animate({ opacity: 0 })
      snapContainer.fadeOut();
    }, 6000);

    function startTracking() {
        user.trackFlag = true;
        demo.tick();
    }
    //end instructional gif code

  });

});

function transitionTracking() {
  if (handScanned === true) {
    $('#tracking-container iframe').remove();
    $('#tracking-container').animate({ opacity: 1 });
    $('#start-tracking').animate({opacity: 1}, 500).attr("disabled", false);
  }
}
