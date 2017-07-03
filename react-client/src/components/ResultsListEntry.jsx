import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../app.css';

const ResultsListEntry = (props) => (
  <div className="recommended-place">
    <div className="info-left recommended-name"
      onClick={() => props.handleSelectResult(props.recommendedPlace)}>
      {props.recommendedPlace.name}
    </div>
    <div className="info-left recommended-address"
      onClick={() => props.handleSelectResult(props.recommendedPlace)}>
      {props.recommendedPlace.address}
    </div>
    <img className="media-right recommended-image" 
      onClick={() => props.handleSelectResult(props.recommendedPlace)}
      src={props.recommendedPlace.photo_url}
    />
  </div>
);

export default ResultsListEntry;