function Cell() {
  let value = null;
  const addToken = (playerToken) => (value = playerToken);
  const getToken = () => value;
  return { addToken, getToken };
}

function GameBoard() {
  const board = [];

  for (let i = 0; i < 6; i++) {
    board[i] = [];
    for (let j = 0; j < 7; j++) {
      board[i][j] = Cell();
    }
  }

  const getBoard = () => board;

  const dropToken = (column, currentPlayer) => {
    const availableRows = board.filter(
      (row) => row[column].getToken() === null
    );
    if (availableRows.length === 0) return;
    board[availableRows.length - 1][column].addToken(currentPlayer.token);
  };

  const printBoard = () => {
    //helper function for printing the board
    board.forEach((row) => {
      console.log(row.map((cell) => cell.getToken()));
    });
  };

  return { getBoard, dropToken, printBoard };
}

function GameController() {
  //players
  const players = [
    { name: "player1", token: "X" },
    { name: "player2", token: "O" },
  ];
  //const currentPlayer
  let currentPlayer = players[0];

  const board = GameBoard();

  const switchCurrentPlayer = () =>
    (currentPlayer =
      currentPlayer.name == players[0].name ? players[1] : players[0]);
  //playRound

  const playRound = (column) => {
    board.dropToken(column, currentPlayer);
    switchCurrentPlayer();
  };

  return { playRound, printBoard: board.printBoard, getBoard: board.getBoard };
}

// responsible for displaying the game state to the user
function ScreenController() {
  const game = GameController();
  const gameBoard = document.querySelector(".game-board");

  const update = () => {
    const board = game.getBoard();
    gameBoard.textContent = "";
    board.forEach((row) =>
      row.forEach((cell, index) => {
        const newCell = document.createElement("button");
        newCell.classList.add("cell");
        console.log(cell.getToken());
        newCell.textContent = cell.getToken();
        gameBoard.appendChild(newCell);
      })
    );
  };
  update();
  game.playRound(0);
  update();
  game.playRound(0);
  update();
  game.playRound(0);
}
ScreenController();
