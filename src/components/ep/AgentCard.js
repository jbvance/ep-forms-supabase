import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
//import { useUserContacts } from 'hooks/useUserContacts';
import {
  Trash,
  Pencil,
  ArrowDownCircleFill,
  ArrowUpCircleFill,
} from 'react-bootstrap-icons';

const AgentCard = ({
  agent,
  onAgentChanged,
  onRemoveAgent,
  onEditAgent,
  showDownArrow = false,
  showUpArrow = false,
  onMoveAgentUp,
  onMoveAgentDown,
}) => {
  //console.log('AGENT', agent);
  return (
    <React.Fragment>
      <Row
        style={{ borderBottom: '2px solid var(--gray)', paddingBottom: '20px' }}
      >
        <Col md={12}>
          <Card style={{ marginBottom: '10px' }}>
            <Card.Body>
              <Card.Title>{agent.full_name}</Card.Title>
              <Card.Text>{agent.address}</Card.Text>
              <Card.Text>{agent.phone}</Card.Text>
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
              {showUpArrow && (
                <div style={{ position: 'absolute', top: '35%', right: 15 }}>
                  <ArrowUpCircleFill
                    onClick={onMoveAgentUp}
                    size={20}
                    title={'Move up'}
                    cursor="pointer"
                    color={'var(--blue)'}
                  />
                </div>
              )}
              {showDownArrow && (
                <div style={{ position: 'absolute', bottom: '35%', right: 15 }}>
                  <ArrowDownCircleFill
                    onClick={onMoveAgentDown}
                    size={20}
                    title={'Move down'}
                    cursor="pointer"
                    color={'var(--blue)'}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AgentCard;
