import React, {Component} from 'react';

class Text extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    var blah = 'blah blah';
    this.props.submitHandler(this.refs.session.value);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input ref='session' type="text" />
      </form>
    );
  }
}

Text.propTypes = {
  submitHandler: React.PropTypes.func.isRequired
};

export default Text