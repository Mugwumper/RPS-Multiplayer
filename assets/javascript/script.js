var ourChoice = "";

console.log("our choice: " + ourChoice);

function applyPaper() {
    ourChoice = "Paper";
    console.log("our choice: " + ourChoice);
}


// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyABVthmV5HJ_ZKI_5RTw9H4hcfQp1AzXCY",
    authDomain: "rpsdatabase-85b5a.firebaseapp.com",
    databaseURL: "https://rpsdatabase-85b5a.firebaseio.com",
    projectId: "rpsdatabase-85b5a",
    storageBucket: "rpsdatabase-85b5a.appspot.com",
    messagingSenderId: "486797395310",
    appId: "1:486797395310:web:b981078317f81f04"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

    
database.ref("rps").on("value", function(snapshot) {

});



var connectionsRef = database.ref("/connections");

// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});


$(document).ready(function () {
    $('.radio').click(function () {
        document.getElementById('price').innerHTML = $(this).val();
    });

});


function selectedWeapon(wType) {
    console.log(wType);
      database.ref("/rps").set({
          player1: wType       
      });
}
  