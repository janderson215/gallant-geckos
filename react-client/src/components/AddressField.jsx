import React from 'react';
import Geosuggest from 'react-geosuggest';

const AddressField = ({i, onChange, onSuggestSelect, initialValue}) => (
  <Geosuggest
    placeholder={`Address #${i + 1}`}
    onChange={onChange}
    onSuggestSelect={onSuggestSelect}
    initialValue={initialValue} />
);

export default AddressField;



