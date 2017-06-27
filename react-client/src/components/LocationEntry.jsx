import React from 'react';
import ReactDOM from 'react-dom';

const LocationEntry = (props) => (
  <div> 
    <input type="text" name={props.index} placeholder="Address" onChange={props.onChange}/> <br/>
  </div>
);

export default LocationEntry;