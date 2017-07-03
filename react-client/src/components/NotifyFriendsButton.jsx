import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const notifyPartiesButton = ({notifyParties}) => (
  <RaisedButton
    label="Notify Friends"
    onClick={notifyParties}
  />
);

export default notifyPartiesButton;