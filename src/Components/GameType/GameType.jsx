import styles from './GameType.scss';
import React, {Component} from 'react';

class GameType extends Component {
  constructor(props) {
    console.log(styles.gameTypeList);
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.props.setGameType(e.target.innerText);
  }

  render() {
    return (
      <div className={styles.gameTypeList}>
        {this.props.types.map((type, index) => {
          return <button key={index} onClick={this.onClick}>{type}</button>
        })}
      </div>
    );
  }
}

GameType.propTypes = {
  types: React.PropTypes.array.isRequired,
  setGameType: React.PropTypes.func.isRequired
};

export default GameType