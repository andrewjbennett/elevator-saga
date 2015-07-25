
{
    
    init: function(elevators, floors) {
        var uppressed = [];
        var downpressed = [];
        var not_used = [];
        var going_to = [0,0,0,0,0,0,0,0,0,0];
        
        _.each(floors, function(floor) {

           floor.on("up_button_pressed", function() {
               console.log("someone pressed" + floor.level);
               if (not_used.length > 0 && going_to[floor.level] == 0) {
                   going_to[floor.level] = 1;
                   not_used.pop().goToFloor(floor.level);
               } else if (uppressed.indexOf(floor.level) == -1 && going_to[floor.level] == 0) {
                   console.log("really going there");
                   going_to[floor.level] = 1;
                   uppressed.push(floor.level);
               }
           });
           floor.on("down_button_pressed", function() {
               console.log("someone pressed" + floor.level);
               if (not_used.length > 0 && going_to[floor.level] == 0) {
                   going_to[floor.level] = 1;
                   not_used.pop().goToFloor(floor.level);
                   
               } else if (downpressed.indexOf(floor.level) == -1 && going_to[floor.level] == 0) {
                   console.log("really going there");
                   going_to[floor.level] = 1;
                   downpressed.push(floor.level);
               }
           });
        });
        
        _.each(elevators, function(elevator) {
            // initially say we're not used, since otherwise we're not even idle?
            not_used.push(elevator);
            
            // when someone pushes a button in the elevator
            elevator.on("floor_button_pressed", function(floorNum) {
                    going_to[floorNum] = 1;
                    elevator.goToFloor(floorNum);
            });
            
            // if we're passing a floor, maybe take some people in
            elevator.on("passing_floor", function(floorNum, direction) {
                // if someone else isn't going to that floor
                if (going_to[floorNum] == 0) {
                    // if we're sort of full
		            if (elevator.loadFactor() < 0.8) {
		            	if (direction == "up" && uppressed.indexOf(floorNum) != -1) {
		                    index = uppressed.indexOf(floorNum);
		                    going_to[floorNum] = 1;
		               		elevator.goToFloor(floorNum, true);
		               		uppressed.splice(index, 1);
		            	} else if (direction == "down" && downpressed.indexOf(floorNum) != -1) {
		                    index = downpressed.indexOf(floorNum);
		                    going_to[floorNum] = 1;
		                    elevator.goToFloor(floorNum, true);
		                    downpressed.splice(index, 1);
		                }
                    }
                }
            });
            
            // if we're at a floor and we have nothing to do, pick the longest queue and do that
            // also, we're at a floor, so add that to the thing we can go to again
            elevator.on("stopped_at_floor", function(floorNum) {
                going_to[floorNum] = 0;
                if (elevator.destinationQueue.length == 0) {
                    // only do stuff if nobody is going to that floor yet
                    if (going_to[floorNum] == 0) {
                        if (downpressed.length > uppressed.length && downpressed.length > 0) {
                           floor = downpressed.shift();
                           console.log("elevator e going to a pressed floor f" + elevator + floor);
                           elevator.goToFloor(floor);
                        }
                        else if (uppressed.length > 0) {
                            elevator.goToFloor(uppressed.shift());
                        }
                     }
                }
            });
            
            // if we're "idle"
            
            elevator.on("idle", function(){
                var floor = -1;
               // if (elevator.loadFactor() > 0.9) {
               
                // optimise something here wrt floors we're going to
                if (downpressed.length > uppressed.length && downpressed.length > 0) {
                    floor = downpressed.shift();
                    console.log("elevator e going to a pressed floor f" + elevator + floor);
                    elevator.goToFloor(floor);
                }
                else if (uppressed.length > 0) {
                    elevator.goToFloor(uppressed.shift());
                }
                /*
                var direct = Math.floor(Math.random() * 2);
                var done = 0;
                if (direct == 0) {
                    if (uppressed.length > 0) {
                        floor = uppressed.shift(); // shift
                        done = 1;
                    } 
                }
                if (done == 0 && downpressed.length > 0) {
                    floor = downpressed.shift();
                }*/
                //if (floor != -1) {
                 //   elevator.goToFloor(floor);
               // }
                //}
            });
        });
      
        
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}


