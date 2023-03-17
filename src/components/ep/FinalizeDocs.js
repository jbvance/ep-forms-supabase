import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import FormAlert from 'components/FormAlert';
import { useSelector } from 'react-redux';
import { apiRequestFile } from 'util/util';

const FinalizeDocs = (props) => {
  const [responseError, setResponseError] = useState(null);
  const docsToCreate = useSelector((state) => state.selectedProducts.products);
  console.log('CREATING', docsToCreate);
  const callApi = async (values, type) => {
    try {
      let response;
      if (!docsToCreate.includes(type)) {
        return;
      }
      if (docsToCreate.includes(type)) {
        response = await apiRequestFile(`/docx/tx-${type}`, 'POST', {
          ...values.clientInfo,
          ...values[type],
        });
      }
      console.log('RESPONSE', response);
      if (response.status !== 'success') {
        throw new Error(`Unable to create ${type}`);
      }
    } catch (err) {
      console.log('ERROR111', err);
      throw new Error(err.message);
    }
  };
  const wizardState = useSelector((state) => state);
  //console.log(wizardState);

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(wizardState);
    try {
      setResponseError(null);
      await callApi(wizardState, 'mpoa');
      await callApi(wizardState, 'dpoa');
    } catch (err) {
      console.log('ERROR', err);
      setResponseError('Unable to create your documents');
    }
  };

  return (
    <Fragment>
      {responseError && <FormAlert type="error" message={responseError} />}
      <Form id={props.id} onSubmit={submitForm}></Form>
    </Fragment>
  );
};

export default FinalizeDocs;
