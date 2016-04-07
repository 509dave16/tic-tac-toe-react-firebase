import React, {Component} from 'react';
import styles from './SessionForm.scss';

class SessionForm extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.submitHandler(this.refs.session.value);
  }

  render() {
    return (
      <form className={`${styles.sessionForm}`}>
        <input ref='session' type="text"/>
        <button className={`${styles.unselected}`} onClick={this.onClick}>Join Session</button>
      </form>
    );
  }
}

SessionForm.propTypes = {
  submitHandler: React.PropTypes.func.isRequired
};

export default SessionForm