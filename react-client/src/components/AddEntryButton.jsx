import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

const AddEntryButton = (props) => (
  <RaisedButton
    label="Add More People"
    onClick={props.handleAddAddress}
  />
);

export default AddEntryButton;