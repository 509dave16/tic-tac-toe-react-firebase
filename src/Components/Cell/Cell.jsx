import React, {Component} from 'react';

class Cell extends Component {
  constructor(props) {
    //props.mark = props.mark ? props.mark : '';
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    this.props.attemptTurn(this.props.row, this.props.column);
  }

  render() {
    return (
      <td onClick={this.onClick}>
        {this.props.cell.mark}
      </td>
    );
  }

}

Cell.propTypes = {
  column: React.PropTypes.number.isRequired,
  row: React.PropTypes.number.isRequired,
  cell: React.PropTypes.object.isRequired,
  attemptTurn: React.PropTypes.func.isRequired
};

export default Cell