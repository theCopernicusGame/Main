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
});
