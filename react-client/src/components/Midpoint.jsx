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
import ResultsList from './ResultsList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      recommendedPlaceIframe: this.handleDummyData(),
      recommendedPlaces: dummy.pointsOfInterest,
      recommendedPlaceAddress: null,
      recommendedPlaceName: null,
      sessionID: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectResult = this.handleSelectResult.bind(this);
    this.notifyParties = this.notifyParties.bind(this);
  }

  componentDidMount () {
    this.setState({
      recommendedPlaceIframe: 'https://www.google.com/maps/embed/v1/place?q=110%20Robinson%20Street,%20San%20Francisco&zoom=17&key=AIzaSyD7Hq8ejGKI9t3JIbnfz2myKOScIY5lnq0'
    });
  }

  handleSelectResult (recommendedPlaceClick) {
    console.log('clicked on: ', recommendedPlaceClick.name);
    let iframeLong = recommendedPlaceClick.iframe_string;
    let iframeURL = iframeLong.slice(19, iframeLong.length - 11);
    console.log('passing into iframe: ', iframeURL);
    this.setState({
      recommendedPlaceIframe: `https:${iframeURL}`,
      recommendedPlaceAddress: recommendedPlaceClick.address,
      recommendedPlaceName: recommendedPlaceClick.name
    });
    console.log(this.state.recommendedPlaceIframe);
  } 

  handleDummyData () {
    let data = dummy.pointsOfInterest[0].iframe_string.toString();
    console.log(data);
    let url = data.slice(19, (data.length - 11));
    console.log(`https:${url}`);
    return `https:${url}`;
  }

  handleSubmit (data) {
    let context = this;
    console.log(`the client has submitted "${(JSON.stringify(data))}"`);
    this.setState({
      data: data
    });
    $.ajax({
      url: '/addresses',
      method: 'POST',
      data: data,
      error: function(err) {
        console.log(err);
      },
      success: function(data) {
        if (data) {
          context.setState({
            sessionID: data
          }, function() {
            context.fetchPlaces();
          });
        }
      }
    });
  }

  fetchPlaces() {
    let that = this;
    $.ajax({
      method: 'GET',
      url: '/points-of-interest',
      data: {
        id: this.state.sessionID
      },
      success: function(data) {
        if (data) {
          that.setState({
            recommendedPlaces: data.pointsOfInterest
          });
        }
      },
      error: function(err) {
        if (err) {
          console.log('err, ', err);
        }
      }
    });
  }

  notifyParties(data) {
    let that = this;
    $.ajax({
      method: 'POST',
      url: '/notify-parties',
      data: {
        initiatorName: that.state.data.initiator,
        location: {
          name: that.state.recommendedPlaceClick.name,
          address: that.state.recommendedPlaceClick.address
        },
        phoneNums: data.phoneNumbers
      },
      error: function(err) {
        if (err) {
          console.log(err);
        }
      },
      success: function(data) {
        if (data) {
          console.log('Parties notified');
        }
      }
    });

  }


  render () {
    return (
      <MuiThemeProvider>
        <Paper zDepth={1}>
          <span>
            <AppBar title="Midpoint" showMenuIconButton={false} />
              <EntrySet onSubmit={this.handleSubmit} notifyParties={this.notifyParties}/>
              <Iframe   
                url={this.state.recommendedPlaceIframe}
                width="450px"
                height="450px"
                display="initial"
                position="relative" />
          </span>
        <ResultsList
          handleSelectResult={this.handleSelectResult}
          recommendedPlaces={this.state.recommendedPlaces} />
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;