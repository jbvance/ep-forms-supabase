import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { mpoaActions as poaActions } from 'store/mpoaSlice';
import { FormContext } from 'context/formContext';
import PoaAgents from './PoaAgents';
import useFormErrors from 'hooks/useFormErrors';
import PoaHeader from './PoaHeader';
import FormAlert from 'components/FormAlert';
import supabase from 'util/supabase';

const MedicalPoaForm = (props) => {
  const [updateError, setUpdateError] = useState(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state['mpoa']);
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
        console.log(`USER ERROR IN MPOA`, userError);
      }

      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for table on supabase
      const { error } = await supabase
        .from('mpoa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(state) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error(`Unable to update MPOA data`);
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
        headerText="Medical Power of Attorney"
        paragraphText="Enter the information below to complete your Statutory Durable Power of Attorney"
      />
      <Row>
        <Col>
          <p className="PoaLabelText">
            Who will serve as your Agent? Add one or more Agents below (to serve
            in the order listed). Your agent will make decisions regarding your
            medical care if you are incapacitated.
          </p>
        </Col>
      </Row>
      <PoaAgents poaType="mpoa" />
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

export default MedicalPoaForm;
