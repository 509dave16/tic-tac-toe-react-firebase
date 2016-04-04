import React, {Component} from 'react';
import Cell from '../Cell/Cell';

class Grid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table>
        <tbody>
        {this.renderGrid()}
        </tbody>
      </table>
    );
  }

  renderGrid() {
    return this.props.grid.map((row, rowIndex) => {
      return (
        <tr key={rowIndex}>
          {row.map((cell, columnIndex) => {
            return (
              <Cell row={rowIndex}
                    column={columnIndex}
                    cell={cell}
                    attemptTurn={this.props.attemptTurn}
                    key={columnIndex}/>
            );
          })}
        </tr>
      )
    });
  }
}

Grid.propTypes = {
  grid: React.PropTypes.array.isRequired,
  attemptTurn: React.PropTypes.func.isRequired
};

export default Grid