class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(height, width) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.currPlayer = null;
    this.board = [];
    this.gameOver = false;
    this.startButton = document.getElementById('start-button');
    this.gameOverDisplay = document.getElementById('game-over');
    this.player1ColorInput = document.getElementById('player1-color');
    this.player2ColorInput = document.getElementById('player2-color');

    this.startButton.addEventListener('click', this.start.bind(this));
  }

  setupPlayers(player1Color, player2Color) {
    this.player1 = new Player(player1Color);
    this.player2 = new Player(player2Color);
    this.currPlayer = this.player1;
  }

  makeBoard() {
    this.board = Array.from({ length: this.HEIGHT }, () => Array.from({ length: this.WIDTH }));
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameOver = true;
    this.gameOverDisplay.textContent = msg;
  }

  checkForWin() {
    function _win(cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win.call(this, horiz) || _win.call(this, vert) || _win.call(this, diagDR) || _win.call(this, diagDL)) {
          return true;
        }
      }
    }

    return false; // No win found
  }

  handleClick(evt) {
    if (this.gameOver) {
      return;
    }

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);

    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      this.endGame(`Player ${this.currPlayer === this.player1 ? '1' : '2'} won!`);
      this.gameOver = true;
      return;
    }

    if (this.board.every(row => row.every(cell => cell))) {
      this.endGame('Tie!');
      this.gameOver = true;
      return;
    }

    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  start() {
    const player1Color = this.player1ColorInput.value;
    const player2Color = this.player2ColorInput.value;

    if (!player1Color || !player2Color) {
      alert('Please select colors for both players.');
      return;
    }

    this.setupPlayers(player1Color, player2Color);
    this.makeBoard();
    this.makeHtmlBoard();

    this.gameOver = false;
    this.gameOverDisplay.textContent = '';
  }
}

const game = new Game(6, 7);
