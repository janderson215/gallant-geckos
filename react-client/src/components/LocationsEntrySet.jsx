import React from 'react';
import ReactDOM from 'react-dom';
import LocationEntry from './LocationEntry.jsx';


class AddressSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // hold the divs in here and render as we add them to this
      locations: []
    };

    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  handleAddAddress() {
    console.log('adding another address input field');
    const locations = this.state.locations.concat(LocationEntry);
    this.setState({locations});
  }

  handleAddressChange(event) {
    this.setState({
      address: event.target.value
    });
    console.log(this.state.address);
    
  }


  handleSubmit(event) {
    // alert(`Hello, you submitted ${this.state.value}`);
    // need this line to below to pass the value from the input to the index file so that it can be used there
    console.log('submitting addresses to the server');
    this.props.onSubmit(this.state.address);
    event.preventDefault(); 
    // this.setState({
    //   value: '',
    //   addresses: []
    // });

    // eventually make an ajax request here
  }


  render() {
    const locations = this.state.locations.map((Element, index) => {
      return <Element key={index} index={index} />;
    });
    return (
      <div>
      <button onClick={this.handleAddAddress}>Add Additional Location</button>
      <form onSubmit={this.handleSubmit}>
        <label>
          Address:
          {/*<LocationEntry value={this.state.value} onChange={this.handleAddressChange} />*/}
          <div className="inputs">
            { locations }
            </div>
          {/*<input type="text" value={this.state.value} onChange={this.handleAddressChange} />*/}
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default AddressSet;