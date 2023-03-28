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
import { useUserContacts } from 'hooks/useUserContacts';
import { setDpoaValues, dpoaActions } from '../../store/dpoaSlice';
import AgentCard from './AgentCard';
import AddAgentForm from './AddAgentForm';
import { FormContext } from 'context/formContext';

const DurablePoaForm = (props) => {
  const dispatch = useDispatch();
  const dpoaState = useSelector((state) => state.dpoa);
  const agents = dpoaState.agents;
  const noAgents = !dpoaState.agents || dpoaState.agents.length === 0;
  const auth = useAuth();
  const userId = auth.user.id;
  const { userContacts } = useUserContacts();
  const [addAgentMode, setAddAgentMode] = useState(false);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);

  const submitForm = (e) => {
    e.preventDefault();
    console.log('submitting');
    setStepIndex(activeStepIndex + 1);
  };

  useEffect(() => {
    console.log('USER CONTACTS', userContacts);
  }, [userContacts]);

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
        //console.log(a);
        return (
          <React.Fragment key={a.id}>
            <Row className="AgentHeader">
              <Col md={6}>Agent No. {index + 1}</Col>
            </Row>
            <AgentCard
              agent={a}
              onAgentChanged={() => console.log('INDEX', index)}
              onRemoveAgent={() => {
                console.log('REMOVING AGENT', a);
                dispatch(dpoaActions.removeAgent(a));
              }}
            />
          </React.Fragment>
        );
      })}
      {addAgentMode && (
        <AddAgentForm
          onCancelAdd={() => setAddAgentMode(false)}
          onAgentSelected={(e) => {
            console.log('CLICKED', e.target.value, userContacts);
            const contactToAdd = userContacts.find(
              (uc) => uc.id == e.target.value
            );
            console.log('CTA', contactToAdd);
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
      <form onSubmit={submitForm} id={props.id}></form>
    </Container>
  );
};

export default DurablePoaForm;
