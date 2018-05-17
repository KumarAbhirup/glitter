console.log("The mass unfollowing bot is starting...");
console.log("This bot will unfollow the people who have followed you back.");

var Twit = require('twit');
var config = require('./config'); // Find config.js in same folder

// Connecting Firebase database
var firebase = require("firebase-admin");
var serviceAccount = require("./glitter.json");

  // Initialize connection
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://glitter-bot.firebaseio.com"
  });

var T = new Twit(config);

/*=============================================>>>>>
= Phase 4 (Unfollow the screen_names who have followed you back) =
===============================================>>>>>*/
  // Get the screen_names in `followbacks` table
  firebase.database().ref("followbacks/wesbos").on("value", function(snapshot) {

    // Functional Loop
    var i = 0;
    function timedLoop() { // unFollow Function

      setTimeout(function () { // unFollows the user after every `x` seconds

          /*=============================================>>>>>
          = Thing to be done =
          ===============================================>>>>>*/

            function snapshotToArray(snapshot) { // This function converts the Snapshot data into an array
                var returnArr = [];

                snapshot.forEach(function(childSnapshot) {
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;

                    returnArr.push(item);
                });

                return returnArr;
            };

            var screen_name_to_unfollow = snapshotToArray(snapshot)[i].key;

            // UnFollow
            T.post('friendships/destroy', { screen_name: screen_name_to_unfollow },  function (err, data, response) {
              if(!err){
                console.log("Wesbos follower "+screen_name_to_unfollow+" unfollowed.");

                // Create an `unfollowed` table and insert the screen_name there
                firebase.database().ref("unfollowed").child("wesbos").update({
                  [screen_name_to_unfollow]: {
                    connection: "unfollowed"
                  }
                });

                // Delete the screen_name from `to_unfollow` table
                firebase.database().ref("followbacks/wesbos").child(screen_name_to_unfollow).remove();

              } else{
                console.log(err);
              }
            });

          /*= End of Thing to be done =*/
          /*=============================================<<<<<*/

          // Increase value of variable `i` by 1. (Increment)
          i++;

          // How many times to loop
          if(i < 99999) {
              timedLoop();
          }

      }, 1000*3); // After how many seconds. `1000` means 1 second.

    }

    timedLoop(); // Run the loop

  });
/*= End of Phase 4 =*/
/*=============================================<<<<<*/


function timePass(lol){
  console.log("Just having fun with some code!! XD");
}
