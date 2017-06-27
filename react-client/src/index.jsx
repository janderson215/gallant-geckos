import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LocationsEntrySet from './components/LocationsEntryForm.jsx';

// import more components such as templates

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    };
  }


  handleSubmit (data) {
    console.log(`the client has submitted "${JSON.stringify(data)}"`);

    // make ajax calls
    $.ajax({
      url: '/addresses',
      method: 'POST',
      data: data
      
    });
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