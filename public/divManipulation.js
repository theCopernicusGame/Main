$(function() {

  var showing = false;

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

  $("#onePlayer").click(function() {
    location.href = "game/" + "singleplayer";
  })

  $("#room").keyup(function(event){
    if(event.keyCode == 13){
      var room = $("#room").val();
      location.href = "./game/" + room;
    }
  });

  var brightCounter = 0;
  //Shimmer functionality for angle input
  var angleFader = $('.fadeBright');
  function pulse() {
    brightCounter++;
    if (brightCounter < 10) {
      angleFader.animate({opacity:'1'}, 1500);
      angleFader.animate({opacity:'0.2'}, 1500, pulse);
    } else angleFader.animate({opacity:'1'}, 1500);
  }

  pulse();

});
