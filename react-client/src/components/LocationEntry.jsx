import React from 'react';
import ReactDOM from 'react-dom';

class AddressInput extends React.Component {
  render() {
    return <input type="text" placeholder={`Address #${index + 1}`} />;
  }
}

export default AddressInput;