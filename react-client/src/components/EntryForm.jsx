import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import AddEntryButton from './AddEntryButton.jsx';
import AddressField from './AddressField.jsx';
import PhoneNumberField from './PhoneNumberField.jsx';
import Phone, {isValidPhoneNumber} from 'react-phone-number-input';
import RemoveEntryButton from './RemoveFieldButton.jsx';

class EntrySet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      phoneNumbers: [],
      count: 2, // starting number of fields
      activity: '',
      name: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
    this.handleActivityChange = this.handleActivityChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

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
    let addresses = this.state.addresses.slice();
    addresses[i] = value;
    this.setState({
      addresses
    });
  }

  handlePhoneNumberChange(i, e) {
    let phoneNumbers = this.state.phoneNumbers.slice();
    phoneNumbers[i] = e;
    this.setState({
      phoneNumbers
    });
  }

  handleAddAddress() {
    this.setState({
      count: this.state.count + 1
    });
  }

  handleRemoveEntry(index) {
    let addresses = this.state.addresses.slice();
    let phoneNumbers = this.state.phoneNumbers.slice();
    phoneNumbers.splice(index, 1);
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
      if (isValidPhoneNumber(this.state.phoneNumbers[i]) === false) {
        alert(`Bad phone number for person #${i + 1}`);
        this.handlePhoneNumberChange(i, '');
        throw 'error';
      }
      people.push({
        address: this.state.addresses[i],
        phone: this.state.phoneNumbers[i]
      });
    }
    var data = {
      type: this.state.activity,
      people: people,
      initiator: this.state.name
    };
    this.props.onSubmit(data);
  }

  onSuggestSelect(i, suggest) {
    let addresses = this.state.addresses.slice();
    addresses[i] = suggest.label;
    this.setState({
      addresses
    });
  }

  onPhoneChange(i, phone) {
    let phoneNumbers = this.state.phoneNumbers.slice();
    phoneNumbers[i] = phone;
    this.setState({
      phoneNumbers
    });
  }

  createForm() {
    // have it to make entries instead
    let formItems = [];
    for (var i = 0; i < this.state.count; i++) {
      if (i < 2) {
        formItems.push(
          <div key={i}>
            <AddressField
              i={i}
              onChange={this.handleAddressChange.bind(this, i)}
              // important to have the onSuggestSelect be the same prop name as from the Docs
              onSuggestSelect={this.onSuggestSelect.bind(this, i)}
              initialValue={this.state.addresses[i] || ''} />
            <PhoneNumberField
              i={i}
              value={this.state.phoneNumbers[i] || ''}
              onChange={this.onPhoneChange.bind(this, i)}
              />
            <br></br>
            <Divider />
            <br></br>
          </div>
        );
      } else {
        formItems.push(
          <div key={i}>
            <AddressField 
              i={i}
              onChange={this.handleAddressChange.bind(this, i)}
              onSuggestSelect={this.onSuggestSelect.bind(this, i)}
              initialValue={this.state.addresses[i] || ''} />
            <RemoveEntryButton 
              removeEntry={this.handleRemoveEntry.bind(this, i)} />
            <PhoneNumberField 
              i={i}
              onChange={this.onPhoneChange.bind(this, i)}
              value={this.state.phoneNumbers[i] || ''} />
            <br></br>
            <Divider />
            <br></br>            
          </div>
        );
      }
    }
    return formItems;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}> 
        <AddEntryButton 
          addEntry={this.handleAddAddress} />
        <br></br>
        <TextField 
          hintText="What's your name?" 
          onChange={this.handleNameChange.bind(this)} />
        <br></br>
        <Divider />
        {this.createForm()}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <span>
          <TextField 
            hintText="What type of place are you looking for?" 
            onChange={this.handleActivityChange} />
          <RaisedButton 
            type="submit" 
            label="Submit" />
          </span>
      </form>
    );
  }
}

export default EntrySet;