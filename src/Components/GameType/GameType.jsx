import styles from './GameType.scss';
import colors from './../../Colors.scss';

import React, {Component} from 'react';

class GameType extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.props.setGameType(e.target.innerText);
  }

  render() {
    return (
      <div className={`${styles.list} ${this.props.selected ? '' : styles.selectable}`}>
        {this.props.types.map((type, index) => {
          const selected = this.props.selected === type ? styles.selection : '';
          return <span className={`${styles.item} ${selected}`} key={index} onClick={this.onClick}>{type}</span>
        })}
      </div>
    );
  }
}

GameType.propTypes = {
  selected: React.PropTypes.string.isRequired,
  types: React.PropTypes.array.isRequired,
  setGameType: React.PropTypes.func.isRequired
};

export default GameType