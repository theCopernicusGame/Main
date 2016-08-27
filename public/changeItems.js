$(function() {
    $("#inputAngle").on("keydown",function search(e) {
      if(e.keyCode === 13) {
        userAngle = $(this).val(); 
        console.log('userAngle is now', userAngle); 
      }
    });

    $("#inputMass").on("keydown",function search(e) {
      if(e.keyCode === 13){
        ball.mass = $(this).val(); 
        console.log('ball mass', ball.mass);
      }
    });

  $("#inputGravity").on("keydown",function search(e) {
    if(e.keyCode === 13) {
        console.log('scene gravity is now', $(this).val()); 
       scene.setGravity(new THREE.Vector3( 0, $(this).val() * -12.5, 0 )); 
    }
  });

}); 