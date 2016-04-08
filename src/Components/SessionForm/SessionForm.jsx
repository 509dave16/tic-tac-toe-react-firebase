import React, {Component} from 'react';
import styles from './SessionForm.scss';

class SessionForm extends Component {
  constructor(props) {
    super(props);
    this.defaultText = props.defaultText ? props.defaultText : '';
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.submitHandler(this.refs.session.value);
    this.refs.session.value = '';
  }

  render() {
    return (
      <form className={`${styles.sessionForm}`}>
        <input  placeholder={this.defaultText} ref='session' type="text"/>
        <button className={`${styles.unselected}`} onClick={this.onClick}>Join</button>
      </form>
    );
  }
}

SessionForm.propTypes = {
  defaultText: React.PropTypes.string,
  submitHandler: React.PropTypes.func.isRequired
};

export default SessionForm