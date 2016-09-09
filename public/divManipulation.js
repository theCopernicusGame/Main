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

  //Shimmer functionality for angle input
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

  // modal functionality - fadeout for click to scan hand button, then fade back in when done reading how to play
  $('#gear-img').click(function(){
    $('#bg').animate({ opacity: .3 });
    $('#start-tracking').animate({ opacity: 0 });
  });
  $('.close, .btn-secondary').click(function(){
    $('#bg').animate({ opacity: 1 });
    $('#start-tracking').animate({ opacity: 1 });
  });

});
