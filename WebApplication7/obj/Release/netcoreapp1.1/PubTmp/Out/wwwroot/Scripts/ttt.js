var count = 0;
var isPlayingWithComputer = false;
var computer, user;
var compWinValue = 1, userWinValue = -1;
var count = 0;
var canPlay = false;
var gameOver = false;
var oneOption = false;
// create a class object that is called State which holds
// the following down below
// board = all the individual tiles
// moveMade = 
var State = (function () {
    function State() {
        this.board = new Array(9);
        this.moveMade = -1;
        this.score = null;
        this.whichPlayerPlayed = 0;
        this.isCompleted = false;
    }
    return State;
}());
//initializing the variables for object currentState
var currentState = {
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    moveMade: 1,
    score: null,
    whichPlayerPlayed: 0,
    isCompleted: false
};
//prints the welcoming message
function startGame() {
    setMessage("Select an opponent above");
}
//values are set if the computer is going first
function CPUFirst() {
    if (!gameOver && !oneOption) {
        oneOption = true;
        computer = "X";
        user = "O";
        count = 1;
        canPlay = true;
        currentState.whichPlayerPlayed = compWinValue;
        document.getElementById("5").innerText = computer;
        setMessage("You are O's");
    }
}
//Values are set if the user is going first
function UserFirst() {
    if (!gameOver && !oneOption) {
        oneOption = true;
        computer = "O";
        user = "X";
        canPlay = true;
        currentState.whichPlayerPlayed = userWinValue;
        setMessage("You are X's");
    }
}
//This is a move that the user is making
function currentMove(square) {
    if (canPlay && !gameOver) {
        if (document.getElementById(square).innerText != "") {
            setMessage("That's an invalid move");
            return;
        }
        if (endGame(currentState) == false) {
            count++;
            document.getElementById(square).innerText = user;
            markBoard(currentState);
            endGame(currentState);
            nextMove();
            count++;
            endGame(currentState);
        }
        endGame(currentState);
    }
}
// After the intial move, the computer will make a move
function nextMove() {
    if (endGame(currentState) == false) {
        markBoard(currentState);
        currentState.whichPlayerPlayed = userWinValue;
        var num = computerMakingMove(currentState);
        document.getElementById(num).innerText = computer;
        markBoard(currentState);
        currentState.whichPlayerPlayed = compWinValue;
    }
    endGame(currentState);
}
// sets the message at the bottom of the screen 
function setMessage(msg) {
    document.getElementById("message").innerText = msg;
}
// get the id of the boxes in the tic tac toe
function getBox(number) {
    return document.getElementById(number).innerText;
}
//function that markes all the positions that are filled
function markBoard(state) {
    var num;
    for (var i = 0; i < state.board.length; i++) {
        if (getBox(i + 1) == "X") {
            if (computer == "X") {
                state.board[i] = 1;
            }
            else if (user == "X") {
                state.board[i] = -1;
            }
        }
        else if (getBox(i + 1) == "O") {
            if (computer == "O") {
                state.board[i] = 1;
            }
            else if (user == "O") {
                state.board[i] = -1;
            }
        }
        else {
            state.board[i] = 0;
        }
        num += state.board[i];
    }
}
// create a function that takes in a board and determines if it is full
function isBoardFull() {
    for (var i = 0; i < 9; i++) {
        if (currentState.board[i] == 0) {
            return false;
        }
        return true;
    }
}
// Returns a list of possible states that can be made for the computer
function getNextStates(state) {
    var currentBoard = state.board;
    var listOfStates = [];
    var playerForNextStates;
    if (state.whichPlayerPlayed == compWinValue) {
        playerForNextStates = userWinValue;
    }
    else {
        playerForNextStates = compWinValue;
    }
    for (var i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] == 0) {
            var tempState = new State();
            var tempArr = currentBoard.slice();
            tempState.moveMade = i + 1;
            tempState.whichPlayerPlayed = playerForNextStates;
            tempArr[i] = playerForNextStates;
            tempState.board = tempArr;
            listOfStates.push(tempState);
        }
    }
    for (var j = 0; j < listOfStates.length; j++) {
        var stat = listOfStates[j];
        stat.isCompleted = true;
        for (var k = 0; k < 9; k++) {
            if (stat.board[k] == 0) {
                stat.isCompleted = false;
                break;
            }
        }
    }
    return listOfStates;
}
// checks all the possiblilties if there are three of a kind in a row
function check(a, b, c) {
    var result = false;
    if (a == b && b == c) {
        if (a == compWinValue) {
            return compWinValue;
        }
        else if (a == userWinValue) {
            return userWinValue;
        }
    }
    return 0;
}
// calculates a score for state
function calculateScore(state, level) {
    var num = 0;
    num += check(state.board[0], state.board[1], state.board[2]);
    num += check(state.board[3], state.board[4], state.board[5]);
    num += check(state.board[6], state.board[7], state.board[8]);
    num += check(state.board[0], state.board[3], state.board[6]);
    num += check(state.board[1], state.board[4], state.board[7]);
    num += check(state.board[2], state.board[5], state.board[8]);
    num += check(state.board[0], state.board[4], state.board[8]);
    num += check(state.board[2], state.board[4], state.board[6]);
    if (level == -1) {
        return num;
    }
    if (num > 0) {
        return num + level;
    }
    else if (num < 0) {
        return num - level;
    }
    else {
        if (state.isCompleted == false) {
            return null;
        }
        else {
            return 0;
        }
    }
}
//The computer is anaylzing which play is the best case scenerio
function computerGamePlay(state, level) {
    level--;
    state.score = calculateScore(state, level);
    if (state.score != null) {
        return state;
    }
    var allStates = getNextStates(state);
    var score = null;
    var index = -1;
    for (var i = 0; i < allStates.length; i++) {
        var winState = computerGamePlay(allStates[i], level);
        allStates[i].score = winState.score;
        if (score == null) {
            score = allStates[i].score;
            index = i;
        }
        if (allStates[i].whichPlayerPlayed == compWinValue) {
            if (allStates[i].score > score) {
                score = allStates[i].score;
                index = i;
            }
        }
        else {
            if (allStates[i].score < score) {
                score = allStates[i].score;
                index = i;
            }
        }
    }
    return allStates[index];
}
//The computer takes the best win scenerio and makes the move
function computerMakingMove(state) {
    var s = computerGamePlay(state, 11);
    return s.moveMade;
}
// Prints congratulatory statement if user wins or say there's no winner
function endGame(state) {
    if (calculateScore(state, 0) == userWinValue ||
        calculateScore(state, 0) == compWinValue ||
        count >= 9) {
        var finalScore = calculateScore(state, -1);
        if (finalScore > 0) {
            setMessage("Sorry, better luck next time :(");
        }
        else if (finalScore < 0) {
            setMessage("Congratulations! You Win! :D");
        }
        else {
            setMessage("It's a tie!");
        }
        gameOver = true;
        return true;
    }
    return false;
}
//# sourceMappingURL=ttt.js.map