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

  const dropToken = (column) => {
    const availableRows = board.filter(
      (row) => row[column].getToken() === null
    );
    if (availableRows.length === 0) return;
    board[availableRows.length - 1][column].addToken("1");
  };

  const printBoard = () => {
    //helper function for printing the board
    board.forEach((row) => {
      console.log(row.map((cell) => cell.getToken()));
    });
  };
}

GameBoard();