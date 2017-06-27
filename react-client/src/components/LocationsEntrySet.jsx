import React from 'react';
import ReactDOM from 'react-dom';
import LocationEntry from './LocationEntry.jsx';


class AddressSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      locations: []
    };

    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
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
  }

  handleAddAddress() {
    console.log('adding another address input field');
    const locations = this.state.locations.concat(AddressInput);
    this.setState({locations});
  }

  render() {
    return (
      <div>
      <button onClick={this.add}>Add Additional Location</button>
      <form onSubmit={this.handleSubmit}>
        <label>
          Address:
          <input type="text" value={this.state.value} onChange={this.handleAddressChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default AddressSet;