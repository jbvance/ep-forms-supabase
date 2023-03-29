import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from 'util/supabase';
import { useAuth } from 'util/auth';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PoaHeader from './PoaHeader';
import { hipaaActions as poaActions } from 'store/hipaaSlice';
import AgentCard from './AgentCard';
import AddAgentForm from './AddAgentForm';
import { FormContext } from 'context/formContext';
import { useContactsByUser } from 'util/db';
import EditContactModal from './EditContactModal';
import FormAlert from 'components/FormAlert';
import { updateAllAgentsForContactChange } from 'store/util';
import { dpoaActions } from 'store/dpoaSlice';
import { mpoaActions } from 'store/mpoaSlice';

const HipaaForm = (props) => {
  const dispatch = useDispatch();
  const [updateError, setUpdateError] = useState(null);
  const state = useSelector((state) => state.hipaa);
  const agents = state['agents'];
  const noAgents = !state.agents || state.agents.length === 0;
  const auth = useAuth();
  const userId = auth.user.id;
  //const { userContacts } = useUserContacts();
  const [addAgentMode, setAddAgentMode] = useState(false);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);
  const [contactIdToEdit, setContactIdToEdit] = useState(null);

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(userId);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // set initial state before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(poaActions.setHipaaStatus('loading'));
      setUpdateError(null);
      let userId = null;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userData) {
        userId = userData.user.id;
      }
      if (userError) {
        console.log('USER ERROR IN HIPAA', userError);
      }
      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for hipaa Table on supabase
      const { error } = await supabase
        .from('hipaa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(state) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error('Unable to update HIPAA Data');
      }
      // Change wizard step
      setStepIndex(activeStepIndex + 1);
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update data at the current time. Please try again.'
      );
    } finally {
      dispatch(poaActions.setHipaaStatus('idle'));
    }
  };

  return (
    <Container>
      <PoaHeader
        headerText="Hipaa Release and Authorization"
        paragraphText="Enter the information below to complete your Hipaa Release and Authorizzation. This document will allow your agents to have access to your protected health information, such as your medical records"
      />
      <Row>
        <Col>
          <p className="PoaLabelText">
            Who will serve as your Agent? Add one or more Agents below (to serve
            in the order listed). Your agents will all have access to your
            medical records and other protected health information.
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

      {contactIdToEdit && (
        <EditContactModal
          id={contactIdToEdit}
          onDone={(contact) => {
            console.log('CONTACT', contact);
            if (contact) {
              //updateAllAgentsForContactChange(dispatch(contact));
              dispatch(poaActions.updateAgent(contact));
              dispatch(dpoaActions.updateAgent(contact));
              dispatch(mpoaActions.updateAgent(contact));
            }
            setContactIdToEdit(null);
          }}
        />
      )}

      <form onSubmit={submitForm} id={props.id}></form>
    </Container>
  );
};

export default HipaaForm;
