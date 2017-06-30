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
import ResultsList from './components/ResultsList.jsx';
import BottomNavigation from 'material-ui/BottomNavigation';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      iframe: this.handleDummyData(),
      recommendedPlaces: dummy,
      recommendedPlaceIframe: ''
    };
    this.handleSelectResult = this.handleSelectResult.bind(this);
  }

  handleSelectResult(recommendedPlaceClicked) {
    console.log('handleSelectResult invoked, wire state');
    console.log('clicked on: ', recommendedPlaceClicked);
    let iframeLong = recommendedPlaceClicked.iframe;
    let iframeURL = iframeLong.slice(13, iframeLong.length - 11);
    this.setState({
      recommendPlaceIframe: `https:${iframeURL}`
    });
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
    console.log('First Render');
    return (
      <div className="render-app">
        <MuiThemeProvider>
          <div>
            <AppBar title="Midpoint" />
              <LocationsEntrySet onSubmit={this.handleSubmit.bind(this)}/>
            <Iframe url={this.state.recommendPlaceIframe}
              width="450px"
              height="450px"
              display="initial"
              position="relative"
              />
          </div>
        </MuiThemeProvider>
        <ResultsList handleSelectResult={this.handleSelectResult}
                     recommendedPlaces={this.state.recommendedPlaces}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));