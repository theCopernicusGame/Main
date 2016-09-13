// selected elements from index.html that show information, allows for programmatic updating
var heightArea = document.querySelector("#heightArea");
var distArea = document.querySelector("#distArea");
var signalingArea = document.querySelector("#signalingArea");

function displaySignalMessage(message) {
  signalingArea.innerHTML = message;
}

function displayPosition(message1, message2) {
  heightArea.innerHTML = message1;
  distArea.innerHTML = message2;
}

function transitionGameMessages() {
  $('#signalingArea').animate({ marginTop: '80%' }, 1000);
  if (singleplayer === false) $('#pointsDiv').animate({ opacity: 1 });
  if (user.myTurn === false) $('#throwBall').text("Please wait for the other player to throw!").animate({ opacity: 1 });
}

function updateGravityDiv(newVal) {
  $('#gravity-num').text(newVal);
  displaySignalMessage("The gravity has changed to " + newVal + "!");
  $('#signalingArea').animate({ marginTop: '2.48%' }, 1000);
  $('#signalingArea').delay(3000).animate({ marginTop: '80%' }, 1000);
}

function transitionTracking() {
  if (handScanned === true) {
    $('#tracking-container iframe').remove();
    $('#tracking-container').animate({ opacity: 1 });
    $('#start-tracking').animate({opacity: 1}, 500).attr("disabled", false);
  }
}

$(function() {

  var showing = false;

  // chooses two player game
  $("#twoPlayer").click(function() {
    if (showing === false) {
      $("#joinGame").animate({ opacity: 1 }).attr("disabled", false);
      $("#startGame").animate({ opacity: 1 }).attr("disabled", false);
      showing = true;
    } else {
      $("#joinGame").animate({ opacity: 0 }).attr("disabled", true);
      $("#startGame").animate({ opacity: 0 }).attr("disabled", true);
      showing = false;
    }
  });

  // chooses one player game
  $("#onePlayer").click(function() {
    location.href = "game/" + "singleplayer";
  })

  // presses enter upon inputting a room
  $("#room").keyup(function(event){
    if(event.keyCode == 13){
      var room = $("#room").val();
      location.href = "./game/" + room;
    }
  });

  // Shimmer functionality for angle input
  var brightCounter = 0;
  var angleFader = $('.fadeBright');
  function pulse() {
    brightCounter++;
    if (brightCounter < 10) {
      angleFader.animate({opacity:'1'}, 1500);
      angleFader.animate({opacity:'0.2'}, 1500, pulse);
    } else angleFader.animate({opacity:'1'}, 1500);
  }

  pulse();

  $("#inputAngle").on("keydown",function search(e) {
    if (e.keyCode === 13) {
      userAngle = parseInt($(this).val());
    }
  });

  // modal functionality - fadeout for click to scan hand button, then fade back in when done reading how to play
  $('#gear-img').click(function(){
    $('#bg').animate({ opacity: .3 });
    $('#start-tracking').animate({ opacity: 0 });
  });
  $('.close, .btn-secondary').click(function(){
    $('#bg').animate({ opacity: 1 });
    $('#start-tracking').animate({ opacity: 1 });
  });

  //change up/down buttons of the angle..
  $( ".angle" ).on( "click", "img", function( event ) {
    var input = $('#inputAngle');
    var id = event.target.id
    var inputNum = Number(input.val());
    if (id === 'up-arrow' && inputNum < 90) {
      return input.val(inputNum + 1);
    } else if (id === 'down-arrow' && inputNum > 1) {
      return input.val(inputNum - 1);
    }
  });

});
