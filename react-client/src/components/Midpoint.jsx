import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import EntrySet from './EntryForm.jsx';
import Iframe from 'react-iframe';
import dummy from '../dummy-data.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import styles from '../app.css';
import Paper from 'material-ui/Paper';


// move paul's things in here
class Midpoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      iframe: this.handleDummyData(),
      data: null
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
    console.log(`the client has submitted "${(JSON.stringify(data))}"`);
    this.setState({
      data: data
    });
    // make ajax calls
    $.ajax({
      url: '/addresses',
      method: 'POST',
      data: data,
      error: function(err) {
        console.log(err);
      },
      success: function(data, callback) {
        if (data) {
          
        }
      }
    });
  }


  render () {
    console.log('First Render');
    return (
      <MuiThemeProvider>
        <Paper zDepth={1}>
          <span>
            <AppBar title="Midpoint" showMenuIconButton={false} />
              <EntrySet onSubmit={this.handleSubmit.bind(this)}/>
              <Iframe url={this.state.iframe}
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

export default Midpoint;