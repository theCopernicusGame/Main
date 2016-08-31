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

});
