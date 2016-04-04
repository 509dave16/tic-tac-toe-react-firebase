import React, {Component} from 'react';

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
      <form>
        <input ref='session' type="text" />
        <button onClick={this.onClick}>Join Session</button>
      </form>
    );
  }
}

SessionForm.propTypes = {
  submitHandler: React.PropTypes.func.isRequired
};

export default SessionForm