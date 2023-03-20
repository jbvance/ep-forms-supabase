import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap';
import FormAlert from 'components/FormAlert';
import { useSelector } from 'react-redux';
import { apiRequestFile } from 'util/util';

const FinalizeDocs = (props) => {
  const [responseError, setResponseError] = useState(null);
  const [isSaving, setIsSaving] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);
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
      console.log('ERROR CREATING DOCMENTS', err);
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
      setIsSaving(true);
      await callApi(wizardState, 'mpoa');
      await callApi(wizardState, 'dpoa');
      setCreateStatus('success');
    } catch (err) {
      console.log('ERROR', err);
      setResponseError(
        'Unable to create your documents. Please try again. If the problem persists, please wait a few minutes between attempts.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Fragment>
      <Container>
        <Row>
          <Col>
            <h4>
              You are almost done. Click 'Submit' to create your documents!
            </h4>
          </Col>
        </Row>
        {isSaving && (
          <Row>
            <Col>
              <FormAlert
                type="success"
                message="Creating your documents. Please do not navigate away from this page until the process is complete."
              />
            </Col>
          </Row>
        )}
        {!isSaving && responseError && (
          <Row>
            {responseError && (
              <FormAlert type="error" message={responseError} />
            )}
          </Row>
        )}
        {createStatus === 'success' && (
          <Row>
            <Col>
              <FormAlert
                type="success"
                message="Your document(s) have been created successfully!"
              />
            </Col>
          </Row>
        )}
      </Container>

      <Form id={props.id} onSubmit={submitForm}></Form>
    </Fragment>
  );
};

export default FinalizeDocs;
