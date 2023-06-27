function Cell() {
  let value = null;
  const addToken = (playerToken) => (value = playerToken);
  const getToken = () => value;
  return { addToken, getToken };
}

function GameBoard() {
  const board = [];

  const initialize = () => {
    for (let i = 0; i < 6; i++) {
      board[i] = [];
      for (let j = 0; j < 7; j++) {
        board[i][j] = Cell();
      }
    }
  };

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

  return { getBoard, dropToken, printBoard, initialize };
}

function WinChecker(board) {
  let tokenBoard;

  const fourInARow = (row, token) => {
    return tokenBoard[row].join("").includes(token.repeat(4));
  };

  const fourInAColumn = (column, token) => {
    return tokenBoard
      .map((row) => row[column])
      .join("")
      .includes(token.repeat(4));
  };

  const fourInADiagonal = (column, row, token) => {
    tokenBoard = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getToken()));
    const upDiagonal = [tokenBoard[row][column]];

    let c = column;
    let r = row;
    c--;
    r++;
    while (c >= 0 && r <= 5) {
      upDiagonal.unshift(tokenBoard[r][c]);
      c--;
      r++;
    }

    c = column;
    r = row;
    c++;
    r--;
    while (c <= 6 && r >= 0) {
      upDiagonal.push(tokenBoard[r][c]);
      c++;
      r--;
    }

    const downDiagonal = [tokenBoard[row][column]];

    c = column;
    r = row;
    c++;
    r++;
    while (c <= 6 && r <= 5) {
      downDiagonal.push(tokenBoard[r][c]);
      c++;
      r++;
    }

    c = column;
    r = row;
    c--;
    r--;
    while (c >= 0 && r >= 0) {
      downDiagonal.unshift(tokenBoard[r][c]);
      c--;
      r--;
    }

    console.log(upDiagonal);
    console.log(downDiagonal);

    return (
      upDiagonal.join("").includes(token.repeat(4)) ||
      downDiagonal.join("").includes(token.repeat(4))
    );
  };

  const isWin = (column, token) => {
    tokenBoard = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getToken()));

    const row = tokenBoard.map((row) => row[column]).lastIndexOf(null) + 1;

    winner =
      fourInAColumn(column, token) ||
      fourInARow(row, token) ||
      fourInADiagonal(column, row, token);
    console.log(winner);
    return winner;
  };

  return {
    isWin,
    fourInADiagonal,
  };
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
  board.initialize();

  const winChecker = WinChecker(board);

  let winner = null;

  const switchCurrentPlayer = () =>
    (currentPlayer =
      currentPlayer.name == players[0].name ? players[1] : players[0]);
  //playRound

  const playRound = (column) => {
    const invalidColumn = board.dropToken(column, currentPlayer);
    if (invalidColumn) return;
    if (winChecker.isWin(column, currentPlayer.token)) {
      console.log(`${currentPlayer.name} has won!`);
      winner = currentPlayer;
    } else switchCurrentPlayer();
  };

  const isWin = () => winner;

  function reset() {
    currentPlayer = players[0];
    winner = null;
    board.initialize();
  }

  const getCurrentPlayer = () => currentPlayer;

  return {
    playRound,
    getCurrentPlayer,
    getBoard: board.getBoard,
    initialize: board.initialize,
    isWin,
    reset,
  };
}

// responsible for displaying the game state to the user
function ScreenController() {
  const game = GameController();
  const gameBoard = document.querySelector(".game-board");
  const winOverlay = document.querySelector(".win-overlay");
  const winMessage = document.querySelector(".win-message");
  const restartButton = document.querySelector(".restart");
  restartButton.addEventListener("click", clickHandlerOverlay);

  const update = (winTriggered) => {
    const currentPlayerDisplay = document.querySelector(".current-player");
    const currentPlayer = game.getCurrentPlayer();

    currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`;

    const board = game.getBoard();

    if (winTriggered && game.isWin()) {
      winOverlay.classList.remove("invisible");
      winOverlay.classList.add("visible");
      winMessage.textContent = `${game.isWin().name} won!`;
    }

    gameBoard.textContent = "";
    board.forEach((row) =>
      row.forEach((cell, index) => {
        const newCell = document.createElement("button");
        const newCircle = document.createElement("div");
        newCell.appendChild(newCircle);
        newCell.classList.add("cell");
        newCell.dataset.column = index;
        if (cell.getToken() == "X") newCell.classList.add("p1");
        if (cell.getToken() == "O") newCell.classList.add("p2");
        newCell.addEventListener("mouseenter", cellEnterHandler);
        newCell.addEventListener("click", clickHandlerCell);
        gameBoard.appendChild(newCell);
      })
    );
  };

  function cellEnterHandler(e) {
    const colNum = e.currentTarget.dataset.column;

    if (e.currentTarget.isEqualNode(e.relatedTarget)) return; // if mouse is entering from over circle element then ignore
    Array.from(
      document.querySelectorAll(`.cell[data-column="${colNum}"]`)
    ).forEach((cell) => cell.classList.add("hover"));
    Array.from(
      document.querySelectorAll(`.cell:not([data-column="${colNum}"])`)
    ).forEach((cell) => cell.classList.remove("hover"));
  }

  function clickHandlerCell(e) {
    const column = e.currentTarget.dataset.column;
    if (!column) return;
    game.playRound(column);
    update(true);
  }

  function clickHandlerOverlay(e) {
    winOverlay.classList.remove("visible");
    winOverlay.classList.add("invisible");

    winMessage.textContent = "";
    game.reset();
    update();
  }

  update();
}
ScreenController();
