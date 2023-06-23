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
    if (availableRows.length === 0) return true;
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
    { name: "Player One", token: "X" },
    { name: "Player Two", token: "O" },
  ];
  //const currentPlayer
  let currentPlayer = players[0];

  const board = GameBoard();

  const switchCurrentPlayer = () =>
    (currentPlayer =
      currentPlayer.name == players[0].name ? players[1] : players[0]);
  //playRound

  const playRound = (column) => {
    const invalidColumn = board.dropToken(column, currentPlayer);
    if (invalidColumn) return;
    switchCurrentPlayer();
  };

  const getCurrentPlayer = () => currentPlayer;

  return {
    playRound,
    getCurrentPlayer,
    printBoard: board.printBoard,
    getBoard: board.getBoard,
  };
}

// responsible for displaying the game state to the user
function ScreenController() {
  const game = GameController();
  const gameBoard = document.querySelector(".game-board");

  const update = () => {
    const currentPlayerDisplay = document.querySelector(".current-player");
    const currentPlayer = game.getCurrentPlayer();

    currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`;

    const board = game.getBoard();

    gameBoard.textContent = "";
    board.forEach((row) =>
      row.forEach((cell, index) => {
        const newCell = document.createElement("button");
        const newCircle = document.createElement("div");
        newCell.appendChild(newCircle);
        newCell.classList.add("cell");
        newCell.dataset.column = index;
        console.log(cell.getToken());
        if (cell.getToken() == "X") newCell.classList.add("p1");
        if (cell.getToken() == "O") newCell.classList.add("p2");
        newCell.addEventListener("mouseover", cellHoverHandler);
        newCell.addEventListener("click", clickHandlerCell);
        gameBoard.appendChild(newCell);
      })
    );
  };

  function cellHoverHandler(e) {
    const colNum = e.currentTarget.dataset.column;
    Array.from(
      document.querySelectorAll(`.cell[data-column="${colNum}"`)
    ).forEach((cell) => (cell.style.backgroundColor = "red"));
  }

  function clickHandlerCell(e) {
    const column = e.currentTarget.dataset.column; //|| e.target.parentNode.dataset.column;
    if (!column) return;
    game.playRound(column);
    update();
  }

  update();
}
ScreenController();
