import React from 'react';
import ReactDOM from 'react-dom';
import LocationEntry from './LocationEntry.jsx';


class AddressSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // hold the divs in here and render as we add them to this
      address: '',
      locations: []
    };

    // add binding for handleAddAddress in the field below
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  handleAddAddress(index, event) {
    console.log('adding another address input field');
    const value = event.target.value;


    
    const locations = this.state.locations.concat(LocationEntry);
    this.setState({locations});
    console.log(this.state.locations);
  }

  handleAddressChange(event) {
    this.setState({
      addresses: event.target.value
    });
    console.log(this.state.address);
    this.props.onChange(index, {...this.props.locations[index], address: value});



  }


  handleSubmit(event) {
    // alert(`Hello, you submitted ${this.state.value}`);
    // need this line to below to pass the value from the input to the index file so that it can be used there
    console.log('submitting addresses to the server');
    this.props.onSubmit(this.state.addresses);
    event.preventDefault(); 

    
    // this.setState({
    //   value: '',
    //   addresses: []
    // });
  }


  render() {
    const locations = this.state.locations.map((AddressBar, index) => {
      // AddressBar must be capital letter first (for whatever reason)
      return <AddressBar key={index} index={index} onChnage={this.handleAddressChange} />;
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