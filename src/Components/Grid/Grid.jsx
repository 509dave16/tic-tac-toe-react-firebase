import React, {Component} from 'react';
import Cell from '../Cell/Cell';

class Grid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <h2>{this.gameStatus}</h2>
        <table>
          <tbody>
          {this.renderGrid()}
          </tbody>
        </table>
      </div>
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