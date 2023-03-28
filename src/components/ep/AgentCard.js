import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useUserContacts } from 'hooks/useUserContacts';
import { Trash } from 'react-bootstrap-icons';

const AgentCard = ({ agent, onAgentChanged, onRemoveAgent }) => {
  const { userContacts, userContactsStatus, userContactsError } =
    useUserContacts();
  if (userContactsStatus === 'loading') {
    return <div>Loading...</div>;
  }
  return (
    <React.Fragment>
      {/*
      <Row>
        <Col md={6}>
          
           <select
            style={{ margin: '10px 0' }}
            name={`userContacts-${agent.id}`}
            onChange={onAgentChanged}
            defaultValue={agent.id.toString()}
          >
            {userContacts.map((uc) => {
              return (
                <option key={uc.id} value={uc.id}>
                  {uc.full_name}
                </option>
              );
            })}
          </select>
          
        </Col>
      </Row>
          */}
      <Row
        style={{ borderBottom: '2px solid var(--gray)', paddingBottom: '20px' }}
      >
        <Col md={9}>
          <Card style={{ marginBottom: '10px' }}>
            <Card.Body>
              <Trash
                className="DeleteButton"
                width="24"
                height="24"
                onClick={onRemoveAgent}
              />
              {/* <div style={{ position: 'absolute', top: 0, right: 0 }}>
                {' '}
                <Button
                  className="pull-right"
                  variant="danger"
                  onClick={onRemoveAgent}
                >
                  Remove
                </Button>
        </div>*/}
              <Card.Title>{agent.fullName}</Card.Title>
              <Card.Text>{agent.address}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AgentCard;
