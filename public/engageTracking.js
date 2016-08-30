'use strict'; 
var minMaxColors = {}, pixelsNeededIndex = [];
$(function() {
    $('#start-scan').click(function() {
            console.log('clicked to take pic of hand');



        var infoP = $('<p id="hand-info">Place hand over circle to correctly scan pixelation.</p>');
        var allowWebcam = $('#allow-webcam');
        var transparentCircle = $('#transparent-circle');
        var snapContainer = $('#take-snapshot');

        //show frame over video
        snapContainer.css('display', 'block');

        //display info message
        allowWebcam.prepend(infoP);
        $('#start-scan').remove();

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

                maxLow.lowest = average - 5;
                maxLow.max = average + 5;
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
            // infoP.text("Tracking starts in 3 seconds!").delay(1000); 
            // infoP.html("Tracking starts in 2 seconds!").fadeIn(1000); 
              
              var text = ["Tracking starts in 3 seconds!", "Tracking starts in 2 seconds!", "Tracking starts in 1 second!"];
              var wordCounter = 0;
              var countDown = setInterval(change, 1200);
              function change() {
                infoP.fadeOut(1).delay(10).fadeIn(800);
               infoP.text(text[wordCounter]); 
               // fadeTo(500, 0.4);
                  wordCounter++;
                  if(wordCounter >= text.length) { 
                    startTracking(); 
                    clearInterval(countDown);
                  }
                }
        }, 4000);

          //remove info box
          setTimeout(function() {
            infoP.remove();
            snapContainer.remove();
          }, 14000);

          function startTracking(){
            setTimeout(function(){
              console.log('starting tracking from collected image!');
              user.trackFlag = true;
              demo.tick();
            }, 1500);
          }

      });

    });
