import styles from './Game.scss';
import React, {Component} from 'react';
import Firebase from 'firebase';
import Cell from '../../Utility/Cell';
import Grid from '../Grid/Grid';
import GameType from '../GameType/GameType';
import SessionForm from '../SessionForm/SessionForm';
import generateSets from '../../Utility/SetGenerator'
import ComponentUtility from '../../Utility/Component';

class Game extends Component {
  constructor(props) {
    super(props);
    this.setupHandlers();
    this.initializeMembers();
    this.initializeState();
  }

  setupHandlers() {
    ComponentUtility.bindHandlers(this, [
      'onlineTakeTurn',
      'onlineTurnSwitch',
      'attemptTurn',
      'takeTurn',
      'turnSwitch',
      'setGameType',
      'joinSession'
    ]);
  }

  initializeMembers() {
    this.turnMessage = "'s turn";
    this.winningMessage = " won!";
    this.turn = undefined;
    this.winner = false;
    this.player = undefined;
    this.gameType = undefined;
    this.firebase = new Firebase("https://glowing-fire-9042.firebaseio.com/");
    this.GameTypeHandlers = {
      OnlineGuest: {takeTurn: this.onlineTakeTurn, turnSwitch: this.onlineTurnSwitch},
      OnlineHost: {takeTurn: this.onlineTakeTurn, turnSwitch: this.onlineTurnSwitch},
      LocalHost: {takeTurn: this.takeTurn, turnSwitch: this.turnSwitch}
    };
  }

  initializeState() {
    this.state = {};
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.state.grid = grid;
    this.state.showJoinSessionForm = false;
    this.state.session = undefined;
    this.state.gameStatus = 'Please select a game mode!';

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
        <div className={this.state.showJoinSessionForm ? '' : styles.hideElement}>
          <SessionForm submitHandler={this.joinSession}/>
        </div>
        <h2 className={this.state.session ? '' : styles.hideElement}>Session: {this.state.session}</h2>
        <h2 className={this.player ? '' : styles.hideElement}>Player: {this.player}</h2>
        <h2 className={this.state.gameStatus ? '' : styles.hideElement}>Game Status: {this.state.gameStatus}</h2>
        <Grid grid={this.state.grid} attemptTurn={this.attemptTurn}/>
      </div>
    );
  }

  attemptTurn(row, column) {
    const cell = this.state.grid[row][column];
    if (this.turn
      && (this.player === this.turn || this.gameType === 'LocalHost')
      && !this.winner
      && !cell.mark) {
      this.GameTypeHandlers[this.gameType].takeTurn(row, column);
    }
  }

  takeTurn(row, column) {
    const cell = this.state.grid[row][column];
    this.winner = cell.notify(this.turn);
    let {grid} = this.state;
    this.setState({grid});
    if (!this.winner) {
      this.GameTypeHandlers[this.gameType].turnSwitch(this.turn === "X" ? "O" : "X");
    } else {
      let gameStatus = `${this.turn}${this.winningMessage}`;
      this.setState({gameStatus});
    }
  }

  turnSwitch(turn) {
    this.turn = turn;
    let gameStatus = `${this.turn}${this.turnMessage}`;
    this.setState({gameStatus});
  }

  onlineTakeTurn(row, column) {
    this.firebase.child('move').set({row, column});
  }

  onlineTurnSwitch(turn) {
    this.firebase.child('turn').set(turn);
  }

  setGameType(gameType) {
    if (this.gameType) {
      return;
    }
    this.gameType = gameType;
    if (gameType === 'OnlineHost') {
      this.hostSession();
    } else if (gameType === 'OnlineGuest') {
      this.setState({showJoinSessionForm: true});
    } else {
      this.turnSwitch(Math.random() > 0.5 ? 'X' : 'O');
    }
  }

  hostSession() {
    this.player = 'X';
    this.firebase.child('sessions').push({})
      .then((firebaseRef) => {
        this.firebase = firebaseRef;
        this.setState({
          session: this.firebase.key(),
          gameStatus: 'Waiting for player to join game!'
        });
        this.setupFirebaseHandlers();
      });
  }

  joinSession(key) {
    this.player = 'O';
    this.setState({session: key});
    this.setState({showJoinSessionForm: false});
    this.firebase = this.firebase.child('sessions').child(key);
    this.setupFirebaseHandlers();
    this.onlineTurnSwitch(Math.random() > 0.5 ? 'X' : 'O');
  }

  setupFirebaseHandlers() {
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