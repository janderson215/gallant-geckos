import React from 'react';
import ReactDOM from 'react-dom';
// import LocationEntry from './LocationEntry.jsx';


class AddressSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // hold the divs in here and render as we add them to this
      // address: '',
      // locations: []
      value: [],
      count: 1
    };

    // add binding for handleAddAddress in the field below
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  handleAddAddress() {
    console.log('adding another address input field');
    this.setState({
      count: this.state.count + 1
    });
  }

  handleRemoveAddress(index) {
    let value = this.state.value.slice();
    value.splice(index, 1);
    this.setState({
      count: this.state.count - 1,
      value
    });
  }

  handleAddressChange(i, event) {
    let value = this.state.value.slice();
    value[i] = event.target.value;
    this.setState({
      value
    });
  }


  handleSubmit(event) {
    alert(`Hello, you submitted ${this.state.value}`);
    // need this line to below to pass the value from the input to the index file so that it can be used there

    this.props.onSubmit(this.state.address);
    event.preventDefault(); 

  }

  createForm() {
    let formItems = [];
    for (var i = 0; i < this.state.count; i++) {
      formItems.push(
        <div key={i}>
          <input type="text" value={this.state.value[i] || ''} onChange={this.handleAddressChange.bind(this, i)} />
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
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default AddressSet;