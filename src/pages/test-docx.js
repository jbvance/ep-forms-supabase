import React from 'react';
import { Button } from 'react-bootstrap';
import { apiRequestFile } from 'util/util';

const TestDocx = () => {
  const callApi = () => {
    apiRequestFile('/docx/tx-directive', 'POST', {
      firstName: 'Jason',
      middleName: '',
      lastName: 'Vance',
      city: 'Katy',
      county: 'Harris',
    });
  };
  return <Button onClick={() => callApi()}>Test</Button>;
};

export default TestDocx;
