import styles from './Game.scss';
import React, {Component} from 'react';
import Firebase from 'firebase';
import Cell from '../../Utility/Cell';
import Grid from '../Grid/Grid';
import GameType from '../GameType/GameType';
import SessionForm from '../SessionForm/SessionForm';
import ComponentUtility from '../../Utility/Component';
import generateSets from '../../Utility/SetGenerator'


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
      'onlineRestart',
      'onlineQuit',
      'attemptTurn',
      'takeTurn',
      'turnSwitch',
      'restart',
      'quit',
      'setGameType',
      'joinSession'
    ]);
  }

  initializeMembers() {
    this.turnMessage = "'s turn";
    this.winningMessage = " won!";
    this.firebase = new Firebase("https://glowing-fire-9042.firebaseio.com/");
    this.firebaseSession = null;
    this.GameTypes = {
      'OnlineHost': 'Online Host',
      'OnlineGuest': 'Online Guest',
      'LocalGame': 'Local Game'
    };
    this.GameTypeHandlers = {
      [ this.GameTypes.OnlineHost ]: {
        takeTurn: this.onlineTakeTurn,
        turnSwitch: this.onlineTurnSwitch,
        restart: this.onlineRestart,
        quit: this.onlineQuit
      },
      [ this.GameTypes.OnlineGuest ]: {
        takeTurn: this.onlineTakeTurn,
        turnSwitch: this.onlineTurnSwitch,
        quit: this.onlineQuit
      },
      [ this.GameTypes.LocalGame ]: {
        takeTurn: this.takeTurn,
        turnSwitch: this.turnSwitch,
        restart: this.restart,
        quit: this.quit
      }
    };
  }

  initializeState() {
    this.state = {};
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.state.grid = grid;
    this.state.turn = undefined;
    this.state.finished = false;
    this.state.player = undefined;
    this.state.movesTaken = 0;
    this.state.showJoinSessionForm = false;
    this.state.session = undefined;
    this.state.gameType = '';
    this.state.gameStatus = 'Please select a game mode!';

  }

  restartState() {
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.setState({
      grid: grid,
      movesTaken: 0,
      finished: false
    });
  }

  quitState() {
    let grid = this.initializeGrid(this.props.size);
    generateSets(grid, this.props.size);
    this.setState({
      finished: false,
      player: undefined,
      movesTaken: 0,
      grid: grid,
      showJoinSessionForm: false,
      session: undefined,
      gameType: '',
      gameStatus: 'Please select a game mode!'
    });
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
    const gameTypes = [this.GameTypes.OnlineHost, this.GameTypes.OnlineGuest, this.GameTypes.LocalGame];
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
            <div className={this.show(this.state.player)}>
              <span>Player:</span><span>{this.state.player}</span>
            </div>
            <div className={this.show(this.state.gameStatus)}>
              <span>Game Status:</span><span>{this.state.gameStatus}</span>
            </div>
          </div>
          <Grid grid={this.state.grid} attemptTurn={this.attemptTurn}/>
          {this.renderButtons()}
          <h1 className={styles.attributionFooter}>
            Made with
            <a href="https://facebook.github.io/react/" target="_blank">
              <div className={styles.reactIcon}></div>
            </a>
            and
            <a href="https://www.firebase.com/" target="_blank">
              <div className={styles.firebaseIcon}></div>
            </a>
            !
          </h1>
        </div>
      </div>
    );
  }

  renderButtons() {
    if (!this.state.gameType) {
      return;
    }
    return (<div className={`${styles.buttonList}`}>
        <button
          className={`${this.show(this.gameTypeHasHandler('restart') && this.state.finished)}`}
          onClick={this.GameTypeHandlers[this.state.gameType]['restart']}
        >
          Restart
        </button>
        <button
          className={`${this.show(this.gameTypeHasHandler('quit') && (this.state.gameStatus.indexOf('turn') !== -1) || this.state.finished)}`}
          onClick={this.GameTypeHandlers[this.state.gameType]['quit']}
        >
          Quit
        </button>
      </div>
    );
  }

  show(condition) {
    return condition ? '' : styles.hideElement;
  }

  attemptTurn(row, column) {
    const cell = this.state.grid[row][column];
    if (this.state.turn
      && (this.state.player === this.state.turn || this.state.gameType === this.GameTypes.LocalGame)
      && !this.state.finished
      && !cell.mark) {
      this.GameTypeHandlers[this.state.gameType].takeTurn(row, column);
    }
  }

  takeTurn(row, column) {
    const movesTaken = this.state.movesTaken + 1;
    const cell = this.state.grid[row][column];
    const winner = cell.notify(this.state.turn);
    let {grid} = this.state;
    this.setState({grid, movesTaken}, (state, props) => {
      if (winner) {
        let gameStatus = `${this.state.turn}${this.winningMessage}`;
        this.setState({gameStatus, finished: true});
      } else if (this.state.movesTaken === 9) {
        let gameStatus = `It's a Draw!`;
        this.setState({gameStatus, finished: true});
      } else {
        this.GameTypeHandlers[this.state.gameType].turnSwitch(this.state.turn === "X" ? "O" : "X");
      }
    });
  }

  turnSwitch(turn) {
    let gameStatus = `${turn}${this.turnMessage}`;
    this.setState({gameStatus, turn});
  }

  restart() {
    this.restartState();
    if (!this.state.session) {
      this.turnSwitch(Math.random() > 0.5 ? 'X' : 'O');
    }
  }

  quit() {
    this.quitState();
  }


  onlineTakeTurn(row, column) {
    this.firebaseSession.child('move').set({row, column});
  }

  onlineTurnSwitch(turn) {
    this.firebaseSession.child('turn').set(turn);
  }

  onlineRestart() {
    this.firebaseSession.update({status: 'Restart', turn: null}, (error) => {
      this.firebaseSession.update({status: 'Restarted'}, (error) => {
        this.onlineTurnSwitch(Math.random() > 0.5 ? 'X' : 'O');
      });
    });
  }

  onlineQuit() {
    let session = this.state.session;
    this.firebaseSession.child('status').set('Quit', (error)=> {
      this.firebase.child('sessions').child(session).remove();
    });
  }

  setGameType(gameType) {
    if (this.state.gameType && !this.state.showJoinSessionForm) {
      return;
    }
    this.setState({gameType, showJoinSessionForm: false}, (state, props) => {
      if (gameType === this.GameTypes.OnlineHost) {
        this.hostSession();
      } else if (gameType === this.GameTypes.OnlineGuest) {
        this.setState({showJoinSessionForm: true});
      } else {
        this.turnSwitch(Math.random() > 0.5 ? 'X' : 'O');
      }
    });

  }

  hostSession() {
    this.firebase.child('sessions').push({status: 'Yayy!'})
      .then((firebaseRef) => {
        this.firebaseSession = firebaseRef;
        this.setState({
          player: 'X',
          session: this.firebaseSession.key(),
          gameStatus: 'Waiting for player to join game!'
        });
        this.setupFirebaseHandlers();
      });
  }

  joinSession(key) {
    this.firebase.child('sessions').child(key).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.setState({session: key, showJoinSessionForm: false, player: 'O'});
        this.firebaseSession = this.firebase.child('sessions').child(key);
        this.setupFirebaseHandlers();
        this.onlineTurnSwitch(Math.random() > 0.5 ? 'X' : 'O');
      } else {
        alert(`Session ${key} does not exist!`);
      }
    });

  }

  setupFirebaseHandlers() {
    this.firebaseSession.child('move').on('value', (snapshot) => {
      const move = snapshot.val();
      if (move) {
        this.takeTurn(move.row, move.column);
      }
    });

    this.firebaseSession.child('turn').on('value', (snapshot) => {
      const turn = snapshot.val();
      if (turn) {
        this.turnSwitch(turn);
      }
    });

    this.firebaseSession.child('status').on('value', (snapshot) => {
      const status = snapshot.val();
      if (status) {
        switch (status) {
          case('Quit'):
            this.quit();
            break;
          case('Restart'):
            this.restart();
            break;
        }
      }
    });

    window.onbeforeunload = (e) => {
      console.log('Here!');
      this.firebase.child('sessions').child(this.state.session).remove();
    };
  }

  gameTypeHasHandler(key) {
    return this.GameTypeHandlers[this.state.gameType][key];
  }
}

Game.propTypes = {
  size: React.PropTypes.number.isRequired
};

export default Game