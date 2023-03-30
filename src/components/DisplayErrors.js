import React from 'react';
import { Alert } from 'react-bootstrap';

const DisplayErrors = ({ errors }) => {
  console.log('ERRORS', errors);
  let returnArr = [];
  for (const key in errors) {
    console.log(`${errors[key]}`);
    if (errors[key]) {
      returnArr.push(<li key={key}>{errors[key]}</li>);
    }
  }
  console.log(returnArr);
  return (
    <Alert variant="danger">
      <ul>{returnArr}</ul>
    </Alert>
  );
};

export default DisplayErrors;
