import React from 'react';
import ReactDOM from 'react-dom';
import Geosuggest from 'react-geosuggest';
import styles from '../app.css';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class AddressSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      phoneNumbers: [],
      count: 2, // starting number of fields
      activity: '',
      name: ''
    };
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleActivityChange(e) {
    this.setState({
      activity: e.target.value
    });
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleAddressChange(i, value) {
    console.log(`i ${i} e ${value}`);
    let addresses = this.state.addresses.slice();
    addresses[i] = value;
    this.setState({
      addresses
    });
  }

  handlePhoneNumberChange(i, e) {
    let phoneNumbers = this.state.phoneNumbers.slice();
    phoneNumbers[i] = e.target.value;
    this.setState({
      phoneNumbers
    });
  }

  handleAddAddress() {
    console.log('adding another address input field');
    this.setState({
      count: this.state.count + 1
    });
  }

  handleRemoveEntry(index) {
    let addresses = this.state.addresses.slice();
    let phoneNumbers = this.state.phoneNumbers.slice();
    phoneNumbers.splice(index, 1);
    // console.log(`idx: ${index} value: ${addresses[index]}`);
    addresses.splice(index, 1);
    this.setState({
      count: this.state.count - 1,
      addresses,
      phoneNumbers

    });
  }

  handleSubmit(event) {
    // alert(`Hello, you submitted ${this.state.value}`);
    event.preventDefault(); 
    // format the states of addressess and numbers to be an array of individual objects containing each
    let people = [];
    for (var i = 0; i < this.state.addresses.length; i++) {
      people.push({
        address: this.state.addresses[i],
        phone: this.state.phoneNumbers[i]
      });
    }
    var data = {
      activity: this.state.activity,
      people: people,
      name: this.state.name
    };
    this.props.onSubmit(data);
  }

  onSuggestSelect(i, suggest) {
    // console.log(`${i} ${suggest.label}`);
    let addresses = this.state.addresses.slice();
    addresses[i] = suggest.label;
    this.setState({
      addresses
    });
  }

  createGeosuggest(i) {
    return (
      <Geosuggest
        placeholder={`Address #${i + 1}`}
        ref={el => this._geoSuggest = el}
        onChange={this.handleAddressChange.bind(this, i)}
        onSuggestSelect={this.onSuggestSelect.bind(this, i)}
        initialValue={this.state.addresses[i] || ''}
      />
    );
  }

  createPhoneNumberField(i) {
    return (
      <input 
        type="text" 
        value={this.state.phoneNumbers[i] || ''}
        placeholder={`Phone Number #${i + 1}`}
        onChange={this.handlePhoneNumberChange.bind(this, i)}
      />
    );
  }

  createRemoveFieldButton(i) {
    return (
      <RaisedButton className="remove" label="Remove" onClick={this.handleRemoveEntry.bind(this, i)}/>
    );
  }

  createForm() {
    let formItems = [];
    for (var i = 0; i < this.state.count; i++) {
      if (i < 2) {
        formItems.push(
          <li key={i}>
            {this.createGeosuggest(i)}
            {this.createPhoneNumberField(i)}
          </li>
        );
      } else {
        formItems.push(
          <li key={i}>
            {this.createGeosuggest(i)}
            {this.createPhoneNumberField(i)}
            {this.createRemoveFieldButton(i)}
          </li>
        );
      }
    }
    return formItems;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}> 
        <input type="text" placeholder="Enter Initiator Name" onChange={this.handleNameChange.bind(this)}/>
        {this.createForm()}
        <br></br>
        <br></br>
        <br></br>
        <RaisedButton label="Add More Addresses" onClick={this.handleAddAddress.bind(this)} />
        <br></br>
        <input type="text" placeholder="Enter Activity" onChange={this.handleActivityChange.bind(this)}/>
        <RaisedButton type="submit" label="Submit" />
      </form>
    );
  }
}

export default AddressSet;