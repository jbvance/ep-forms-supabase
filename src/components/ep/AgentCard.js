import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
//import { useUserContacts } from 'hooks/useUserContacts';
import { Trash, Pencil } from 'react-bootstrap-icons';

const AgentCard = ({ agent, onAgentChanged, onRemoveAgent, onEditAgent }) => {
  return (
    <React.Fragment>
      <Row
        style={{ borderBottom: '2px solid var(--gray)', paddingBottom: '20px' }}
      >
        <Col md={9}>
          <Card style={{ marginBottom: '10px' }}>
            <Card.Body>
              <Card.Title>{agent.fullName}</Card.Title>
              <Card.Text>{agent.address}</Card.Text>
              <Card.Text>
                <Trash
                  width="24"
                  height="24"
                  onClick={onRemoveAgent}
                  className="DeleteIcon"
                />
                <Pencil
                  width="24"
                  height="24"
                  onClick={onEditAgent}
                  className="EditIcon"
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AgentCard;
