import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from 'util/supabase';
import { useAuth } from 'util/auth';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PoaHeader from './PoaHeader';
//import { useUserContacts } from 'hooks/useUserContacts';
import { setDpoaValues, dpoaActions } from '../../store/dpoaSlice';
import AgentCard from './AgentCard';
import AddAgentForm from './AddAgentForm';
import { FormContext } from 'context/formContext';
import { useContactsByUser } from 'util/db';
import EditContactModal from './EditContactModal';
import FormAlert from 'components/FormAlert';

const DurablePoaForm = (props) => {
  const dispatch = useDispatch();
  const [updateError, setUpdateError] = useState(null);
  const dpoaState = useSelector((state) => state.dpoa);
  const agents = dpoaState.agents;
  const noAgents = !dpoaState.agents || dpoaState.agents.length === 0;
  const auth = useAuth();
  const userId = auth.user.id;
  //const { userContacts } = useUserContacts();
  const [addAgentMode, setAddAgentMode] = useState(false);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);
  const [contactIdToEdit, setContactIdToEdit] = useState(null);

  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(userId);

  const submitForm = async (e) => {
    e.preventDefault();
    console.log('submitting');
    console.log(dpoaState);
    try {
      // set initialDpoaState before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(dpoaActions.setDpoaStatus('loading'));
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
          { user_id: userId, json_value: JSON.stringify(dpoaState) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error('Unable to update MPOA Data');
      }
      // Change wizard step
      setStepIndex(activeStepIndex + 1);
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update data at the current time. Please try again.'
      );
    } finally {
      dispatch(dpoaActions.setDpoaStatus('idle'));
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        dispatch(dpoaActions.setDpoaStatus('loading'));
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        //console.log('USER', userData.user);
        // Set initial state if user found in database
        const { data: dpoaData, error: dpoaError } = await supabase
          .from('dpoa')
          .select('json_value')
          .eq('user_id', userData.user.id);
        if (dpoaData && dpoaData.length > 0) {
          dispatch(
            dpoaActions.setDpoaValues(JSON.parse(dpoaData[0].json_value))
          );
        }
        if (dpoaError) {
          console.log('DPOA ERROR', dpoaError);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(dpoaActions.setDpoaStatus('idle'));
      }
    };
    getUserInfo();
  }, [dispatch]);

  // useEffect(() => {
  //   console.log('USER CONTACTS', userContacts);
  // }, [userContacts]);

  //console.log('DPOASTATE', dpoaState);
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
                dispatch(dpoaActions.removeAgent(a));
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
            dispatch(dpoaActions.addAgent(contact));
            setAddAgentMode(false);
          }}
          onAgentSelected={(e) => {
            //console.log('CLICKED', e.target.value, userContacts);
            const contactToAdd = ucData.find((uc) => uc.id == e.target.value);
            //console.log('CTA', contactToAdd);
            dispatch(
              dpoaActions.addAgent({
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
            console.log(contact);
            if (contact) {
              dispatch(dpoaActions.updateAgent(contact));
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
