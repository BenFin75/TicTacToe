// game board module
const gameBoard = ((p) => {
    // the game board
    const board = {
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
        6:0,
        7:0,
        8:0,
        9:0,
    };

    let playerTwoMark = "./img/playerTwoMark.png";

    // create/update the board in the html
    const makeBoard = () => {
        const gameBoard = document.querySelector('#board');
        gameBoard.innerHTML = '';
        Object.entries(board).forEach(entry => {
            const [key, value] = entry;
            let box = document.createElement('div');
            let boxMarker = document.createElement('img');
            box.addEventListener('click', game.playGame)
            box.classList.add('cell');
            box.classList.add(`c${key}`);
            switch (value) {
                case 0:
                    marker = " ";
                    break;
                case 1:
                    marker = "./img/playerOneMark.png";
                    boxMarker.src = marker;
                    box.appendChild(boxMarker)
                    break;
                case 2:
                    marker = playerTwoMark;
                    boxMarker.src = marker;
                    box.appendChild(boxMarker)
                    break;
            };
            // box.src = marker;
            gameBoard.appendChild(box);
        });
    };

    //update the board with the move passed in
    const markOff = (cell, marker) => {
        board[cell] = marker;
        makeBoard();
    }

    // check if a board position is empty
    const checkClear = (cell) => {
        if (board[cell] === 0) {
            return true;
        } else {
            return false;
        }
    }

    // check the board to see if soemone has won
    const winCheck = () => {
        // check for horizontal wins
        for (let i = 1; i < 9; i = i + 3) {
            if (board[i] === board[i+1] && board[i] === board[i+2] && board[i] > 0) {
                return board[i];
            }
        }
        // check for vertical wins
        for (let i = 1; i < 4; i++) {
            if (board[i] === board[i+3] && board[i] === board[i+6] && board[i] > 0) {
                return board[i];
            }
        }
        // check for left to right diagonal wins
        if (board[1] === board[5] && board[1] === board[9] && board[1] > 0) {
            return board[1];
        }
        //check for right to left diagonal wins
        if (board[3] === board[5] && board[3] === board[7] && board[3] > 0) {
            return board[3];
        }
        //check if the board is filled and the result is a tie
        let tie = true;
        Object.values(board).forEach(value => {
            if (value === 0) {
                tie = false;
            }
        })
        if (tie) {
            return 3;
        } else {
            return 0;
        };
    }

        //checks if the ai's game iteration has been won or lost
    function minimax (isMaximizing, depth, ai) {
            if (winCheck() === 2) {
                return 100 - depth;
            } else if (winCheck() === 1) {
                return -1;
            } else if (winCheck() === 3) {
                return 0;
            }
        
        if (ai < 4) {
            if (depth >= ai) {
                return 0;
            }
        }

        if (isMaximizing) {
            let bestScore = -1000

            Object.entries(board).forEach(entry => {
                let [key, value] = entry;
                if (value === 0) {
                    board[key] = 2;
                    let score = minimax(false, depth + 1, ai);
                    board[key] = 0;
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    if (key === 3) {
                    }
                }   
            })
            return bestScore;

        } else {
            let bestScore = 800

            Object.entries(board).forEach(entry => {
                let [key, value] = entry;
                if (value === 0) {
                    board[key] = 1;
                    let score = minimax(true, depth + 1, ai);
                    board[key] = 0;
                    if (score < bestScore) {
                        bestScore = score;
                    }
                    if (depth === 1) {
                    }
                }
            })
            return bestScore;
        }
    }

    // recursivly plays the game and the submits the best move
    function aiMove (ai) {
        let bestScore = -1
        let bestMoves = [];

        Object.entries(board).forEach(entry => {
            let [key, value] = entry;
            if (value === 0) {
                board[key] = 2;
                let score = minimax(false, 0, ai);
                board[key] = 0;
                if (score > bestScore) {
                    bestMoves = []
                    bestScore = score;
                    bestMoves.push(key);
                } else if (score === bestScore) {
                    bestMoves.push(key);
                }
            }
        })
        let bestMoveIndex = Math.floor(Math.random() * bestMoves.length)
        let bestMove = bestMoves[bestMoveIndex]
        return bestMove;
    }

    const reset = () => {
        Object.keys(board).forEach(key => board[key] = 0);
        game.reset();
    }
        
    const setMark = (selection) => {
        switch (selection) {
            case "Two Player":
                marker = "./img/playerTwoMark.png";
                break;
            case "Easy":
                marker = "./img/easy.png";
                break;
            case "Medium":
                marker = "./img/medium.png";
                break;
            case "Hard":
                marker = "./img/hard.png";
                break;
            case "Unbeatable":
                marker = "./img/unbeatableMark.png";
                break;
        }
        playerTwoMark = marker
    }

    //return the boards methods
    return {makeBoard, markOff, winCheck, checkClear, aiSetup: aiMove, reset, setMark}
})();

// player factory function
const player = (selection) => {
    // init X or O as well as if the player is an ai
    let marker;
    let ai;
    
    // choose X if player 1
    if (selection === 1) {
        marker = 1;
        ai = 0;
    // chose O and ai status for palyer 2
    } else {
        marker = 2;
        switch (selection) {
            case 'Two Player':
                ai = 0;
                break;
            case 'Easy':
                ai = 1;
                break;
            case 'Medium':
                ai = 2;
                break;
            case 'Hard':
                ai = 3;
                break;
            case 'Unbeatable':
                ai = 4;
                break;
        }
    }

    // method for the player to submit their move to the game board
    const markOff = (cell) => {
        if (ai === 0){
            gameBoard.markOff(cell, marker);
        // if its the ai, call the ai alogrithm to choose the move
        } else {
            cell = gameBoard.aiSetup(ai);
            gameBoard.markOff(cell, marker);
        }
    }

    const returnAI = () => {
        return ai
    }

    return {markOff, returnAI};
}

// the module to handle the game play logic
const game = (() => {
    // init player one as human, init player 2
    const playerOne = player(1);
    let playerTwo;
    // init gamestate as player 1 goes first, init game won as on going
    let gameState = 1;
    let gameWon = 0;
    


    // choose opponent (player 2)
    const chooseType = (e) => {
        const playerSelection = e.currentTarget.textContent;
        playerTwo = player(playerSelection);
        displayHandler.drawBoard(playerSelection);
    }

    // the method called when a cell is clicked to mark it off
    // and change the game state to the next player goes
    const playGame = (e) => {
        const playerDisplay = document.querySelectorAll('.playerIcon')
        const [playerOneDisplay, playerTwoDisplay] = playerDisplay;
        let cell;
        if (e === 0) {
            cell = 0;
        } else {
            cell = e.currentTarget.classList[1].substring(1);
        }
        if (gameWon === 0) {
            
            //if check if the cell is clear
            if ((gameState === 1 || playerTwo.returnAI() === 0) && !gameBoard.checkClear(cell)) {
                return;
            }

            else if (gameState === 1) {
                playerOne.markOff(cell);
                gameState = 2;
                playerOneDisplay.classList.toggle('currentTurn')
                playerTwoDisplay.classList.toggle('currentTurn')
                gameWon = gameBoard.winCheck();
                if (playerTwo.returnAI() > 0 && gameWon === 0) {
                    playGame(0);
                }
            } else {
                playerTwo.markOff(cell);
                gameState = 1;
                playerOneDisplay.classList.toggle('currentTurn')
                playerTwoDisplay.classList.toggle('currentTurn')
            }

            // check if the game has been won or tied   
            gameWon = gameBoard.winCheck();
            if (gameWon !== 0 && e != 0) {
                displayHandler.declareWinner(gameWon);
            }
        } 
    }

    const reset = () => {
        gameState = 1;
        gameWon = 0;
    }
    return {chooseType, playGame, reset};
})();

// handle drawing the non game related graphics
const displayHandler = (() => {

    const playAgain = document.querySelector('#playagain');
    const playArea = document.querySelector('.playing')
    const playerOneDisplay = document.createElement('img');
    const playerTwoDisplay = document.createElement('img');
    const header = document.querySelector('header');
    //draw opponent selection at start
    const selection = () => {
        const players = playArea.querySelectorAll('img');
        if (players.length > 0) {
            header.innerHTML = '';
            playerOneDisplay.classList.remove('currentTurn');
            playerTwoDisplay.classList.remove('currentTurn');
            players.forEach(img => img.remove());
            gameBoard.reset()
            playAgain.innerHTML = '';
            const oldGame = document.querySelector('.playing');
            const gameHTML = oldGame.querySelectorAll('div');
            gameHTML.forEach(div => div.innerHTML = '');
        }
        header.textContent = 'Choose your opponent!'
        const options = ['Two Player', 'Easy', 'Medium', 'Hard', 'Unbeatable'];
        const selection = document.querySelector('#selection');
        options.forEach(option => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const description = document.createElement('div');
            switch (option) {
            case "Two Player":
                img.src = "./img/playerTwo.png";
                break;
            case "Easy":
                img.src = "./img/easy.png";
                break;
            case "Medium":
                img.src = "./img/medium.png";
                break;
            case "Hard":
                img.src = "./img/hard.png";
                break;
            case "Unbeatable":
                img.src = "./img/unbeatable.png";
                break;
            }
        
            div.addEventListener('click', game.chooseType);
            description.textContent = option;
            div.appendChild(img);
            div.appendChild(description)
            selection.appendChild(div);
        })
    }
    const drawBoard = (playerSelection) => {
        const board = document.querySelector('#board')
        const selection = document.querySelector('#selection');
        header.textContent = 'Begin!';
        selection.innerHTML='';
        playerOneDisplay.classList.add('playerIcon')
        playerOneDisplay.classList.add('currentTurn')
        playerTwoDisplay.classList.add('playerIcon')
        playerOneDisplay.src = "./img/playerOne.png";
        switch (playerSelection) {
            case "Two Player":
                playerTwoDisplay.src = "./img/playerTwo.png";
                break;
            case "Easy":
                playerTwoDisplay.src = "./img/easy.png";
                break;
            case "Medium":
                playerTwoDisplay.src = "./img/medium.png";
                break;
            case "Hard":
                playerTwoDisplay.src = "./img/hard.png";
                break;
            case "Unbeatable":
                playerTwoDisplay.src = "./img/unbeatable.png";
                break;
        }
        playArea.insertBefore(playerOneDisplay, board);
        playArea.appendChild(playerTwoDisplay);
        gameBoard.setMark(playerSelection);
        // draw the game board to start game
        gameBoard.makeBoard();
    }

    // draw the winner graphics
    function declareWinner (gameWon) {
        const winMessage = document.createElement('div');
        winMessage.classList.add('winMessage');
        if (gameWon !== 3) {
            if (gameWon === 1) {
                message = 'Player One Wins!';
            } else {
                message = 'Player Two Wins!';
            }

        } else {
            message = "It's a tie!";
        }
        winMessage.textContent = message;
        header.textContent = '';
        header.appendChild(winMessage)
        const playAgainButton = document.createElement('div')
        playAgainButton.textContent = 'Play Again';
        playAgainButton.addEventListener('click', selection)
        playAgain.appendChild(playAgainButton);
    }

    return {selection, declareWinner, drawBoard}
})()

//start the game with opponent selection
displayHandler.selection();