import React from 'react';
import Phone, {isValidPhoneNumber} from 'react-phone-number-input';
import rrui from 'react-phone-number-input/rrui.css';
import rpni from 'react-phone-number-input/style.css';

const PhoneNumberField = ({i, value, onChange}) => (
  <Phone
    className="phone"
    placeholder={`Phone Number #${i + 1}`}
    onChange={onChange}
    value={value}
    country="US"
    />
);

export default PhoneNumberField;