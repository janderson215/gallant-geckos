import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const notifyPartiesButton = ({notifyParties}) => (
  <RaisedButton
    label="Notify Parties"
    onClick={notifyParties}
  />
);

export default notifyPartiesButton;