import React from 'react';
import AddressField from './AddressField.jsx';
import PhoneNumber from './PhoneNumberField.jsx';

class EntryField extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      initiator: null,
      type: null,
      addresses: [],
      phoneNumbers: []
    };
    // bindings for listeners can go here


  }

  // methods || listeners




  render() {
    return (
      <div i={i}>
        <AddressField />

        <PhoneNumber />
        </div>
    );
  }
}

export default EntryField;