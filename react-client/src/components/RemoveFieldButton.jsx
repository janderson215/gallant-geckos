import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const RemoveEntryButton = ({removeEntry}) => (
  <RaisedButton
    secondary={true}
    label="Remove"
    onClick={removeEntry} />
);

export default RemoveEntryButton;