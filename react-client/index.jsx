import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 

    };
  }

  
  render () {
    console.log('RENDERINGGG');
    return (
      <div>
        <h1>Midpoint</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));