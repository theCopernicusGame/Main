$(function() {
    $("#inputAngle").on("keydown",function search(e) {
      if(e.keyCode === 13) {
        userAngle = $(this).val(); 
        console.log('userAngle is now', userAngle); 
      }
    });

    $("#inputMass").on("keydown",function search(e) {
      if(e.keyCode === 13){
        var val = $(this).val();  
        ball._physijs.mass = val; 
        scene.execute( 'updateMass', { id: ball._physijs.id, mass: val  } ); 
        console.log('ballMass', ball._physijs.mass);  
      }
    });

  $("#inputGravity").on("keydown",function search(e) {
    if(e.keyCode === 13) {
        //console.log('scene gravity is now', $(this).val()); 
        user.changeGravityValue = $(this).val() * -12.5; 
        user.changeGravityFlag = true; 
    }
  });

}); 