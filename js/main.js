/* WATS 3020 Browser Game project */
/* Build a tic tac toe game for two players. */

var game = null;
var player1Token = "heart";
var player2Token = "star";

// Player class 
class Player {
    // created with a token and starting player position
    constructor(token, position) {
        this.token = token;
        this.position = position;
        this.score = 0;
    }

    changeToken(token) {
        this.token = token;
    }
}

// Tic Tac Toe Game Class
class TicTacToe {
    constructor() {
        //  Set up `this.player1` and `this.player2` properties.
        console.log("setting up tictactoe game with Player 1 " + player1Token + "and player 2 " + player2Token);
        this.player1 = new Player(player1Token, 1);
        this.player2 = new Player(player2Token, 2);

        // Initialize several  properties that will be used to track game progress.
        this.currentPlayer = this.player1;
        this.gameStatus = null;
        this.winner = null;
        this.moveCount = 0;

        // Set up DOM elements used in game as Class properties
        this.startPrompt = document.querySelector('#start-prompt');
        this.movePrompt = document.querySelector('#move-prompt');
        this.currentPlayerToken = document.querySelector('#player-token');
        this.gameboard = document.querySelector('#gameboard');
        this.winScreen = document.querySelector('#win-screen');
        this.winnerToken = document.querySelector('#winner-token');
        this.drawScreen = document.querySelector('#draw-screen');

        // Initialize an Array representing the starting state of the game board.
        // We can access the spaces on the board using (X, Y) coordinates 
        // as `this.gameState[x][y]`, which is how the game
        // will check to see if the winner is known.
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // Array of Win States
        // Each of these arrays represents the ways
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
                    winningPlayerScore.innerHTML = this.currentPlayer.score;
                    console.log("updating score. Player" + this.currentPlayer.position + ": " + this.currentPlayer.score);
                } else {
                    let winningPlayerScore = document.querySelector("#player2Score");
                    winningPlayerScore.innerHTML = this.currentPlayer.score; console.log("updating score. Player" + this.currentPlayer.position + ": " + this.currentPlayer.score);
                }
                // Createa  `win` event and dispatch it.
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

            // Create a 'draw' event and dispatch it.
            let drawEvent = new Event('draw');
            document.dispatchEvent(drawEvent);
        }
    }

    recordMove(event) {
        // This method handles recording a move in the `this.gameState` property.
        // To record a move, we must accmoplish the following:

        // 1. Find the X, Y coordinates of the tile that was just selected
        // 2. Claim that tile in the `this.gameState` array
        // 3. Set the class attribute of the tile to reflect which player has claimed it


        let tile_x = event.target.getAttribute("data-x")
        let tile_y = event.target.getAttribute("data-y")

        this.gameState[tile_x][tile_y] = this.currentPlayer.token;

        // Set the class on the `event.target` to show the player's token. 
        console.log("setting tile " + tile_x + ":" + tile_y + " to " + this.currentPlayer.token);
        event.target.setAttribute("class", `tile fas fa-${this.currentPlayer.token}`);
        // This prevents a player from claiming on an occupied space by removing the listener.
        event.target.removeEventListener("click", handleMove);
    }
    switchPlayer() {
        // This method handles switching between players after each move.
        // It must determine who the current player is, and then switch to the
        // other player. After that, it must set the class on the
        // `this.currentPlayerToken` property to show the proper class.

        if (this.currentPlayer == this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }

        this.currentPlayerToken.setAttribute("class", `fas fa-${this.currentPlayer.token}`);
    }
    setUpTileListeners() {
        // This method sets up event listeners for tiles. It is called when we
        // start a new game. It must find all the tiles and apply event listeners
        // to them.

        let tileElements = document.querySelectorAll('.tile');
        for (let tile of tileElements) {
            tile.addEventListener("click", handleMove);
        }
    }

    showWinScreen() {
        // This method displays the end game screen for a Win.
        this.winScreen.setAttribute("class", "show");
        console.log("setting winner's token to: " + this.currentPlayer.token);
        this.winnerToken.setAttribute("class", `fas fa-${this.currentPlayer.token}`);
    }

    showDrawScreen() {
        // This method displays the end game screen for a Draw.    
        this.drawScreen.setAttribute("class", "show");
    }

    setUpBoard() {
        // Clear all content from the existing `this.gameboard` element.
        this.gameboard.innerHTML = "";

        // We must draw the game board by using a loop to create rows with
        // tiles in them. We want to create the same structure as we see in the
        // index.html file.

        // Create rows for the gameboard
        for (let i = 0; i < 3; i++) {
            let newRow = document.createElement("div");
            newRow.setAttribute("class", "row");

            // Create columns for the gameboard
            for (let j = 0; j < 3; j++) {
                let newCol = document.createElement("div");
                newCol.setAttribute("class", "col-xs-3");

                // create tiles for the gameboard
                let newTile = document.createElement("span");
                newTile.setAttribute("class", `tile fas-fa-question-sign`);
                newTile.setAttribute("data-x", i);
                newTile.setAttribute("data-y", j);

                // add tiles to the columns
                newCol.appendChild(newTile);

                // add columns to the rows
                newRow.appendChild(newCol);

            }
            // Add rows to the gameboard
            this.gameboard.appendChild(newRow);

            // Reveal player token dropdowns to players can change their icon
            document.getElementById("player1Button").style.display = "block";
            document.getElementById("player2Button").style.display = "block";

        }

        // Call `this.setUpTileListeners()` to add event listeners to the `.tile` elements.
        this.setUpTileListeners();
    }

    initializeMovePrompt() {
        // This method initializes the `this.movePrompt` element.
        this.startPrompt.setAttribute("class", "hidden");

        this.movePrompt.removeAttribute("class", "hidden");

        // Set `this.currentPlayer` and token
        this.currentPlayerToken.setAttribute("class", `fas fa-${this.currentPlayer.token}`);
    }


    start() {
        // This method handles the logic to create a new game. It primarily has
        // two duties in the basic version of the game:

        // Create a new gameboard by calling `this.setUpBoard`
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
        // Initialize the move prompt by calling `this.initializeMovePrompt`.
        this.initializeMovePrompt();

    }
} // End of the Tic Tac Toe Class definition.

// Outside of the Class definitions, we need a few items to control the game
// so our players can successfully play.

document.addEventListener('DOMContentLoaded', function (event) {

    let startButton = document.querySelector('#start-button');

    // Listens for a "click" event and executes an anonymous function to start the game.
    startButton.addEventListener("click", function (e) {
        console.log("creating new TicTacToe Game")
        game = new TicTacToe();
        game.start();

    });



});


// Listen for the "win" event signal andcall the `game.showWinScreen()`
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

// Listen for the "draw" event signal and call the `game.showDrawScreen()`
// method to display the tie game screen.
document.addEventListener('draw', function (event) {

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
    console.log("handling Move");
    //disable Player token dropdown 
    document.getElementById("player1Button").style.display = "none";
    document.getElementById("player2Button").style.display = "none";
    // Record the move for the current player.
    game.recordMove(event);

    // Check to see if the last move was a winning move.
    game.checkForWinner();

    // Rotate players.
    game.switchPlayer();
}


// Player Token Drop Down fuctionality

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


function player1Dropdown() {
    document.getElementById("player1Dropdown").classList.toggle("show");
    console.log("inside player1Dropdown function");
    let setPlayer1Heart = document.querySelector("#player1Heart")
    setPlayer1Heart.addEventListener("click", function (e) {
        console.log("setting heart");
        player1Token = 'heart';
        setPlayer1Token();
    });
    let setPlayer1Jet = document.querySelector("#player1Jet")
    setPlayer1Jet.addEventListener("click", function (e) {
        console.log("setting jet");

        player1Token = 'fighter-jet';
        console.log("setting heart");

        setPlayer1Token();
    });
    let setPlayer1Ski = document.querySelector("#player1Ski")
    setPlayer1Ski.addEventListener("click", function (e) {
        player1Token = 'skiing';
        setPlayer1Token();
    });
    let setPlayer1Dog = document.querySelector("#player1Dog")
    setPlayer1Dog.addEventListener("click", function (e) {
        player1Token = 'dog';
        setPlayer1Token();
    });


}


function player2Dropdown() {
    document.getElementById("player2Dropdown").classList.toggle("show");
    console.log("inside player2Dropdown function");
    let setPlayer2Star = document.querySelector("#player2Star")
    setPlayer2Star.addEventListener("click", function (e) {
        player2Token = 'star';
        setPlayer2Token();
    });
    let setPlayer2Helicopter = document.querySelector("#player2Helicopter")
    setPlayer2Helicopter.addEventListener("click", function (e) {
        player2Token = 'helicopter';
        setPlayer2Token();
    });
    let setPlayer2Snowboard = document.querySelector("#player2Snowboard")
    setPlayer2Snowboard.addEventListener("click", function (e) {
        player2Token = 'snowboarding';
        setPlayer2Token();
    });
    let setPlayer2Cat = document.querySelector("#player2Cat")
    setPlayer2Cat.addEventListener("click", function (e) {
        player2Token = 'cat';
        setPlayer2Token();
    });


}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


// add function for setting Player 1 Token to selected Icon
function setPlayer1Token() {
    console.log("called setPlayer2Token with " + player2Token);
    let player1Icon = document.querySelector("#player1");
    player1Icon.setAttribute("class", `player-icon fas fa-${player1Token}`);
    if (game != null) {
        game.player1.changeToken(player1Token);
    }

}


function setPlayer2Token() {
    console.log("called setPlayer2Token with " + player2Token);
    let player2Icon = document.querySelector("#player2");
    player2Icon.setAttribute("class", `player-icon fas fa-${player2Token}`);
    if (game != null) {
        game.player2.changeToken(player2Token);
    }


}