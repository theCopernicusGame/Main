
//THE FOLLOWING IS TRACKING COLORS IN TRACKING.JS

//   var colors = new tracking.ColorTracker(['magenta']);

//   var start, start2, end, end2, time, time2; 
//   console.log('NOW in tracking ish', colors); 

//   colors.on('track', function(event) {
    
//     if (event.data.length === 0) {
//     } else {
//       event.data.forEach(function(rect) {
//       //console.log(rect.y);
//       //console.log('time', Date.now());
//       if ( start === undefined && rect.y > 45) {
//         start = Date.now(); 
//         console.log('start', start);
//       }

//       if ( start !== undefined && end === undefined && rect.y < 20) {
//         end = Date.now();
//         console.log('start', start,'end', end);
//         time = end - start;
//         console.log("time " + (time / 1000) % 60);
//       }
//       if (time !== undefined && start2 === undefined && rect.y > 45){
//         start2 = Date.now(); 
//         console.log('start2', start2);
//       }
//       if ( time !== undefined && start2 !== undefined && end2 === undefined && rect.y < 20) {
//         end2 = Date.now();
//         console.log('start2', start2,'end2', end2);
//         time2 = end2 - start2;
//         console.log("time2 " + (time2 / 1000) % 60);
//       }

//      }); 
//    }
//   });


//   console.log('in doc ready'); 
//   tracking.track('#myVideo', colors, {camera: true});
//   $('#myVideo').css('visibility', 'hidden');
   
   //END OF TRACKING COLORS IN TRACKING.JS

  //END OF PLAYER MOVEMENT TRACKING CODE