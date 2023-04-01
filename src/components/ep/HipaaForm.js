import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hipaaActions as poaActions } from 'store/hipaaSlice';
import { FormContext } from 'context/formContext';
import PoaAgents from './PoaAgents';
import useFormErrors from 'hooks/useFormErrors';
import PoaHeader from './PoaHeader';
import FormAlert from 'components/FormAlert';
import supabase from 'util/supabase';

const DurablePoaForm = (props) => {
  const [updateError, setUpdateError] = useState(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state['hipaa']);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);

  const {
    formErrors,
    setFormErrors,
    formTouched,
    setFormTouched,
    validateForm,
    listErrors,
  } = useFormErrors();

  const submitForm = async (e) => {
    e.preventDefault();
    setFormTouched(true);
    if (!validateForm()) {
      return;
    }
    try {
      // set initial state before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(poaActions['setStatus']('loading'));
      setUpdateError(null);
      let userId = null;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userData) {
        userId = userData.user.id;
      }
      if (userError) {
        console.log(`USER ERROR IN HIPAA`, userError);
      }

      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for table on supabase
      const { error } = await supabase
        .from('hipaa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(state) },
          { onConflict: 'user_id' }
        )
        .select();
      console.log('GOT HERE$>>>>>>>>>>');
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error(`Unable to update HIPAA data`);
      }
      // Change wizard step
      setStepIndex(activeStepIndex + 1);
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update data at the current time. Please try again.'
      );
    } finally {
      dispatch(poaActions['setStatus']('idle'));
    }
  };

  return (
    <Container>
      <PoaHeader
        headerText="HIPAA Release and Authorization"
        paragraphText="Enter the information below to complete your Statutory Durable Power of Attorney"
      />
      <Row>
        <Col>
          <p className="PoaLabelText">
            Who will serve as your Agent? Add one or more Agents below (to serve
            in the order listed). This document will provide you named agents
            with access to your medical records.
          </p>
        </Col>
      </Row>
      <PoaAgents poaType="hipaa" />
      <Row>
        <Col>
          {' '}
          {updateError && <FormAlert type="error" message={updateError} />}
        </Col>
      </Row>

      <Row>
        <Col>
          {' '}
          {formErrors && Object.keys(formErrors).length > 0 && formTouched && (
            <FormAlert type="error" message={listErrors()} />
          )}
        </Col>
      </Row>
      <form onSubmit={submitForm} id={props.id}></form>
    </Container>
  );
};

export default DurablePoaForm;
