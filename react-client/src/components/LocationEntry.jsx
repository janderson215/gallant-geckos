import React from 'react';
import ReactDOM from 'react-dom';

class AddressInput extends React.Component {
  render() {
    return (
    <div> 
      <input type="text" placeholder="Address ${this.state.locations.length}" /> <br/>

    </div>
    );
  }
}

export default AddressInput;