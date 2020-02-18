/* WATS 3020 Browser Game project */
/* Build a tic tac toe game for two players. */

// TODO: declare a global variable named 'game` - 
//it will reference the instance of the current game
var game = null;

// TODO: Create a class called `Player`. The `constructr()` should look for a
// parameter called `token` and should set `this.token` as a property of
// the class.
class Player {
    constructor(token, position) {
        this.token = token;
        this.position = position;
        this.score = 0;
    }
}

// Tic Tac Toe Game Class
class TicTacToe {
    constructor() {
        // TODO: Set up `this.player1` and `this.player2` properties.
        // These properties should be new Player class instances.
        // You may set the "token" to anything that corresponds to a Icon
        // icon name ('heart', 'star', 'remove-sign', 'unchecked', 'bell',
        // 'certificate', etc.)

        this.player1 = new Player('cat', 1);
        this.player2 = new Player('dog', 2);

        // TODO: Initialize several  properties that will be used to track game
        // progress.

        // TODO: Set `this.currentPlayer` equal to `null`
        this.currentPlayer = this.player1;
        // TODO: Set `this.gameStatus` equal to `null`
        this.gameStatus = null;
        // TODO: Set `this.winner` equal to `null`
        this.winner = null;
        // TODO: Set `this.moveCount` equal to `0`
        this.moveCount = 0;
        // TODO: Set up DOM elements used in game as Class properties

        // TODO: Set `this.startPrompt` equal to the `#start-prompt` element
        this.startPrompt = document.querySelector('#start-prompt');
        // TODO: Set `this.movePrompt` equal to the `#move-prompt` element
        this.movePrompt = document.querySelector('#move-prompt');
        // TODO: Set `this.currentPlayerToken` equal to the `#player-token` element
        this.currentPlayerToken = document.querySelector('#player-token');
        // TODO: Set `this.gameboard` equal to the `#gameboard` element
        this.gameboard = document.querySelector('#gameboard');
        // TODO: Set `this.winScreen` equal to the `#win-screen` element
        this.winScreen = document.querySelector('#win-screen');
        // TODO: Set `this.winnerToken` equal to the `#winner-token` element
        this.winnerToken = document.querySelector('#winner-token');
        // TODO: Set `this.drawScreen` equal to the `#draw-screen` element
        this.drawScreen = document.querySelector('#draw-screen');
        // Initialize an Array representing the starting state of the game board.
        // This is provided for you. We can access the spaces on the board using
        // (X, Y) coordinates as `this.gameState[x][y]`, which is how the game
        // will check to see if the winner is known.
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // Array of Win States
        // This is provided for you. Each of these arrays represents the ways
        // a player can win Tic Tac Toe. Each item in the array is another
        // array. Each of those arrays contains a set of (X, Y) coordinates.
        // If a player has claimed the tile at each of the coordinates listed in
        // one of the win states, then they have won the game.
        this.winStates = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
    }

    // This `checkForWinner()` method is provided for you, but you must fill in
    // the event dispatch lines that cause the end game screens to show.
    checkForWinner() {
        for (let condition of this.winStates) {
            let winningCondition = true;
            for (let position of condition) {
                if (this.gameState[position[0]][position[1]] != this.currentPlayer.token) {
                    winningCondition = false;
                }
            }
            if (winningCondition) {
                console.log('We have a winner!');
                console.log(`Condition is: ${condition}`);
                this.gameStatus = 'won';
                this.winner = this.currentPlayer;

                //CYPR feature: increment player score
                this.currentPlayer.score += 1;
                console.log("Current score is player 1:" + this.player1.score + " player2:" + this.player2.score);
                if (this.currentPlayer.position == 1) {
                    let winningPlayerScore = document.querySelector("#player1Score");
                    winningPlayerScore.innerHTML=this.currentPlayer.score;
                    console.log("updating score. Player" +this.currentPlayer.position + ": " + this.currentPlayer.score);
                } else {
                    let winningPlayerScore = document.querySelector("#player2Score");
                    winningPlayerScore.innerHTML=this.currentPlayer.score;                    console.log("updating score. Player" +this.currentPlayer.position + ": " + this.currentPlayer.score);
                }
                // If we've gotten here, then we need to createa  `win` event and
                // dispatch it.
                let winEvent = new Event('win');
                document.dispatchEvent(winEvent);

                return true; // Return a value to stop processing the additional move count check.
            }
        }
        this.moveCount++;
        console.log(`Reviewed move ${this.moveCount}.`)
        if (this.moveCount >= 9) {
            console.log(`This game is a draw at ${this.moveCount} moves.`);
            this.gameStatus = 'draw';

            // TODO: Create a new event called `drawEvent` that dispatches the signal "draw".
            let drawEvent = new Event('draw');
            // TODO: Dispatch the `drawEvent` event.
            document.dispatchEvent(drawEvent);
        }
    }

    recordMove(event) {
        // This method handles recording a move in the `this.gameState` property.
        // To record a move, we must accmoplish the following:

        // 1. Find the X, Y coordinates of the tile that was just selected
        // 2. Claim that tile in the `this.gameState` array
        // 3. Set the class attribute of the tile to reflect which player has claimed it

        // TODO: Define a variable called `tile_x` that equals the `data-x` attribute
        // on the `event.target`.
        let tile_x = event.target.getAttribute("data-x")
        // TODO: Define a variable called `tile_y` that equals the `data-y` attribute on the `event.target`.
        let tile_y = event.target.getAttribute("data-y")
        // TODO: Claim this spot in the `this.gameState` array for the player.
        this.gameState[tile_x][tile_y] = this.currentPlayer.token;
        // TODO: Set the class on the `event.target` to show the player's token. The class
        // should be: `tile played fas fa-${this.currentPlayer.token}`.
        console.log("setting tile " + tile_x + ":" + tile_y + " to " + this.currentPlayer.token);
        event.target.setAttribute("class", `tile fas fa-${this.currentPlayer.token}`);
    }
    switchPlayer() {
        // This method handles switching between players after each move.
        // It must determine who the current player is, and then switch to the
        // other player. After that, it must set the class on the
        // `this.currentPlayerToken` property to show the proper class.

        // TODO: Make a conditional that checks to see if `this.currentPlayer`
        // is equal to `this.player1` If so, set `this.currentPlayer` to
        // `this.player2`. If not, set `this.currentPlayer` equal to
        // `this.player1`. (You will use an if/else statement to do this.)
        if (this.currentPlayer == this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }

        // TODO: Set the `class` attribute on `this.currentPlayerToken` to
        // reflect the current player's token. (Note: You will need to use the
        // proper Icon classes combined with the `this.currentPlayer.token`
        // value.)
        this.currentPlayerToken.setAttribute("class", `fas fa-${this.currentPlayer.token}`);
    }
    setUpTileListeners() {
        // This method sets up event listeners for tiles. It is called when we
        // start a new game. It must find all the tiles and apply event listeners
        // to them.

        // TODO: Select all of the `.tile` elements into a variable called
        // `tileElements`.
        // TODO: Use a loop to add a "click" event listener to each tile that
        // will call the `handleMove` function whenever a tile is clicked.

        let tileElements = document.querySelectorAll('.tile');
        for (let tile of tileElements) {
            tile.addEventListener("click", handleMove);
        }
    }
    showWinScreen() {
        // This method displays the end game screen for a Win.

        // TODO: Change the `class` attribute on the `this.winScreen` property
        // to "show".

        this.winScreen.setAttribute("class", "show");

        // TODO: Change the `class` attribute on the `this.winnerToken` property
        // to show the proper winner's token.
        console.log("setting winner's token to: " + this.currentPlayer.token);
        this.winnerToken.setAttribute("class", `fas fa-${this.currentPlayer.token}`);

    }
    showDrawScreen() {

        // This method displays the end game screen for a Draw.

        // TODO: Set the `class` attribute on the `this.drawScreen` property
        // to "show".
        this.drawScreen.setAttribute("class", "show");
    }

    setUpBoard() {
        // TODO: Clear all content from the existing `this.gameboard` element.
        this.gameboard.innerHTML = "";

        // We must draw the game board by using a loop to create rows with
        // tiles in them. We want to create the same structure as we see in the
        // index.html file.

        // TODO: Create a `for` loop that will loop three times. The counter
        // variable in this loop should be called `i`.
        for (let i = 0; i < 3; i++) {
            // TODO: Create a new div element called `newRow
            // TODO: Set the `class` attribute on `newRow` to "row".

            let newRow = document.createElement("div");
            newRow.setAttribute("class", "row");

            // TODO: Create another `for` loop to make the colums to contain the
            // tiles. This `for` loop should also loop 3 times. The counter
            // variable in this loop should be called `j`.

            for (let j = 0; j < 3; j++) {

                // TODO: Create a new `div` element called `newCol`.
                // TODO: Set the `class` attribute on `newCol` to "col-xs-3".
                // TODO: Create a new `span` element called `newTile`.
                // TODO: Set the `class` attribute on `newTile` to equal the
                // placeholder styles ("tile fas fa-question-sign").

                let newCol = document.createElement("div");
                newCol.setAttribute("class", "col-xs-3");
                let newTile = document.createElement("span");
                newTile.setAttribute("class", `tile fas-fa-question-sign`);
                // TODO: Set the `data-x` attribute on the `newTile` element
                // equal to `i`.

                // TODO: Set the `data-y` attribute on the `newTile` element
                // equal to `j`.
                newTile.setAttribute("data-x", i);
                newTile.setAttribute("data-y", j);

                // TODO: Append `newTile` as a child to `newCol`.
                newCol.appendChild(newTile);

                // TODO: Append `newCol` as a child to `newRow`.
                newRow.appendChild(newCol);

            }
            // TODO: Append the `newRow` element to `this.gameboard` as a child element.
            this.gameboard.appendChild(newRow);

        }
        //set the player icons for the scoreboard
        let player1Icon = document.querySelector("#player1");
        player1Icon.setAttribute("class", `player-icon fas fa-${this.player1.token}`);
       // player1Icon.addEventListener("mouseover", changeIcon);
        let player2Icon =  document.querySelector("#player2");
        player2Icon.setAttribute("class", `player-icon fas fa-${this.player2.token}`);
        //player2Icon.addEventListener("mouseover", changeIcon);

        // TODO: Call `this.setUpTileListeners()` to add event listeners to the
        // `.tile` elements.
        this.setUpTileListeners();
    }
// add function for changing icon
  //  changeIcon(){
      
 //   }
 
    initializeMovePrompt() {
        // This method initializes the `this.movePrompt` element.

        // TODO: Hide the `this.startPrompt` element by setting the `class`
        // attribute to "hidden".
        this.startPrompt.setAttribute("class", "hidden");

        // TODO: Remove the "hidden" class from the `this.movePrompt` element.
        this.movePrompt.removeAttribute("class", "hidden");

        // TODO: Set `this.currentPlayer` equal to `this.player1`.
        //this.currentPlayer = this.player1;
        // TODO: Set `this.currentPlayerToken` class equal to `fas fa-${this.currentPlayer.token}`
        this.currentPlayerToken.setAttribute("class", `fas fa-${this.currentPlayer.token}`);
    }


    start() {
        // This method handles the logic to create a new game. It primarily has
        // two duties in the basic version of the game:

        // TODO: Create a new gameboard by calling `this.setUpBoard`
        console.log("setting up board");
        this.setUpBoard();


        // reseting game properties
        this.gameStatus = null;
        this.winner = null;
        this.moveCount = 0;
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        console.log("initializing move prompt");
        // TODO: Initialize the move prompt by calling `this.initializeMovePrompt`.
        this.initializeMovePrompt();

    }
} // End of the Tic Tac Toe Class definition.

// Outside of the Class definitions, we need a few items to control the game
// so our players can successfully play.

// TODO: Add an event listener to the `document` object that will watch for the
// "DOMContentLoaded" event signal. This listener should execute an anonymous
// function to handle the "DOMContentLoaded" event.

document.addEventListener('DOMContentLoaded', function (event) {

    // TODO: Inside the "DOMContentLoaded" event handler, perform the following
    // steps:

    // TODO: Select the `#start-button` element from the DOM and save it as a
    // variable called `startButton`.
    let startButton = document.querySelector('#start-button');

    // TODO: Create an event listener on the `startButton` element that listens for
    // a "click" event and executes an anonymous function to start the game.
    startButton.addEventListener("click", function (e) {
        console.log("creating new TicTacToe Game")
        game = new TicTacToe();
        game.start();

    });

});

// TODO: Add an event listener on the `document` object that listens for the
// "win" event signal.

// TODO: In the handler for the "win" event, call the `game.showWinScreen()`
// method to display the winning screen.
document.addEventListener("win", function (event) {
    game.showWinScreen();

    //Stretch Goal: Add event listener to reset and restart game when 'play again' button is clicked
    let playAgain = document.querySelector('#winPlayAgain');
    console.log("user pushed play again " + playAgain.getAttribute("class"));
    playAgain.addEventListener("click", function (e) {
        game.winScreen.removeAttribute("class", "show");
        console.log("restarting TicTacToe Game")
        game.start();
    });

});

// TODO: Add an event listener on the `document` object that listens for the
// "draw" event signal.
document.addEventListener('draw', function (event) {
    // TODO: In the handler for the "draw" event, call the `game.showDrawScreen()`
    // method to display the tie game screen.
    game.showDrawScreen();

    let playAgain = document.querySelector('#drawPlayAgain');
    console.log("user pushed play again " + playAgain.getAttribute("class"));
    playAgain.addEventListener("click", function (e) {
        game.drawScreen.removeAttribute("class", "show");
        console.log("restartingTicTacToe Game")
        game.start();
    });


});




// External function for event listeners provided for you.
function handleMove(event) {
    // Record the move for the current player.
    game.recordMove(event);

    // Check to see if the last move was a winning move.
    game.checkForWinner();

    // Rotate players.
    game.switchPlayer();
}
