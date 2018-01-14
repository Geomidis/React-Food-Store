import React, { Component } from 'react';
import logo from './logo.png';
import * as R from 'ramda';
import './App.scss';
import Store from './Store';
import Suggestion from './Suggestion';

class App extends Component {

  constructor ( props ) {
    super ( props );
    // initial state setup
    this.state = {
      stores: [],
      suggestions: [],
      storeView: []
    };
  }

  componentDidMount () {  
    // load json file, could be remote  
    let url = 'http://localhost:3000/stores.json'

    // updating the state as results come in
    let updateStores = store => {
      let localState = this.state;
      // when the response comes back, map over the stores list and augment the right one. If not done this way, the other alternative would be for the 
      // list to reorder every time something was added when fully loaded, but that would look like a mistake, as the response is async, so it is preferable
      // to do it this way, so items are never 'resorted' but rather have the added data added as soon as they are ready.
      localState.stores = localState.storeView = R.map ( x => { return ( x.postcode === store.postcode && x.name === store.name ) ? store : x; } ) ( this.state.stores );
      this.setState ( localState );
    }

    // handle store lookup errors (if any)
    let handleStoreError = store => {
      let localState = this.state;
      localState.stores = localState.storeView = R.map ( x => { 
        if ( x.postcode === store.postcode && x.name === store.name ) {
          store.error = true;
          return store;
        } else return x;
      } ) ( this.state.stores );
      this.setState ( localState );
    }

    fetch ( url )
      .then ( this.handleResponse )
      .then ( data => {
        // sort data and present initially without a map, pending the response of the api
        let sortedStores = R.sortBy ( R.prop ( 'name' ), R.map ( store => { return R.evolve ( { 'name': R.replace ( /_/g, ' ' ) }, store ) } ) ( data ) );
        let localState = this.state;
        localState.stores = localState.storeView = sortedStores;
        this.setState ( localState );

        // using ramda map through the data, load the lat & long from postcodes.io, as well as generate the image from google maps
        R.map ( store => {
          // once everything is sorted, drill down to augment each store object with a link and an image of the google map, to be used asap
          fetch ( 'http://api.postcodes.io/postcodes/' + store.postcode )
            .then ( this.handleResponse )
            .then ( data => {
              store.gmapsLink = [ "https://www.google.com/maps/search/?api=1&query=", data.result.latitude, ",", data.result.longitude ].join ( '' );
              store.gmapsImg = [ "https://maps.googleapis.com/maps/api/staticmap?center=", data.result.latitude, ",", data.result.longitude,
                                "&zoom=13&size=300x200&maptype=roadmap&markers=color:red%7C", data.result.latitude, ",", data.result.longitude,
                                "&key=AIzaSyDFzWXSiYbkkYSDw3TVbFXE7__5rjvkqwI" ].join ( '' );

              updateStores ( R.evolve ( { 'name': R.replace ( /_/g, ' ' ) }, store ) );
            } )
            .catch ( error => { handleStoreError ( store ); console.log ( error ); } );
            return null;
        } ) ( data );
      } )
      .catch ( error => console.log ( error ) );
  };

  // generic response handling, so we keep DRY
  handleResponse = response => {
    if ( !response.ok ) {
      throw Error( response.statusText );
    }
    return response.json ();
  }

  // to run each time the search input is changed and show updated suggestions
  getSuggestions = ( event ) => {
    let term = event.target.value.toLowerCase ();
    let localState = this.state;
    let matches = [];

    // find all partial/full matches of the provided string looking in postcodes
    if ( term !== "" ) matches = R.filter ( x => { return ( x.postcode.toLowerCase ().indexOf ( term ) > -1 ) ? x : null; } ) ( this.state.stores );
    else this.showAllStores ();
    localState.suggestions = matches;
    this.setState ( localState );
  }

  // to run each time a suggestion is selected, replace the postcode in the search box and call the search function
  clickSuggestion = ( event ) => {
    let postcode = event.target.dataset.postcode;
    this.searchForPostcode ( postcode );
  }

  // each time the enter key is used to search, we need to search by whatever was typed into, partial or not
  handleKeyPress = ( event ) => {
    if ( event.key === 'Enter') {
      this.searchForPostcode ( event.target.value );   
    }
  }

  // actual search function, will set the input to the postcode selected (if selected via a click event) and fire off an ajax request
  searchForPostcode = ( postcode ) => {
    document.querySelector ( '.search' ).value = postcode;
    let localState = this.state;
    localState.suggestions = [];
    this.setState ( localState );

    // get nearest outcodes
    fetch ( 'http://api.postcodes.io/outcodes/' + postcode.split ( ' ' )[ 0 ] + '/nearest' )
      .then ( this.handleResponse )
      .then ( data => {
        // some ramda to get a flattened array of a map of each result to act as a filter of our stores
        let matches = R.flatten ( R.map ( result => { 
          return R.filter ( store => {
            return ( store.postcode.toLowerCase ().indexOf ( result.outcode.toLowerCase () ) === 0 ) ? store : null;
          } ) ( this.state.stores )
        } ) ( data.result ) );

        localState = this.state;
        localState.storeView = matches;
        this.setState ( localState );
      } )
      .catch ( error => { alert ( 'Postcode not found, try again! You should provide at least an outcode.' ); console.log ( error ) } );
  }

  // show all stores after a search
  showAllStores = ( event ) => {
    document.querySelector ( '.search' ).value = "";
    let localState = this.state;
    localState.storeView = this.state.stores;
    this.setState ( localState );
  }

  render () {
    return (
      <div className="App">
        <header className="header">
          <img src={ logo } className="logo" alt="logo" />
          <h1 className="title">React Store Finder</h1>
        </header>
        <div className="intro">
          <p>Please scroll through our list of stores or search using your postcode.</p>
          <div className="searchbox">
            <input type="text" className="search" onChange={ this.getSuggestions.bind ( this ) } onKeyPress={ this.handleKeyPress } placeholder="Postcode search" /> <button onClick={ this.showAllStores }>Show All</button>
            <div className="suggestion-list">
              {
                this.state.suggestions.map ( ( suggestion, index ) => {
                  return <Suggestion key={ index } handleClick={ this.clickSuggestion } { ...suggestion } />;
                } )
              }
            </div>
          </div>
        </div>
        <div className="store-list">
          {
            this.state.storeView.map ( ( store, index ) => {
              return <Store key={ index } { ...store } />;
            } )
          }
        </div>
      </div>
    );
  }
}

export default App;