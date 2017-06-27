import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LocationsEntrySet from './components/LocationsEntrySet.js';

// import more components such as templates

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      locations: []
    };
  }


  handleSubmit (values) {
    console.log(`the client has submitted "${values}"`);

  }


  render () {
    console.log('RENDERINGGG');
    return (
      <div>
        <h1>Midpoint</h1>
        <LocationsEntrySet onSubmit={this.handleSubmit.bind(this)}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));