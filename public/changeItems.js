$(function() {

  $("#inputMass").on("keydown",function search(e) {
    if(e.keyCode === 13){
      var val = $(this).val();
      user.setMass = val;
    }
  });

  $("#inputAngle").on("keydown",function search(e) {
    if (e.keyCode === 13) {
      userAngle = parseInt($(this).val());
    }
  });

  $("#inputGravity").on("keydown",function search(e) {
    if (e.keyCode === 13) {
      if ($(this).val() < 0) $(this).val() = 0;
      user.changeGravityValue = $(this).val() * -12.5;
      user.changeGravityFlag = true;
    }
  });

});
