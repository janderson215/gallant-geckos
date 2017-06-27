import React from 'react';
import ReactDOM from 'react-dom';
// import LocationEntry from './LocationEntry.jsx';


class AddressSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      count: 1,
      activity: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleActivityChange(event) {
    this.setState({
      activity: event.target.value
    });
  }

  handleAddAddress() {
    console.log('adding another address input field');
    this.setState({
      count: this.state.count + 1
    });
  }

  handleRemoveAddress(index) {
    let locations = this.state.locations.slice();
    locations.splice(index, 1);
    this.setState({
      count: this.state.count - 1,
      locations
    });
  }

  handleAddressChange(i, event) {
    let locations = this.state.locations.slice();
    locations[i] = event.target.value;
    this.setState({
      locations
    });
  }


  handleSubmit(event) {
    // alert(`Hello, you submitted ${this.state.value}`);
    // need this line to below to pass the value from the input to the index file so that it can be used there
    var data = {
      locations: this.state.locations,
      activity: this.state.activity
    };
    this.props.onSubmit(data);
    event.preventDefault(); 

  }

  createForm() {
    let formItems = [];
    for (var i = 0; i < this.state.count; i++) {
      formItems.push(
        <div key={i}>
          <input type="text" value={this.state.locations[i] || ''} placeholder={`Address #${i + 1}`} onChange={this.handleAddressChange.bind(this, i)} />
          <input type="button" value="Remove" onClick={this.handleRemoveAddress.bind(this, i)} />
        </div>
      );
    }
    return formItems || null;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}> 
        {this.createForm()}
        <input type="button" value="Add More Addresses" onClick={this.handleAddAddress.bind(this)} />
        <div>{'\n'}</div>
        <input type="text" placeholder="Enter Activity" onChange={this.handleActivityChange.bind(this)}/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default AddressSet;