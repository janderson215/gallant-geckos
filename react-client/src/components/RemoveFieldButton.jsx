import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

const RemoveEntryButton = ({removeEntry}) => (
  <RaisedButton
    label="Remove"
    onClick={removeEntry} />
);

export default RemoveEntryButton;