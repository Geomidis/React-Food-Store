import React from 'react';

class Product extends React.Component {
  render () {
    return (
      <div onClick={ this.props.handleClick.bind ( this ) }> 
        <h3> { this.props.title } </h3>
        <p> { this.props.description } </p>
      </div>
    );
  }
}

export default Product;