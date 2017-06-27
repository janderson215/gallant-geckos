import React from 'react';
import ReactDOM from 'react-dom';

class Mwf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      documents: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.add = this.add.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    // alert(`Hello, you submitted ${this.state.value}`);
    // need this line to below to pass the value from the input to the index file so that it can be used there
    console.log('submitting address(es) to the server');
    this.props.onSubmit(this.state.value);
    event.preventDefault(); 
    this.setState({
      value: '',
      addresses: []
    });
  }

  add() {
    console.log('adding another address input field');
    // const documents = this.state.documents.concat(DocumentInput);
    // this.setState({documents});
  }

  render() {
    return (
      <div>
      <button onClick={this.add}>Add Address</button>
      <form onSubmit={this.handleSubmit}>
        <label>
          Addresses:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default Mwf;