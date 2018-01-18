import React, { Component } from 'react';
import * as R from 'ramda';
import './App.scss';
import Category from './Category';
import Product from './Product';
import Suggestion from './Suggestion';

class App extends Component {

  constructor ( props ) {
    super ( props );
    // initial state setup
    this.state = {
      categories: [],
      products: [],
      suggestions: []
    };
  }

  componentDidMount () {  
    let categoriesUrl = 'https://api.gousto.co.uk/products/v2.0/categories';
    let productsUrl = 'https://api.gousto.co.uk/products/v2.0/products?includes[]=categories&includes[]=attributes&sort=position&image_sizes[]=365&image_sizes[]=400&period_id=120';

    // get all categories
    fetch ( categoriesUrl )
      .then ( this.handleResponse )
      .then ( json => {
        let localState = this.state;
        localState.categories = R.map ( category => { return R.pickAll ( [ 'id', 'title' ] ) ( category ); } ) ( json.data );
        this.setState ( localState );
      } )
      .catch ( error => console.log ( error ) );

    // get all products  
    fetch ( productsUrl )
      .then ( this.handleResponse )
      .then ( json => {
        let localState = this.state;
        localState.products = R.map ( product => { return R.pickAll ( [ 'title', 'description', 'categories' ] ) ( product ); } ) ( json.data );
        this.setState ( localState );
      } )
      .catch ( error => console.log ( error ) );

  };

  // generic response handling, keep DRY
  handleResponse = response => {
    if ( !response.ok ) {
      throw Error( response.statusText );
    }
    return response.json ();
  }

  // Toggle the product description on/off
  clickProduct = ( event ) => {
    let target = event.target;
    target.className = ( target.className.indexOf ( 'description-visible' ) > -1 ) ? '' : 'description-visible';
  }

  // to run each time the search input is changed and show updated suggestions
  getSuggestions = ( event ) => {
    /*let term = event.target.value.toLowerCase ();
    let localState = this.state;
    let matches = [];

    // find all partial/full matches of the provided string looking in postcodes
    if ( term !== "" ) matches = R.filter ( x => { return ( x.postcode.toLowerCase ().indexOf ( term ) > -1 ) ? x : null; } ) ( this.state.stores );
    else this.showAllStores ();
    localState.suggestions = matches;
    this.setState ( localState );*/
  }

  // to run each time a suggestion is selected, replace the postcode in the search box and call the search function
  clickSuggestion = ( event ) => {
    //let postcode = event.target.dataset.postcode;
    //this.searchForPostcode ( postcode );
  }

  // each time the enter key is used to search, we need to search by whatever was typed into, partial or not
  handleKeyPress = ( event ) => {
    //if ( event.key === 'Enter') {
    //  this.searchForPostcode ( event.target.value );   
   // }
  }

  // actual search function, will set the input to the postcode selected (if selected via a click event) and fire off an ajax request
  searchForProducts = ( postcode ) => {
    //document.querySelector ( '.search' ).value = postcode;
    //let localState = this.state;
    //localState.suggestions = [];
    //this.setState ( localState );
  }

  // show all stores after a search
  showAllProducts = ( event ) => {
    //document.querySelector ( '.search' ).value = "";
    //let localState = this.state;
    //localState.storeView = this.state.stores;
    //this.setState ( localState );
  }

  render () {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title">React Food Store</h1>
          <div className="menu">
          {
            this.state.categories.map ( ( category, index ) => {
              return <Category key={ index } { ...category } />;
            } )
          }
          </div>
        </header>
        <div className="searchbox">
          <input type="text" className="search" onChange={ this.getSuggestions.bind ( this ) } onKeyPress={ this.handleKeyPress } placeholder="Product Search" /> <button onClick={ this.showAllProducts }>Show All</button>
          <div className="suggestion-list">
            {
              this.state.suggestions.map ( ( suggestion, index ) => {
                return <Suggestion key={ index } handleClick={ this.clickSuggestion } { ...suggestion } />;
              } )
            }
          </div>
        </div>
        <div className="product-list">
          {
            this.state.products.map ( ( product, index ) => {
              return <Product key={ index } { ...product } handleClick={ this.clickProduct } />;
            } )
          }
          </div>
      </div>
    );
  }
}

export default App;