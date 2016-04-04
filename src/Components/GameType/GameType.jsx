import React, {Component} from 'react';

class GameType extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    var blah = 'blah blah';
    this.props.setGameType(e.target.innerText);
  }
  
  render() {

    console.log(this.props.types);
    return (
      <ul>
        {this.props.types.map((type, index) => {
          return <li key={index} onClick={this.onClick}>{type}</li>
        })}
      </ul>
    );
  }
}

GameType.propTypes = {
  types: React.PropTypes.array.isRequired,
  setGameType: React.PropTypes.func.isRequired
};

export default GameType