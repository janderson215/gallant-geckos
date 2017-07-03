import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const AddEntryButton = ({addEntry}) => (
  <RaisedButton
    label="Add More People"
    onClick={addEntry}
  />
);

export default AddEntryButton;