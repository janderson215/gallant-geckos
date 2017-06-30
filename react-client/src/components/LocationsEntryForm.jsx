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
      locations: [],
      count: 2,
      activity: '',
    };
    this.handleAddressChange = this.handleAddressChange.bind(this);
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
    console.log(`idx: ${index} value: ${locations[index]}`);
    locations.splice(index, 1);
    this.setState({
      count: this.state.count - 1,
      locations
    });
  }

  handleAddressChange(i, value) {
    console.log(`i ${i} e ${value}`);
    let locations = this.state.locations.slice();
    locations[i] = value;
    this.setState({
      locations
    });
  }

  handleSubmit(event) {
    // alert(`Hello, you submitted ${this.state.value}`);
    // need this line to below to pass the value from the input to the index file so that it can be used there
    event.preventDefault(); 
    var data = {
      locations: this.state.locations,
      activity: this.state.activity
    };
    this.props.onSubmit(data);
  }

  onSuggestSelect(i, suggest) {
    // console.log(`${i} ${suggest.label}`);
    let locations = this.state.locations.slice();
    locations[i] = suggest.label;
    this.setState({
      locations
    });
  }

  createGeosuggest(i) {
    return (
      <Geosuggest
        placeholder={`Address #${i + 1}`}
        ref={el => this._geoSuggest = el}
        onChange={this.handleAddressChange.bind(this, i)}
        onSuggestSelect={this.onSuggestSelect.bind(this, i)}
        initialValue={this.state.locations[i] || ''}
      />
    );
  }

  createPhoneNumberField(i) {
    return (
      <input>
      </input>
    );
  }

  createRemoveFieldButton(i) {
    return (
      <RaisedButton className="remove" label="Remove" onClick={this.handleRemoveAddress.bind(this, i)}/>
    );
  }

  createForm() {
    let formItems = [];
    for (var i = 0; i < this.state.count; i++) {
      if (i < 2) {
        formItems.push(
          <li key={i}>
            {this.createGeosuggest(i)}
          </li>
        );
      } else {
        formItems.push(
          <li key={i}>
            {this.createGeosuggest(i)}
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
        {this.createForm()}
        <br></br>
        <br></br>
        <br></br>
        <RaisedButton label="Add More Addresses" onClick={this.handleAddAddress.bind(this)} />
        <br></br>
        <input type="text" className="activityinput" placeholder="Enter Activity" onChange={this.handleActivityChange.bind(this)}/>
        <RaisedButton type="submit" label="Submit" />
      </form>
    );
  }
}

export default AddressSet;