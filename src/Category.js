import React from 'react';

class Store extends React.Component {
  render () {
    return (
      <span> { this.props.title } </span>
    );
  }
}

export default Store;