import styles from '../../App.scss';
import React, {Component} from 'react';
import Firebase from 'firebase';
import Cell from '../../Utility/Cell';
import Grid from '../Grid/Grid';
import GameType from '../GameType/GameType';
import Text from '../Text/Text';
import generateSets from '../../Utility/SetGenerator';

class Game extends Component {
  constructor(props) {
    super(props);
    this.turnMessage = "'s turn";
    this.winningMessage = " won!";
    this.turn = undefined;
    this.winner = false;
    this.player = undefined;
    this.gameStatus = `${this.turn}${this.turnMessage}`;
    this.gameType = undefined;

    this.GameTypes = {
      OnlineGuest: {takeTurn: this.onlineTakeTurn.bind(this), turnSwitch: this.onlineTurnSwitch.bind(this)},
      OnlineHost: {takeTurn: this.onlineTakeTurn.bind(this), turnSwitch: this.onlineTurnSwitch.bind(this)},
      LocalHost: {takeTurn: this.takeTurn.bind(this), turnSwitch: this.turnSwitch.bind(this)}
    };
    this.firebase = new Firebase("https://glowing-fire-9042.firebaseio.com/");


    this.state = {};
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.state.grid = grid;
    this.state.showSessionInput = false;
    this.state.session = undefined;

    this.setGameType = this.setGameType.bind(this);
    this.attemptTurn = this.attemptTurn.bind(this);
    this.setSessionRef = this.setSessionRef.bind(this);
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
        <GameType types={['OnlineHost','OnlineGuest','LocalHost']} setGameType={this.setGameType}/>
        <h2>{this.state.session}</h2>
        <h2 className={this.turn ? '' : 'hidden'}>{this.gameStatus}</h2>
        <div  className={this.state.showSessionInput ? '' : 'hidden'}>
          <Text submitHandler={this.setSessionRef}/>
        </div>
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
    if ( this.turn
      && (this.player === this.turn || this.gameType === 'LocalHost')
      && !this.winner
      && !cell.mark) {
      this.GameTypes[this.gameType].takeTurn(row, column);
    }
  }

  setGameType(gameType) {
    if(this.gameType) {
      return;
    }
    this.gameType = gameType;
    if (gameType === 'OnlineHost') {
      this.player = 'X';
      this.firebase.child('sessions').push({})
        .then((firebaseRef) => {
        this.firebase = firebaseRef;
        this.setState({session: this.firebase.key()});
        this.setupFirebase();
      });
    } else if( gameType === 'OnlineGuest') {
      this.setState({showSessionInput: true});
    }
  }

  setSessionRef(key) {
    this.player = 'O';
    this.setState({session: key});
    this.firebase = this.firebase.child('sessions').child(key);
    this.setupFirebase();
    this.onlineTurnSwitch(Math.random() > 0.5 ? 'X' : 'O');
  }

  setupFirebase() {
    this.firebase.child('move').on('value', (snapshot) => {
      const move = snapshot.val();
      if (move) {
        this.takeTurn(move.row, move.column);
      }
    });

    this.firebase.child('turn').on('value', (snapshot) => {
      const turn = snapshot.val();
      if (turn) {
        this.turnSwitch(turn);
      }
    });
  }
}

Game.propTypes = {
  size: React.PropTypes.number.isRequired
};

export default Game