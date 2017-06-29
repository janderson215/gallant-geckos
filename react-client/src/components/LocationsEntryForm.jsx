import React from 'react';
import ReactDOM from 'react-dom';
import Geosuggest from 'react-geosuggest';
import styles from '../geosuggest.css';
import RaisedButton from 'material-ui/RaisedButton';

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

  createForm() {
    let formItems = [];
    for (var i = 0; i < this.state.count; i++) {
      formItems.push(
        <div key={i}>
          <Geosuggest
            placeholder={`Address #${i + 1}`}
            ref={el => this._geoSuggest = el}
            onChange={this.handleAddressChange.bind(this, i)}
            onSuggestSelect={this.onSuggestSelect.bind(this, i)}
            initialValue={this.state.locations[i] || ''}
          />
          <RaisedButton className="remove" label="Remove" onClick={this.handleRemoveAddress.bind(this, i)}/>
          {/*<input type="text" value={this.state.locations[i] || ''} placeholder={`Address #${i + 1}`} onChange={this.handleAddressChange.bind(this, i)} />*/}

        </div>
      );
    }
    return formItems;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}> 
        {this.createForm()}
        <br></br>
        <br></br>
        <RaisedButton label="Add More Addresses" onClick={this.handleAddAddress.bind(this)} />
        <br></br>
        <br></br>
        <input type="text" placeholder="Enter Activity" onChange={this.handleActivityChange.bind(this)}/>
        <RaisedButton type="submit" label="Submit" />

      </form>
    );
  }
}

export default AddressSet;