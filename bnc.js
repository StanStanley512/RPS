  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCB36Xky5giHzGBOX42TGY1T2y-zGPGuZs",
    authDomain: "shane-rps.firebaseapp.com",
    databaseURL: "https://shane-rps.firebaseio.com",
    projectId: "shane-rps",
    storageBucket: "shane-rps.appspot.com",
    messagingSenderId: "390214713858",
    appId: "1:390214713858:web:2407193fe603ee579edd1b",
    measurementId: "G-CX31QY1WRE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
const database = firebase.database();
let username = "Guest";
let playerNum;
let currentPlayers = null;
let currentTurn = null;
let playerOneExist = false;
let playerTwoExist = false;
let playerOneData = null;
let playerTwoData = null;

//reference for players obj in database
const playersRef = database.ref("players");
//reference for turns
const currentTurnRef = database.ref("turn");
const playerChat = database.ref("/chat");
// Allow two players at a time.
$("#start").on("click", function () {
  if ($("#username").val() != "") {
    console.log("running");
    username = $("#username").val();
    playerSetup()
  }
})

function playerSetup() {
  if (currentPlayers < 2) {

    if (playerOneExist) {
      playerNum = 2;
    }else {
      playerNum = 1;
    }
    // Creates key based on assigned player number
    playerRef = database.ref("/players/" + playerNum)
    // initializes name, wins, losses.
    playerRef.set({
      name: username,
      wins: 0,
      losses: 0
    })
    //takes away playerinfo if they leave
    playerRef.onDisconnect().remove();
    // set turn to null so game doesn't continue
    currentTurnRef.onDisconnect().remove();
    $("#battlefield").html("<h2> Hi " + username + "! You are Player " + playerNum + "</h2>")
  }
  else {
    alert("Sorry, this game is full!");
  }
}

playersRef.on("value", function (snap) {
  //checks out player database obj and see how many players there are, wee need this to controll how many people are playing
  currentPlayers = snap.numChildren();
  console.log(currentPlayers);

  //check to see if players exist
  playerOneExist = snap.child("1").exists();
  playerTwoExist = snap.child("2").exists();
  //populates player data
  playerOneData = snap.child("1").val();
  playerTwoData = snap.child("2").val();
  //populates correct div (player one or two with name (top, wins and losses (bottom)))
  if (playerOneExist) {
    //creates player 1
    $("#player1-name").text(playerOneData.name)
    // stores name , wins, losses.
    $("#player1-wins").text( "Wins: " + playerOneData.wins)
    $("#player1-losses").text("Losses: " + playerOneData.losses)
  }else {
    $("#player1-name").text("waiting for Player 1")
    // stores name , wins, losses.
    $("#player1-wins").empty()
    $("#player1-losses").empty()
  }
  if (playerTwoExist) {
    //creates player 2
    $("#player2-name").text(playerTwoData.name)
    // stores name , wins, losses.
    $("#player2-wins").text( "Wins: " + playerTwoData.wins)
    $("#player2-losses").text("Losses: " + playerTwoData.losses)
  }else {
    $("#player2-name").text("waiting for Player 2")
    // stores name , wins, losses.
    $("#player2-wins").empty()
    $("#player2-losses").empty()
  }
})
//after 2 players are in the game, we get a turn and it is set to 1
playersRef.on("child_added", function () {
  if (currentPlayers == 1) {
    currentTurnRef.set(1)
  }
})

//Players make selection and see the result for their selections

currentTurnRef.on("value", function (snap) {
  //get the currentTurn
  currentTurn = snap.val()
  console.log(currentTurn);
  //if your logged in
  if (playerNum) {
    console.log("in cTR after playerNum");
    //for turn 1
    //player 1 gets to go first. it will populate div wil rock paper or scizors
    if (currentTurn === 1) {

      //if its the current players turn tell them and show choices
      if (currentTurn === playerNum) {
        //the player whos turn it is gets a message saying its your turn
        $("#current-turn").html("<h2>Its Your Turn!</h2>")
        $("#player" + playerNum + " ul").append("<li>Cowboy<br><img id='cowboy' width='200px' height='75px' src='https://www.bestmoviesbyfarr.com/static-assets/images/articles/background/2019/01/ShaneBig.png' /</li><li>Dragon<br><img id='dragon' width='200px' height='75px' src='https://cdn.vox-cdn.com/thumbor/s0V5UlA3qBBX6OwXZjBifC-3HqM=/0x0:960x540/1200x800/filters:focal(133x228:285x380)/cdn.vox-cdn.com/uploads/chorus_image/image/56075897/_4ac8c88c_79b2_11e7_83e1_68866f5cbeee.0.jpg' /</li><li>Ninja<br><img id='ninja' width='200px' height='75px' src='https://i.ytimg.com/vi/VC2k6yprIlw/maxresdefault.jpg' /</li>")
      }else {
        //if its not the players turn, they get a mesage saying waiting for blank to choose
        $("#current-turn").html("<h2> Waiting for " + playerOneData.name + " to choose.")
      }
      //the user whos turn it is gets a highlighted div
      $("#player1").css("border", "2px solid red");
      $("#player2").css("border", "1px solid black");
    }
    else if (currentTurn === 2) {

      //if its the current players turn tell them and show choices
      if (currentTurn === playerNum) {
        //the player whos turn it is gets a message saying its your turn
        $("#current-turn").html("<h2>Its Your Turn!</h2>")
        $("#player" + playerNum + " ul").append("<li>Cowboy<br><img id='cowboy' width='200px' height='75px' src='https://www.bestmoviesbyfarr.com/static-assets/images/articles/background/2019/01/ShaneBig.png' /</li><li>Dragon<br><img id='dragon' width='200px' height='75px' src='https://cdn.vox-cdn.com/thumbor/s0V5UlA3qBBX6OwXZjBifC-3HqM=/0x0:960x540/1200x800/filters:focal(133x228:285x380)/cdn.vox-cdn.com/uploads/chorus_image/image/56075897/_4ac8c88c_79b2_11e7_83e1_68866f5cbeee.0.jpg' /</li><li>Ninja<br><img id='ninja' width='200px' height='75px' src='https://i.ytimg.com/vi/VC2k6yprIlw/maxresdefault.jpg' /</li>")
      }else {
        //if its not the players turn, they get a mesage saying waiting for blank to choose
        $("#current-turn").html("<h2> Waiting for " + playerTwoData.name + " to choose.")
      }
      //the user whos turn it is gets a highlighted div
      $("#player2").css("border", "2px solid red");
      $("#player1").css("border", "1px solid black");
    }
    //turns is 3
    else if (currentTurn === 3) {
      //both users see what eachother chose
      whoWon(playerOneData.choice, playerTwoData.choice)
      $("#player1-chosen").text(playerOneData.choice);
      $("#player2-chosen").text(playerTwoData.choice);
      //message in middle block gets set to what user won
      //user who won gets increaced wins, user who lost, gets increased losses

      //if tie wins and losses do not increment
      //then game resets
      //turn is now back to 1
    }
  }
})
function whoWon(player1choice, player2choice) {
  function p1Won(){
    if (playerNum == 1) {
      $("#result").append("<p>Way to go " + playerOneData.name + " you conquered the oppoonent!</p>")
      $("#result").append("<h1>" + player1choice + "</h1>")
      playersRef.child("1").child("wins").set(playerOneData.wins + 1)
      playersRef.child("2").child("losses").set(playerTwoData.losses + 1)
    }
  }
  function p2Won(){
    if (playerNum == 2) {
      $("#result").append("<p>Way to go " + playerTwoData.name + " you conquered the oppoonent!</p>")
      $("#result").append("<h1>" + player2choice + "</h1>")
      playersRef.child("2").child("wins").set(playerTwoData.wins + 1)
      playersRef.child("1").child("losses").set(playerOneData.losses + 1)
    }
  }
  const tie = function() {
    $("#result").html("<h2>Tie Game!</h2>");
  };

  if (player1choice === "Ninja" && player2choice === "Ninja") {
    tie();
  }
  else if (player1choice === "Dragon" && player2choice === "Dragon") {
    tie();
  }
  else if (player1choice === "Cowboy" && player2choice === "Cowboy") {
    tie();
  }
  else if (player1choice === "Ninja" && player2choice === "Dragon") {
    p2Won();
  }
  else if (player1choice === "Ninja" && player2choice === "Cowboy") {
  p1Won();
  }
  else if (player1choice === "Dragon" && player2choice === "Ninja") {
  p1Won();
  }
  else if (player1choice === "Dragon" && player2choice === "Cowboy") {
    p2Won();
  }
  else if (player1choice === "Cowboy" && player2choice === "Ninja") {
    p2Won();
  }
  else if (player1choice === "Cowboy" && player2choice === "Dragon") {
  p1Won();
  }
}

$("#game-div").on("click", "li", function () {
  console.log($(this).text());
  //user 1 picks on of the three choices
  const userChoice = $(this).text();
  // only user 1 gets to see What they choose
  $("#player" + playerNum + " ul").empty()
  $("#player" + playerNum + "-chosen").text(userChoice)
  //that players firebase obj gets a new prop called choice its key is the players choice
  playerRef.child("choice").set(userChoice)
  //the turn counter increments (turn: 2)
  currentTurnRef.transaction(function (turn) {
    return turn + 1;
  })
})

$("#chat-send").on("click", function(event) {
	event.preventDefault();
	const message = $("#chat-input").val().trim();
	$("#chat-input").val("");
	if (playerNum == 1) {
		playerChat.push({
			player: playerOneData.name + ": ",
			chat: message,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	} else if (playerNum == 2) {
		playerChat.push({
			player: playerTwoData.name + ": ",
			chat: message,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	};
});

// Adds new messages to chat box and keeps the box scrolled down to most recent
playerChat.orderByChild("dateAdded").on("child_added", function(snapshot) {
	$("#chat-messages").append(snapshot.val().player + snapshot.val().chat + "<br>");
	const bottom = $("#chat-messages").get(0);
    bottom.scrollTop = bottom.scrollHeight;
});
