import styles from './Game.scss';
import colors from './../../Colors.scss';
import React, {Component} from 'react';
import Firebase from 'firebase';
import Cell from '../../Utility/Cell';
import Grid from '../Grid/Grid';
import GameType from '../GameType/GameType';
import SessionForm from '../SessionForm/SessionForm';
import generateSets from '../../Utility/SetGenerator'
import ComponentUtility from '../../Utility/Component';
import SessionUtility from './../../Utility/Session';

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
      'joinSession',
      'setShowJoinSessionForm'
    ]);
  }

  initializeMembers() {
    this.turnMessage = "'s turn";
    this.winningMessage = " won!";
    this.turn = undefined;
    this.winner = false;
    this.player = undefined;
    this.movesTaken = 0;
    let url = "https://glowing-fire-9042.firebaseio.com/";
    this.firebase = new Firebase(url);
    //this.sessionUtility = new SessionUtility(url, this.takeTurn, this.turnSwitch);
    this.GameTypes = {
      'OnlineHost': 'Online Host',
      'OnlineGuest': 'Online Guest',
      'LocalGame': 'Local Game'
    };
    this.GameTypeHandlers = {
      [ this.GameTypes.OnlineHost ] : {takeTurn: this.onlineTakeTurn, turnSwitch: this.onlineTurnSwitch},
      [ this.GameTypes.OnlineGuest ]: {takeTurn: this.onlineTakeTurn, turnSwitch: this.onlineTurnSwitch},
      [ this.GameTypes.LocalGame ]: {takeTurn: this.takeTurn, turnSwitch: this.turnSwitch}
    };

    // let onlineHandlers = {takeTurn: this.sessionUtility.onlineTakeTurn, turnSwitch: this.sessionUtility.onlineTurnSwitch};
    // this.GameTypeHandlers = {
    //   [ this.GameTypes.OnlineHost ] : onlineHandlers,
    //   [ this.GameTypes.OnlineGuest ]: onlineHandlers,
    //   [ this.GameTypes.LocalGame ]: {takeTurn: this.takeTurn, turnSwitch: this.turnSwitch}
    // };
  }

  initializeState() {
    this.state = {};
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.state.grid = grid;
    this.state.showJoinSessionForm = false;
    this.state.session = undefined;
    this.state.gameType = '';
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

  setShowJoinSessionForm(condition) {
    this.setState({showJoinSessionForm: condition});
  }

  render() {
    const gameTypes = [this.GameTypes.OnlineHost,this.GameTypes.OnlineGuest,this.GameTypes.LocalGame];

    //<Session utility={this.sessionUtliity} showForm={this.state.showJoinSessionForm} setShowForm={setShowJoinSessionForm} />
    return (
      <div className={`${styles.rowCentered}`}>
        <div className={`${styles.container} ${styles.columnCentered}`}>
          <h1 className={`${styles.mainHeader}`}>Tic Tac Toe</h1>
          <GameType selected={this.state.gameType} types={gameTypes} setGameType={this.setGameType}/>
          <div className={this.state.showJoinSessionForm ? '' : styles.hideElement}>
            <SessionForm submitHandler={this.joinSession}/>
          </div>
          <div className={`${styles.statusList}`}>
            <div className={this.show(this.state.session)}>
              <span>Session:</span><span>{this.state.session}</span>
            </div>
            <div className={this.show(this.player)}>
              <span>Player:</span><span>{this.player}</span>
            </div>
            <div className={this.show(this.state.gameStatus)}>
              <span>Game Status:</span><span>{this.state.gameStatus}</span>
            </div>
          </div>
          <Grid grid={this.state.grid} attemptTurn={this.attemptTurn}/>
          <br></br>
          <h1 className={styles.attributionFooter}>
            Made with<span className={styles.reactIcon}></span>and<span className={styles.firebaseIcon}></span>!
          </h1>
        </div>
      </div>
    );
  }

  show(condition) {
    return condition ? '' : styles.hideElement;
  }

  attemptTurn(row, column) {
    const cell = this.state.grid[row][column];
    if (this.turn
      && (this.player === this.turn || this.state.gameType === this.GameTypes.LocalGame)
      && !this.winner
      && !cell.mark) {
      this.GameTypeHandlers[this.state.gameType].takeTurn(row, column);
    }
  }

  takeTurn(row, column) {
    this.movesTaken++;
    const cell = this.state.grid[row][column];
    this.winner = cell.notify(this.turn);
    let {grid} = this.state;
    this.setState({grid});
    if (this.winner) {
      let gameStatus = `${this.turn}${this.winningMessage}`;
      this.setState({gameStatus});
    } else if(this.movesTaken === 9) {
      let gameStatus = `It's a Draw!`;
      this.setState({gameStatus});
    } else {
      this.GameTypeHandlers[this.state.gameType].turnSwitch(this.turn === "X" ? "O" : "X");
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
    if (this.state.gameType) {
      return;
    }
    this.setState({gameType}, (state, props) => {
      if (gameType === this.GameTypes.OnlineHost) {
        this.hostSession();
      } else if (gameType === this.GameTypes.OnlineGuest) {
        this.setShowJoinSessionForm(true);
      } else {
        this.turnSwitch(Math.random() > 0.5 ? 'X' : 'O');
      }
    });

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