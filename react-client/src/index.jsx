import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LocationsEntrySet from './components/LocationsEntryForm.jsx';
import Iframe from 'react-iframe';
import dummy from './dummy-data.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
// import BottomNavigation from 'material-ui/BottomNavigation';


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
      <MuiThemeProvider>
        <div>
          <AppBar title="Midpoint" />
            <LocationsEntrySet onSubmit={this.handleSubmit.bind(this)}/>
          <Iframe url={this.handleServerResponse()}
            width="450px"
            height="450px"
            display="initial"
            position="relative"
            />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));