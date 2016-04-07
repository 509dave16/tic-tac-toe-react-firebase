import React, {Component} from 'react';
import ComponentUtility from '../../Utility/Component';
import styles from './Session.scss';

class Session extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.utility);
  }

  setupHandlers() {
    ComponentUtility.bindHandlers(this, [
      'onClick'
    ]);
  }

  onClick(e) {
    e.preventDefault();
    this.props.setShowForm(false);
    this.props.utility.joinSession(this.refs.session.value);
    //console.log(this.props.utility);

  }

  render() {
    return (
      <div>
        <div className={this.show(this.props.showForm)}>
          <form className={`${styles.sessionForm}`}>
            <input ref='session' type="text"/>
            <button className={`${styles.unselected}`} onClick={this.onClick}>Join Session</button>
          </form>
        </div>
        <div className={`${styles.statusList}`}>
          <div className={this.show(this.props.utility.session)}>
            <span>Session:</span><span>{this.props.utility.session}</span>
          </div>
          <div className={this.show(this.props.utility.player)}>
            <span>Player:</span><span>{this.props.utility.player}</span>
          </div>
        </div>
      </div>
    );
  }

  show(condition) {
    return condition ? '' : styles.hideElement;
  }
}

Session.propTypes = {
  utility: React.PropTypes.object.isRequired,
  showForm: React.PropTypes.bool.isRequired,
  setShowForm: React.PropTypes.func.isRequired
};

export default Session;