import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const NotifyFriendsButton = ({notifyFriends}) => (
  <RaisedButton
    label="Notify Friends"
    onClick={notifyFriends}
  />
);

export default NotifyFriendsButton;