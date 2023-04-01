import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from 'util/supabase';
import { useAuth } from 'util/auth';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PoaHeader from './PoaHeader';
import { dpoaActions as poaActions } from '../../store/dpoaSlice';
import AgentCard from './AgentCard';
import AddAgentForm from './AddAgentForm';
import { FormContext } from 'context/formContext';
import { useContactsByUser } from 'util/db';
import EditContactModal from './EditContactModal';
import FormAlert from 'components/FormAlert';
import { updateAllAgentsForContactChange } from 'store/util';
import { hipaaActions } from 'store/hipaaSlice';
import { mpoaActions } from 'store/mpoaSlice';
import useFormErrors from '../../hooks/useFormErrors';

const DurablePoaForm = (props) => {
  const dispatch = useDispatch();
  const [updateError, setUpdateError] = useState(null);
  const state = useSelector((state) => state['dpoa']);
  const agents = state['agents'];
  const noAgents = !state.agents || state.agents.length === 0;
  const auth = useAuth();
  const userId = auth.user.id;
  //const { userContacts } = useUserContacts();
  const [addAgentMode, setAddAgentMode] = useState(false);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);
  const [contactIdToEdit, setContactIdToEdit] = useState(null);
  const {
    formErrors,
    setFormErrors,
    formTouched,
    setFormTouched,
    validateForm,
    listErrors,
  } = useFormErrors();

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // If no agents selected yet, set error
    if (!agents || agents.length === 0) {
      setFormErrors({
        ...formErrors,
        agents: 'Please add at least one agent',
      });
    } else if ('agents' in formErrors) {
      const newFormErrors = { ...formErrors };
      delete newFormErrors.agents;
      setFormErrors({ ...newFormErrors });
    }
  }, [agents]);

  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(userId);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormTouched(true);
    ``;
    if (!validateForm()) {
      return;
    }
    try {
      // set initialDpoaState before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(poaActions['setDpoaStatus']('loading'));
      setUpdateError(null);
      let userId = null;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userData) {
        userId = userData.user.id;
      }
      if (userError) {
        console.log('USER ERROR IN DPOA', userError);
      }
      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for dpoa Table on supabase
      const { error } = await supabase
        .from('dpoa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(state) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error('Unable to update DPOA Data');
      }
      // Change wizard step
      setStepIndex(activeStepIndex + 1);
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update data at the current time. Please try again.'
      );
    } finally {
      dispatch(poaActions['setDpoaStatus']('idle'));
    }
  };

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
      {noAgents && (
        <div>
          You have not selected any agents. Click "Add Agent" to get started.
        </div>
      )}
      {agents.map((a, index) => {
        return (
          <React.Fragment key={a.id}>
            <Row className="AgentHeader">
              <Col md={6}>Agent No. {index + 1}</Col>
            </Row>
            <AgentCard
              agent={a}
              onAgentChanged={() => console.log('INDEX', index)}
              onRemoveAgent={() => {
                dispatch(poaActions.removeAgent(a));
              }}
              onEditAgent={() => {
                setContactIdToEdit(a.id);
              }}
            />
          </React.Fragment>
        );
      })}
      {addAgentMode && (
        <AddAgentForm
          onCancelAdd={() => setAddAgentMode(false)}
          onAddAgent={(contact) => {
            dispatch(poaActions.addAgent(contact));
            setAddAgentMode(false);
          }}
          onAgentSelected={(e) => {
            const contactToAdd = ucData.find((uc) => uc.id == e.target.value);
            dispatch(
              poaActions.addAgent({
                ...contactToAdd,
                fullName: contactToAdd['full_name'],
              })
            );
            setAddAgentMode(false);
          }}
        />
      )}
      {!addAgentMode && (
        <Row style={{ margin: '20px 0' }}>
          <Col md={3}>
            <Button variant="success" onClick={() => setAddAgentMode(true)}>
              Add Agent
            </Button>
          </Col>
        </Row>
      )}

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

      {contactIdToEdit && (
        <EditContactModal
          id={contactIdToEdit}
          onDone={(contact) => {
            if (contact) {
              // Update state in other docs to reflect change to contact
              dispatch(poaActions.updateAgent(contact));
              dispatch(mpoaActions.updateAgent(contact));
              dispatch(hipaaActions.updateAgent(contact));
            }
            setContactIdToEdit(null);
          }}
        />
      )}

      <form onSubmit={submitForm} id={props.id}></form>
    </Container>
  );
};

export default DurablePoaForm;
