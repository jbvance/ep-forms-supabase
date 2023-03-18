import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { apiRequestFile } from 'util/util';
import supabase from 'util/supabase';

const TestDocx = () => {
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session ? session.access_token : undefined;
      console.log(accessToken);
    };
    getSession();
  }, []);
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
