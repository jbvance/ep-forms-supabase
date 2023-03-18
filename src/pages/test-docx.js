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
    fetch('http://localhost:8080/api/docx/zipper')
      .then((response) => {
        response.blob().then((blob) => download(blob, 'TestZip.zip'));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function download(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

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
