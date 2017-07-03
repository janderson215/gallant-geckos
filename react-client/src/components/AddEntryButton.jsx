import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const AddEntryButton = ({addEntry}) => (
  <RaisedButton
    primary={true}
    label="Add More People"
    onClick={addEntry}
  />
);

export default AddEntryButton;