import React from 'react';

class Suggestion extends React.Component {
  render () {
    return (
      <div data-postcode={ this.props.postcode } onClick={ this.props.handleClick } >
        { this.props.postcode }
      </div>
    );
  }
}

export default Suggestion;