import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'util/auth';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AgentCard from './AgentCard';
import AddAgentForm from './AddAgentForm';
import { useContactsByUser } from 'util/db';
import EditContactModal from './EditContactModal';
import { updateAllAgentsForContactChange } from 'store/util';
import { dpoaActions } from '../../store/dpoaSlice';
import { hipaaActions } from 'store/hipaaSlice';
import { mpoaActions } from 'store/mpoaSlice';
import useFormErrors from '../../hooks/useFormErrors';
import { Spinner } from 'react-bootstrap';

const PoaAgents = ({ poaType, agents }) => {
  const dispatch = useDispatch();
  // const state = useSelector((state) => state[poaType]);
  // const agents = state['agents'];
  const noAgents = !agents || agents.length === 0;
  const auth = useAuth();
  const userId = auth.user.id;
  const [addAgentMode, setAddAgentMode] = useState(false);
  const [contactIdToEdit, setContactIdToEdit] = useState(null);
  const { formErrors, setFormErrors } = useFormErrors();

  let poaActions;
  switch (poaType) {
    case 'dpoa':
      poaActions = { ...dpoaActions };
      break;
    case 'mpoa':
      poaActions = { ...mpoaActions };
      break;
    case 'hipaa':
      poaActions = { ...hipaaActions };
      break;
    default:
      poaActions = null;
  }

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   // If no agents selected yet, set error
  //   if (!agents || agents.length === 0) {
  //     setFormErrors({
  //       ...formErrors,
  //       agents: 'Please add at least one agent',
  //     });
  //   } else if ('agents' in formErrors) {
  //     const newFormErrors = { ...formErrors };
  //     delete newFormErrors.agents;
  //     setFormErrors({ ...newFormErrors });
  //   }
  // }, [agents]);

  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(userId);

  const moveAgent = (oldIndex, newIndex) => {
    dispatch(
      poaActions.moveAgent({
        oldIndex,
        newIndex,
      })
    );
  };

  if (ucIsLoading) {
    return (
      <Spinner animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container>
      {noAgents && (
        <div>
          You have not selected any agents. Click "Add Agent" to get started.
        </div>
      )}
      {agents &&
        agents.map((a, index) => {
          return (
            <React.Fragment key={a.id}>
              <Row className="AgentHeader">
                <Col md={6}>Agent No. {index + 1}</Col>
              </Row>
              <AgentCard
                showDownArrow={index < agents.length - 1}
                showUpArrow={index > 0}
                agent={ucData.find((uc) => uc.id == a.id)}
                onMoveAgentUp={() => moveAgent(index, index - 1)}
                onMoveAgentDown={() => moveAgent(index, index + 1)}
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
            dispatch(poaActions.addAgent({ id: contact.id }));
            setAddAgentMode(false);
          }}
          onAgentSelected={(e) => {
            const contactToAdd = ucData.find((uc) => uc.id == e.target.value);
            dispatch(
              poaActions.addAgent({
                id: contactToAdd.id,
                //...contactToAdd,
                //fullName: contactToAdd['full_name'],
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

      {contactIdToEdit && (
        <EditContactModal
          id={contactIdToEdit}
          onDone={(contact) => {
            if (contact) {
              dispatch(poaActions.addAgent({ id: contact.id }));
              // Update state in other docs to reflect change to contact
              //dispatch(dpoaActions.updateAgent(contact));
              //dispatch(mpoaActions.updateAgent(contact));
              //dispatch(hipaaActions.updateAgent(contact));
            }
            setContactIdToEdit(null);
          }}
        />
      )}
    </Container>
  );
};

export default PoaAgents;
