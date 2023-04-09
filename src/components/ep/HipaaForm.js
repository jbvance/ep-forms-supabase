import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hipaaActions as poaActions, initialState } from 'store/hipaaSlice';
import { FormContext } from 'context/formContext';
import PoaAgents from './PoaAgents';
import useFormErrors from 'hooks/useFormErrors';
import PoaHeader from './PoaHeader';
import FormAlert from 'components/FormAlert';
import supabase from 'util/supabase';
import useInitialState from 'hooks/useInitialState';
import { errorsActions } from 'store/errorsSlice';
import { isProductSelected } from 'util/util';

const HipaaForm = (props) => {
  const [updateError, setUpdateError] = useState(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state['hipaa']);
  const wizardErrors = useSelector((state) => state['wizardErrors']);
  const agents = state['agents'];
  const userIdForUpdate = useSelector(
    (state) => state.clientInfo.userIdForUpdate
  );
  const { activeStepIndex, setStepIndex, addStepToCrumbs } =
    useContext(FormContext);

  const selectedProducts = useSelector(
    (state) => state.selectedProducts.products
  );
  // If this product is not in the list of selected ones, set a flag here so
  // it does not mount
  const productIsSelected = isProductSelected(selectedProducts, 'hipaa');

  const { getInitialState, stateLoading, stateError } = useInitialState(
    'hipaa',
    poaActions,
    userIdForUpdate,
    initialState
  );

  const {
    formErrors,
    setFormErrors,
    formTouched,
    setFormTouched,
    validateForm,
    listErrors,
  } = useFormErrors();

  // Load state when component mounts
  useEffect(() => {
    if (!productIsSelected) {
      return;
    }
    addStepToCrumbs(activeStepIndex);
    getInitialState();
  }, []);

  useEffect(() => {
    if (!productIsSelected) {
      return;
    }
    // If no agents selected yet, set error
    if (!agents || agents.length === 0) {
      dispatch(
        errorsActions.updateErrors({
          type: 'hipaa',
          key: 'agents',
          value: 'Please select at least one agent',
        })
      );
    } else if ('agents' in wizardErrors['hipaa']) {
      dispatch(
        errorsActions.removeError({
          type: 'hipaa',
          key: 'agents',
        })
      );
    }
  }, [agents]);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormTouched(true);
    if (!validateForm(wizardErrors['hipaa'])) {
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
        .from('hipaa')
        .upsert(
          { user_id: userIdForUpdate, json_value: JSON.stringify(state) },
          { onConflict: 'user_id' }
        )
        .select();
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
        headerText="HIPAA Release and Authorization"
        paragraphText="Enter the information below to complete your HIPAA Release and Authorization form"
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
      <PoaAgents poaType="hipaa" agents={agents} />
      <Row>
        <Col>
          {' '}
          {updateError && <FormAlert type="error" message={updateError} />}
        </Col>
      </Row>

      <Row>
        <Col>
          {wizardErrors['hipaa'] &&
            Object.keys(wizardErrors['hipaa']).length > 0 &&
            formTouched &&
            listErrors(wizardErrors['hipaa'])}
        </Col>
      </Row>
      <form onSubmit={submitForm} id={props.id}></form>
    </Container>
  );
};

export default HipaaForm;
