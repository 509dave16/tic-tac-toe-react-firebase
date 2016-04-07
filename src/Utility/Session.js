import Firebase from 'firebase';
import ComponentUtility from './Component';

class Session {

  constructor(url, takeTurnCallback, turnSwitchCallback) {
    this.firebase = new Firebase(url);
    this.player = undefined;
    this.turn = undefined;
    this.session = undefined;
    this.takeTurnCallback = takeTurnCallback;
    this.turnSwitchCallback = turnSwitchCallback;
    ComponentUtility.bindHandlers(this, [
      'hostSession'
    ]);
  }

  onlineTakeTurn(row, column) {
    if(this.player === this.turn) {
      this.firebase.child('move').set({row, column});
    }
  }

  onlineTurnSwitch(turn) {
    this.firebase.child('turn').set(turn);
  }

  hostSession() {
    let {firebase} = this;
    let {player} = this;
    let {session} = this;
    this.firebase.child('sessions').push({})
      .then((firebaseRef) => {
        firebase = firebaseRef;
        player = 'X';
        session = firebaseRef.key();
        this.setupFirebaseHandlers();
      });
  }

  joinSession(key) {
    this.player = 'O';
    this.session = key;
    this.firebase = this.firebase.child('sessions').child(key);
    this.setupFirebaseHandlers();
    this.onlineTurnSwitch(Math.random() > 0.5 ? 'X' : 'O');
  }

  setupFirebaseHandlers() {
    this.firebase.child('move').on('value', (snapshot) => {
      const move = snapshot.val();
      if (move) {
        this.takeTurnCallback(move.row, move.column);
      }
    });

    this.firebase.child('turn').on('value', (snapshot) => {
      const turn = snapshot.val();
      if (turn) {
        this.turn = turn;
        this.turnSwitchCallback(turn);
      }
    });
  }
}

export default Session;