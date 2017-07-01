import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../app.css';
import ResultsListEntry from './ResultsListEntry.jsx';

const ResultsList = (props) => (
  <div className="recommended-list">
    {props.recommendedPlaces.map((recommendedPlace) =>
      <ResultsListEntry recommendedPlace={recommendedPlace}
                        handleSelectResult={props.handleSelectResult}
                        key={recommendedPlace.id}
      />
    )}
  </div>
);

export default ResultsList;