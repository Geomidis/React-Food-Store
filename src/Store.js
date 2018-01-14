import React from 'react';

class Store extends React.Component {
  render () {
    return (
      <div>
        <h2> { this.props.name } </h2>
        <h3> { this.props.postcode } </h3>
        <a href={ this.props.gmapsLink } target="_blank">
        	<img src={ !this.props.error ? this.props.gmapsImg : '/imagenotfound.jpg' } alt={ 'Google Map for' + this.props.postcode } />
		    </a>
      </div>
    );
  }
}

export default Store;