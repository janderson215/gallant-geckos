import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LocationsEntrySet from './components/LocationsEntryForm.jsx';
import Iframe from 'react-iframe';
import dummy from './dummy-data.js';
// import more components such as templates

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    };
  }

  handleDummyData() {
    let data = dummy[0].iframe.slice(12, (dummy[0].length - 10));
    return data;
  }

  handleSubmit (data) {
    console.log(`the client has submitted "${JSON.stringify(data)}"`);

    // make ajax calls
    $.ajax({
      url: '/addresses',
      method: 'POST',
      data: data,
      error: function(err) {
        console.log(err);
      },
      success: function(data) {
        if (data) {
          console.log(data);
        }
      }
    });
  }


  render () {
    console.log('RENDERINGGG');
    return (
      <div>
        <h1>Midpoint</h1>
        <LocationsEntrySet onSubmit={this.handleSubmit.bind(this)}/>
        <Iframe url="http://www.google.com/maps/embed/v1/place?q=110%20Robinson%20Street,%20San%20Francisco&zoom=17&key=AIzaSyD7Hq8ejGKI9t3JIbnfz2myKOScIY5lnq0"
          width="450px"
          height="450px"
          display="initial"
          position="relative"
          />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));