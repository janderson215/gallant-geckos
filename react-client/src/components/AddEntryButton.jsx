import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

const AddEntryButton = ({addEntry}) => (
  <RaisedButton
    label="Add More People"
    onClick={addEntry}
  />
);

export default AddEntryButton;