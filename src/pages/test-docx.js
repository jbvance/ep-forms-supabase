import React from 'react';
import { Button } from 'react-bootstrap';
import { apiRequestFile } from 'util/util';

const TestDocx = () => {
  const callApi = () => {
    apiRequestFile('/docx/tx-directive', 'POST', {
      clientName: 'Jason Vance',
      clientCity: 'Katy',
      clientCounty: 'Harris',
    });
  };
  return <Button onClick={() => callApi()}>Test</Button>;
};

export default TestDocx;
