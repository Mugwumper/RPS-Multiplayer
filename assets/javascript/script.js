var ourChoice = "";
var gTimeoutVar;
var WINS = 0;
var LOSSES = 0;
var TIES = 0;
var gID = '';
var gWeaponUs = '';
var gWeaponThem = '';
var nameUs = '';
var nameThem = '';
var intervalId;

$("#settings").hide();

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
var dbpRPS = database.ref("/rps/game");
var dbpRPS1 = database.ref("/rps/game/player1");
var dbpRPS2 = database.ref("/rps/game/player2");
var dbpConnections = database.ref("/rps/connections");
var dbpConnected = database.ref(".info/connected");

database.ref("rps").on("value", function (snapshot) {
  console.log("database.ref(\"rps\").on(\"value\"...snapshot: " + JSON.stringify(snapshot));
  if (snapshot.child("game").exists()) {
    var game = snapshot.val().game;
    if (isGameUsable(game)) {
      if (haveBothChoosen(game)) {
        if (arewe2()) {
          var us = game.player2.weapon;
          var them = game.player1.weapon;
        } else {
          var us = game.player1.weapon;
          var them = game.player2.weapon;
        }
        PickAWinner(us, them);
      }
    }
  }
});

function PickAWinner(us, them) {
  if ((us === "Rock" && them === "Scissors") ||
    (us === "Scissors" && them === "Paper") ||
    (us === "Paper" && them === "Rock")) {
    WINS++;
  } else if (us === them) {
    TIES++;
  } else {
    LOSSES++;
  }
  updateScoreBoard();
  clearInterval(intervalId);
  intervalId = setTimeout(reset, 3000);
}


function isGamePlayedByThem(game) {
  var p = getPlayerFromGameObj_Them(game);
  if (p.hasOwnProperty('weapon')) {
    gWeaponThem = p.weapon;
    if (gWeaponThem !== '') {
      $("#psThem").text('other player has made a choice...');
      return true;
    }
  }
  if (p.hasOwnProperty('name')) {
    $("#nameThem").text(p.name);
  }
  return false;
}

function getPlayerFromGameObj_Them(game) {
    if (arewe2()) {
      if (game.hasOwnProperty('player1')) {
        return game.player1;
      }
    } else {
      if (game.hasOwnProperty('player2')) {
        return game.player2;
      }
    }
    return {};
  }

  function getPlayerFromGameObj_Us(game) {
    if (arewe2()) {
      if (game.hasOwnProperty('player2')) {
        return game.player2;
      }
    } else {
      if (game.hasOwnProperty('player1')) {
        return game.player1;
      }
    }
    return {};
  }

function isGamePlayedByUs(game) {
  var p = getPlayerFromGameObj_Us(game);
  if (p.hasOwnProperty('weapon')) {
    gWeaponUs = p.weapon;
    if (gWeaponUs !== '') {
      $("#psUs").text(gWeaponUs);
      return true;
    }
  }
  if (p.hasOwnProperty('name')) {
    nameUs = p.name;
    $("#nameUs").text(p.name);
    $("#playerName").val(p.name);    
  }
  $("#psUs").text('select your weapon');
  return false;
}

function isGameUsable(game) {
  console.log("game:" + JSON.stringify(game));
  var playedByUs = isGamePlayedByUs(game); 
  var playedByThem = isGamePlayedByThem(game); 
  if (playedByThem) {
    if (playedByUs) {
      showRoundResults();
    } else {
      $("#psThem").text('other player has made a choice...');
    }
  } else {
    $("#psThem").text('waiting on other player...');
  }

  if ((game.hasOwnProperty('player1')) &&
    (game.hasOwnProperty('player2'))) {
    var p1 = game.player1;
    if (p1.hasOwnProperty('weapon')) {
      $("#player1weapon").text(game.player1.weapon);
    }
    if (p1.hasOwnProperty('name')) {
      $("#player1name").text("Player 1 name: "+game.player1.name);
    }
    
    var p2 = game.player2;
    if (p2.hasOwnProperty('weapon')) {
      $("#player2weapon").text(game.player2.weapon);
    }
    if (p2.hasOwnProperty('name')) {
      $("#player2name").text("Player 2 name: "+game.player2.name);
    }
    if ((p1.hasOwnProperty('weapon')) &&
      (p2.hasOwnProperty('weapon'))) {
      return true;
    }
  }
  return false;
}

function showRoundResults() {
  $("#psThem").hide();
  $("#psThem").text(gWeaponThem);
  $("#psThem").fadeIn(800);
  $("#psThemImage").hide();
  $("#psThemImage").text(getImageForWeapon(gWeaponThem));
  $("#psThemImage").fadeIn(800);
}

function getImageForWeapon(gWeaponThem) {
  switch (gWeaponThem) {
    case "Rock":
      return "🥔";
    case "Paper":
      return "📰";
    case "Scissors":
      return "✂";
    default:
      return "";

  }

}

function updateScoreBoard() {
  $("#wins").text("wins: " + WINS);
  $("#losses").text("losses: " + LOSSES);
  $("#ties").text("ties: " + TIES);
}

function haveBothChoosen(game) {
  if ((game.player1.weapon == undefined) || (game.player2.weapon == undefined)) {
    return false;
  }
  return ((game.player1.weapon !== "") && (game.player2.weapon !== ""));
}


// When the client's connection state changes...
dbpConnected.on("value", function (snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = dbpConnections.push(true);
    console.log(con);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
dbpConnections.on("value", function (snap) {
  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  var playercount = snap.numChildren();
  if (gID === '') {
    if (playercount > 1) {
      gID = "player2";
      sbm("we are player 2");
    } else {
      gID = "player1";
      sbm("we are player 1");
    }
    updateForPlayerX();
  }
  $("#connected-viewers").text(playercount);
});

function updateForPlayerX() {
  $("#weare").text("we are: " + gID);
  var guiUS = $(document.createElement('div'));
  $(guiUS).append(
    '<div id=nameUs>nameUs</div>' +
    '<div class="btn-group btn-group-toggle" data-toggle="buttons">' +
    '<button class="btn btn-primary btnSelectWeapon" onclick="selectedWeapon(\'Rock\')">🥔 Rock</button>' +
    '<button class="btn btn-primary btnSelectWeapon" onclick="selectedWeapon(\'Paper\')">📰 Paper</button>' +
    '<button class="btn btn-primary btnSelectWeapon" onclick="selectedWeapon(\'Scissors\')">✂ Scissors</button>' +
    '<div id=psUs>--status--</div>' +
    '</div>');

  var guiThem = $(document.createElement('div'));
  $(guiThem).append(
    '<div id=nameThem>nameThem</div>' +
    '<div id=psThemImage></div>',
    '<div id=psThem>--status--</div>');
  if (arewe2()) {
    $(".aside-1").append($(guiThem));
    $(".aside-2").append($(guiUS));
  } else {
    $(".aside-1").append($(guiUS));
    $(".aside-2").append($(guiThem));
  }
}

function postName() {
  var name = $("#playerName").val().trim();
  sbm("new name '"+name+"'");
  nameUs = name;
  $("#nameUs").text(name);
  $("#playerName").val(name);    
  if (arewe2()) {
    dbpRPS2.set({
      weapon: gWeaponUs,
      name: nameUs
    });
  } else {
    dbpRPS1.set({
      weapon: gWeaponUs,
      name: nameUs
    });
  }
}

function weare1() {
  // first clear the GUIs for each player
  $(".aside-1").empty();
  $(".aside-2").empty();
  gID = "player1";
  sbm("we are now player 1!");
  updateForPlayerX();
}

function arewe2() {
  return (gID === "player2");
}

function selectedWeapon(wType) {
  gWeaponUs = wType;
  console.log(wType);
  if (nameUs === '') {
    nameUs = gID;
  }
  if (arewe2()) {
    dbpRPS2.set({
      weapon: wType,
      name: nameUs
    });
  } else {
    dbpRPS1.set({
      weapon: wType,
      name: nameUs
    });
  }
  $(".btnSelectWeapon").attr("disabled", true);
  console.log("disabled buttons");
}

function reset() { // makes ready for the next round
  console.log("reset");
    if (nameUs === '') {
    nameUs = gID;
  }
  gWeaponUs = '';
  gWeaponThem = '';
  if (arewe2()) {
    dbpRPS2.set({
      weapon: "",
      name: nameUs
    });
  } else {
    dbpRPS1.set({
      weapon: "",
      name: nameUs
    });
  }
  $(".btnSelectWeapon").attr("disabled", false);
  $(".btnSelectWeapon").removeClass('focus');
  console.log("enabled buttons");
  $("#psThemImage").text("");
  sbm("Game Reset");
}


function sbm(msg) {
  clearTimeout(gTimeoutVar);
  gTimeoutVar = $("#sbm").text(msg);
  setTimeout(clearSBM, 1000);
}

function clearSBM() {
  $("#sbm").text('');
}

function showSettings() {
  sbm("Showing Settings");
  $("#settings").show();
}

function closeSettings() {
  $("#settings").hide();
  postName();
}
