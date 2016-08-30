$(function() {

    $("#inputMass").on("keydown",function search(e) {
      if(e.keyCode === 13){

        var val = $(this).val();
        user.setMass = val;
        // ball._physijs.mass = val;
        // scene.execute( 'updateMass', { id: ball._physijs.id, mass: val  } );
        // console.log('ballMass', ball._physijs.mass);
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
      console.log('scene gravity is now', $(this).val());
      user.changeGravityValue = $(this).val() * -12.5;
      user.changeGravityFlag = true;
    }
  });
});
