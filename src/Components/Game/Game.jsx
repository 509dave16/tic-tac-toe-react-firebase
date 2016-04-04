import React, {Component} from 'react';
import Firebase from 'firebase';
import Cell from '../../Utility/Cell';
import Grid from '../Grid/Grid';
import generateSets from '../../Utility/SetGenerator';

class Game extends Component {
  constructor(props) {
    super(props);
    this.turnMessage = "'s turn";
    this.winningMessage = " won!";
    this.turn = "X";
    this.winner = false;
    this.player = "X";
    this.gameStatus = `${this.turn}${this.turnMessage}`;
    this.gameType = 'LocalHost';
    this.firebase = new Firebase("https://glowing-fire-9042.firebaseio.com/");

    this.GameTypes = {
      OnlineGuest: {takeTurn: this.onlineTakeTurn.bind(this), turnSwitch: this.onlineTurnSwitch.bind(this)},
      OnlineHost: {takeTurn: this.onlineTakeTurn.bind(this), turnSwitch: this.onlineTurnSwitch.bind(this)},
      LocalHost: {takeTurn: this.takeTurn.bind(this), turnSwitch: this.turnSwitch.bind(this)}
    };
    // this.firebase.child('move').on('value', (snapshot) => {
    //   const move = snapshot.val();
    //   this.takeTurn(move.row, move.column);
    // });
    //
    // this.firebase.child('turn').on('value', (snapshot) => {
    //   const turn = snapshot.val();
    //   this.turnSwitch(turn);
    // });

    this.state = {};
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.state.grid = grid;

    //this.takeTurn = this.takeTurn.bind(this);
    this.attemptTurn = this.attemptTurn.bind(this);
  }

  initializeGrid(size) {
    const grid = [];
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row = [];
      for (let columnIndex = 0; columnIndex < size; columnIndex++) {
        row[columnIndex] = new Cell();
      }
      grid[rowIndex] = row;
    }
    return grid;
  }

  render() {
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <h2>{this.gameStatus}</h2>
        <Grid grid={this.state.grid} attemptTurn={this.attemptTurn}/>
      </div>
    );
  }

  takeTurn(row, column) {
    const cell = this.state.grid[row][column];
    this.winner = cell.notify(this.turn);
    let {grid} = this.state;
    this.setState({grid});
    if (!this.winner) {
      this.GameTypes[this.gameType].turnSwitch(this.turn === "X" ? "O" : "X");
    } else {
      this.gameStatus = `${this.turn}${this.winningMessage}`;
    }
  }

  turnSwitch(turn) {
    this.turn = turn;
    this.gameStatus = `${this.turn}${this.turnMessage}`;
  }

  onlineTakeTurn(row, column) {
    this.firebase.child('move').set({row, column});
  }

  onlineTurnSwitch(turn) {
    this.firebase.child('turn').set(turn);
  }

  attemptTurn(row, column) {
    const cell = this.state.grid[row][column];
    if ((this.player === this.turn || this.gameType === 'LocalHost')
      && !this.winner && !cell.mark) {
      this.GameTypes[this.gameType].takeTurn(row, column);
    }
  }
}

Game.propTypes = {
  size: React.PropTypes.number.isRequired
};

export default Game