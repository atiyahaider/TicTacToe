function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const WinningMoves = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6]];

const Computer = 'X';
const Opponent = 'O';

const Selection = ({ selectGame }) => {

  const handleGameType = e => {
    $('button').removeClass('selected');
    $('#' + e.target.getAttribute('id')).addClass('selected');
    selectGame(e.target.value);
  };

  return (
    React.createElement("div", { id: "header" },
    React.createElement("p", { style: { textAlign: 'left' } }, React.createElement("strong", null, "Select a Game...")),
    React.createElement("div", { id: "selection" },
    React.createElement("button", { id: "onePlayer", value: "1", onClick: handleGameType }, "One Player"),
    React.createElement("button", { id: "twoPlayer", value: "2", onClick: handleGameType }, "Two Players"))));
};

const Score = ({ gameType, scoreX, scoreO }) => {
  return (
    React.createElement("div", { id: "score" },
    React.createElement("div", { id: "playerX" },
    gameType === '1' ? 'Computer: ' : 'Player X: ', scoreX),

    React.createElement("div", { id: "playerO" }, "Player O: ",
    scoreO)));
};

const Square = ({ id, value, markSquare }) => {

  const handleClick = e => {
    markSquare(e.target.getAttribute("id"));
  };

  let svg = '';
  if (value === 'X') {
    svg = React.createElement("svg", { className: "icon", viewBox: "0 0 10 10" },
    React.createElement("path", { id: "xone", d: "M2,2 Q5,3.5 8,8.25" }),
    React.createElement("path", { id: "xtwo", d: "M8,2 Q5,3 2,8" }));

  } else
  if (value === 'O') {
    svg = React.createElement("svg", { className: "icon", viewBox: "0 0 10 10" },
    React.createElement("path", { id: "circle", d: "M 5,2 C 1.5,2 1.25,8.75 5,8.5 C 9,8.5 8.5,2 5,2" }));
  }

  return (
    React.createElement("div", { className: "square", id: id, onClick: handleClick },
    svg));
};

const Turn = ({ status, gameOver, reset, gameType }) => {
  if (status.status !== '') {
    $('#turn').css('padding', '10px 20px');
    $('#turn').css('color', status.color);
    $('#turn p').css('opacity', '0');
    $('#turn p').animate({ 'opacity': '1' }, 500);
    if (gameOver) {
      let scale = 1;
      let interval = setInterval(() => {
        scale = scale == 1 ? 1.5 : 1;
        $('#turn').css('transform', 'scale(' + scale + ')');}, 1000);
      setTimeout(() => clearInterval(interval), 2050);
    }
  } else

  $('#turn').css('padding', '0px');

  return (
    React.createElement("div", { id: "bottom" },
    React.createElement("div", { id: "turn" },
    React.createElement("p", null, React.createElement("strong", null, status.status))),

    gameType &&
    React.createElement("button", { id: "reset", onClick: reset, display: "none" }, gameOver ? 'Replay' : 'Reset')));
};

const Footer = () => {
  return (
    React.createElement("div", { id: "footer" },
    React.createElement("p", null, "Designed and coded by"),
    React.createElement("a", { target: "_blank", href: "https://s.codepen.io/atiyahaider/debug/oaZxeb/dGrXWdOKgPWM" }, "Atiya Haider")));
};

class Board extends React.Component {
  constructor(props) {
    super(props);_defineProperty(this, "selectGame",
    type => {
      this.resetGame(type);
    });_defineProperty(this, "markSquare",

    i => {
      //if spot is not taken then mark it
      if (this.state.boardArray[i] === '') {
        let player = this.state.turnX ? 'X' : 'O';
        this.markSpot(i, player);

        //if one player game, and next move is computer's, get best spot for the computer
        //and display after a few milliseconds
        if (this.state.gameType === '1' && player === Opponent && !this.state.gameOver) {
          setTimeout(() => {this.markSpot(getBestMove(this.state.boardArray, Computer), Computer);}, 600);
        }
      }
    });_defineProperty(this, "markSpot",

    async (i, player) => {
      let { boardArray } = this.state;
      boardArray.splice(i, 1, player);
      await this.setState({ boardArray: [...boardArray],
        turnX: !this.state.turnX });

      let winningSquares = checkWin(this.state.boardArray, player);
      if (winningSquares) {
        await this.setState({ gameOver: player });
        if (player === Computer)
        await this.setState({ scoreX: this.state.scoreX + 1 });else

        await this.setState({ scoreO: this.state.scoreO + 1 });
        gameOver(winningSquares);
      } else
      if (checkTie(this.state.boardArray)) {
        await this.setState({ gameOver: 'Tie' });
      }
    });_defineProperty(this, "resetGame",

    type => {
      //reset being called without a type parameter (from reset button)
      if (typeof type === 'object')
      type = this.state.gameType;else
      {
        this.setState({
          scoreX: 0,
          scoreO: 0 });
      }

      this.setState(
      {
        gameType: type,
        boardArray: Array(9).fill(''),
        turnX: true,
        gameOver: null },
      () => {
        if (this.state.gameType === '1') //one player game
          this.markSquare(getRandomStartPosition());
      });

      $('.square').css('background-color', 'none');
      $('#board').css('pointer-events', 'auto');
    });this.state = { gameType: null, boardArray: Array(9).fill(''), turnX: true, gameOver: null, scoreX: 0, scoreO: 0 };}

  render() {
    let status = displayStatus(this.state);

    return (
      React.createElement("div", null,
      React.createElement(Selection, { selectGame: this.selectGame }),
      React.createElement("div", { id: "canvas" },
      React.createElement(Score, { gameType: this.state.gameType, scoreX: this.state.scoreX, scoreO: this.state.scoreO }),
      React.createElement("div", { id: "board" },
      this.state.boardArray.map((e, i) => React.createElement(Square, { id: i, value: e, markSquare: this.markSquare })))),

      React.createElement(Turn, { status: status, gameOver: this.state.gameOver, reset: this.resetGame, gameType: this.state.gameType })));
  }}


const TicTacToeGame = () => {
  return (
    React.createElement("div", null,
    React.createElement("h1", null, "TIC TAC TOE"),
    React.createElement(Board, null),
    React.createElement(Footer, null)));
};

ReactDOM.render(React.createElement(TicTacToeGame, null), document.getElementById('tictactoe'));

function getRandomStartPosition() {
  return Math.floor(Math.random() * 9);
}

function checkWin(board, player) {
  for (let i = 0; i < WinningMoves.length; i++) {
    if (WinningMoves[i].every(e => board[e] === player)) {
      return WinningMoves[i];
    }
  }
  //if no wins
  return null;
}

function gameOver(winningSquares) {
  //find the direction of win and set path accordingly
  let winStr = winningSquares.toString();
  let index = WinningMoves.findIndex(e => winStr === e.toString());
  let path;
  switch (index) {
    case 0:
    case 1:
    case 2:
      path = 'M 0,5 L 10,5'; // row
      break;
    case 3:
    case 4:
    case 5:
      path = 'M 5,0 L 5,10'; // col
      break;
    case 6:
      path = 'M 0,0 L 10,10'; // diagonal
      break;
    case 7:
      path = 'M 10,0 L 0,10'; // reverse diagonal
      break;
    default:
      path = '';}


  //cross out winning squares
  winningSquares.map(e => {
    let div = document.getElementById(e);
    let svg = div.getElementsByTagName('svg')[0];
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    svgElement.setAttribute("id", "line");
    svgElement.setAttribute("d", path); //Set path's data
    svg.appendChild(svgElement);
  });

  //disable board
  $('#board').css('pointer-events', 'none');
}

function emptySquares(board) {
  let emptyIndexes = [];
  //find empty squares and return their indexes
  board.filter((e, i) => {
    if (e === '') {
      emptyIndexes.push(i);
      return true;
    }
  }, emptyIndexes);
  return emptyIndexes;
}

function checkTie(board) {
  if (emptySquares(board).length !== 0) //empty squares still exist
    return false;else

  return true;
}

function displayStatus(state) {
  let status;
  switch (state.gameOver) {
    case 'X':
      status = state.gameType === '1' ? { status: 'Sorry, you lose!', color: 'black' } : { status: 'Player ' + state.gameOver + ' wins!', color: 'var(--green)' };
      break;
    case 'O':
      status = { status: 'Player ' + state.gameOver + ' wins!', color: 'var(--red)' };
      break;
    case 'Tie':
      status = { status: 'Tie Game!', color: 'black' };
      break;
    default:
      status = !state.gameType ? { status: '', color: 'black' } : { status: (!state.turnX ? "Player O" : state.gameType === '1' ? "Computer" : "Player X") + "'s turn", color: !state.turnX ? 'var(--red)' : 'var(--green)' };}

  return status;
}

function getBestMove(board, player) {
  return minimax(board, 0, player).spot;
}

function minimax(board, depth, player) {
  //find all empty spots
  let emptySpots = emptySquares(board);

  //check for game over and assign score
  if (checkWin(board, Computer))
  return { score: 10 - depth };else
  if (checkWin(board, Opponent))
  return { score: depth - 10 };else
  if (checkTie(board))
  return { score: 0 };

  //store all possible moves in an array
  var moves = [];
  //loop through all empty spots to find the score of the move
  for (let i = 0; i < emptySpots.length; i++) {
    let move = {};
    board[emptySpots[i]] = player;
    move.spot = emptySpots[i];

    if (player === Computer) {
      let result = minimax(board, depth + 1, Opponent);
      move.score = result.score;
    } else
    {
      let result = minimax(board, depth + 1, Computer);
      move.score = result.score;
    }

    //reset board to what it was before
    board[emptySpots[i]] = '';

    //store the move object
    moves.push(move);
  }

  let bestMove;
  //find the best move in the moves array
  if (player === Computer) {//find the highest score
    let bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else
  {
    let bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  //return the best move;
  return moves[bestMove];
}