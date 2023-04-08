import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dpoaActions as poaActions, dpoaInitialState } from 'store/dpoaSlice';
import { FormContext } from 'context/formContext';
import PoaAgents from './PoaAgents';
import useFormErrors from 'hooks/useFormErrors';
import PoaHeader from './PoaHeader';
import FormAlert from 'components/FormAlert';
import supabase from 'util/supabase';
import useInitialState from 'hooks/useInitialState';

const DurablePoaForm = (props) => {
  const [updateError, setUpdateError] = useState(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state['dpoa']);
  const userIdForUpdate = useSelector(
    (state) => state.clientInfo.userIdForUpdate
  );
  const agents = state['agents'];
  const { activeStepIndex, setStepIndex, wizardErrors, setWizardErrors } =
    useContext(FormContext);
  const { getInitialState, stateLoading, stateError } = useInitialState(
    'dpoa',
    poaActions,
    userIdForUpdate,
    dpoaInitialState
  );

  const {
    formErrors,
    setFormErrors,
    formTouched,
    setFormTouched,
    validateForm,
    listErrors,
  } = useFormErrors();

  useEffect(() => {
    console.log('WIZARD ERRORS', wizardErrors);
  });
  // Load state when component mounts
  useEffect(() => {
    getInitialState();
  }, []);

  useEffect(() => {
    // If no agents selected yet, set error
    if (!agents || agents.length === 0) {
      setFormErrors({
        ...formErrors,
        agents: 'Please add at least one agent',
      });
      setWizardErrors({
        ...wizardErrors,
        dpoa: {
          agents: 'Please add at least one agent',
        },
      });
    } else if ('agents' in formErrors) {
      const newFormErrors = { ...formErrors };
      delete newFormErrors.agents;
      setFormErrors({ ...newFormErrors });
      if (wizardErrors['dpoa'] && wizardErrors['dpoa']['agents']) {
        setWizardErrors({ ...wizardErrors });
      }
    }
  }, [agents]);

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

      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for table on supabase
      const { error } = await supabase
        .from('dpoa')
        .upsert(
          { user_id: userIdForUpdate, json_value: JSON.stringify(state) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error(`Unable to update DPOA data`);
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

  if (stateLoading) {
    return (
      <Spinner animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (stateError) {
    return <FormAlert type="error" message={stateError} />;
  }

  return (
    <Container>
      <PoaHeader
        headerText="Statutory Durable Power of Attorney"
        paragraphText="Enter the information below to complete your Statutory Durable Power of Attorney"
      />
      <Row>
        <Col>
          <p className="PoaLabelText">
            Who will serve as your Agent? Add one or more Agents below (to serve
            in the order listed). Your agent will make legal and financial
            decisions on your behalf.
          </p>
        </Col>
      </Row>
      <PoaAgents agents={agents} poaType="dpoa" />
      <Row>
        <Col>
          {updateError && <FormAlert type="error" message={updateError} />}
        </Col>
      </Row>

      <Row>
        <Col>
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
