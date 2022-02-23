import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//     // output comes as this.props.{key}
//     // we extend the constructor
//   //   constructor(props) {
//   //     // https://overreacted.io/why-do-we-write-super-props/
//   //     // i guess its our way of "extending" React.Component's constructor
//   //     super(props)
//   //     this.state = {
//   //       value: null,
//   //   }
//   // }

//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// reminder: everything that accesses a class's state is pretty much dynamic (will re-render on updates)
class Board extends React.Component {

  renderSquare(i) {
    // we can give attributes such as className, onClick here, and they will come out on Square`s props
    // btw! we use {() => function} when we wanna input a function because we wanna input IT, and not CALL it
    // also if you dont use arrow functions it just doesnt work apparently. i guess its specific to React.Component
    return <Square value={this.props.squares[i]} onClick={() => this.props.handleClick(i)}/>;
  }

  render() {


    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xIsNext: true,
      history: [{
        squares: Array(9).fill(null),
        updated: null
      }],
      stepNumber: 0
    }
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2 === 0) ? true : false
    })
  }
  

  handleClick(i) {
    var history = this.state.history
    console.log(history)
    const squares = history[this.state.stepNumber].squares.slice()

    // if winner or if current square isnt null (has been clicked already)
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    if (this.state.stepNumber !== history.length) {
      history = history.slice(0, this.state.stepNumber + 1)
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    // this isnt a problem because dict keys are like strings but without quotes, meanwhile values are actual variables
    // directly linked to this.state
    this.setState({
      history: history.concat([{squares: squares, updated: i}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1
    })
    // we could do this but its convenient to have immutable data (https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important)
    // this.state.xIsNext = !this.state.xIsNext
    // this wouldnt work because we're not accessing this.state
    // this.xIsNext = !this.xIsNext
  }

    // anything that should update its display on any event should go into render
    render() {
    const history = this.state.history
    const currentSquares = history[this.state.stepNumber].squares
    const winner = calculateWinner(currentSquares)
    let status
    if (winner) {
      status = 'Winner: ' + winner
    }
    else {      
      // this will update dynamically
      console.log(this.state.xIsNext)
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
      console.log(status)
      }


    const moves = history.map((_, move) => {
      const movePos = history[move].updated
      // possible because 0 = bool(false)
      const desc = move ? `go to move ${move} (${(movePos % 3) + 1}, ${Math.ceil((movePos + 1) / 3)})` : 'go to start' 
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={currentSquares} xIsNext={this.state.xIsNext} status={status} handleClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* react automatically renders arrays */}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// stuff thats still kinda hard for me to understand:
//
// when to pass props like this: {(i) => function(i)}, {() => function(i)}, {function}
// i guess 1st one passes a function that accepts input. 2nd passes the function with specific input given. 3 is the actual function
// also: binding - https://reactjs.org/docs/handling-events.html
//
// when to up state 