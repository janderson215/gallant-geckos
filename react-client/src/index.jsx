import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LocationsEntrySet from './components/LocationsEntryForm.jsx';
import Iframe from 'react-iframe';
import dummy from './dummy-data.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import styles from './app.css';
import Paper from 'material-ui/Paper';

// import BottomNavigation from 'material-ui/BottomNavigation';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    };
  }

  handleDummyData() {
    let data = dummy[0].iframe.toString();
    console.log(data);
    let url = data.slice(13, (data.length - 11));
    console.log(`https:${url}`);
    return `https:${url}`;
  }

  handleSubmit (data) {
    console.log(`the client has submitted "${JSON.stringify(data)}"`);
    console.log('hello' + this.handleDummyData());
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
        <Paper zDepth={1}>
          <span>
            <AppBar title="Midpoint" />
              <LocationsEntrySet onSubmit={this.handleSubmit.bind(this)}/>
              <Iframe url={this.handleDummyData()}
                width="450px"
                height="450px"
                display="initial"
                position="relative"
                />
          </span>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));