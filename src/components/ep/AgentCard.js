import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
//import { useUserContacts } from 'hooks/useUserContacts';
import {
  Trash,
  Pencil,
  ArrowDownCircleFill,
  ArrowUpCircleFill,
  XCircleFill,
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
      <Row className="AgentCardRow">
        <Col md={12}>
          <Card className="AgentCard">
            <Card.Body>
              <Card.Title>{agent.full_name}</Card.Title>
              <Card.Text>{agent.address}</Card.Text>
              <Card.Text>{agent.phone}</Card.Text>
              <Card.Text>
                <XCircleFill
                  title="Remove agent from list"
                  width="24"
                  height="24"
                  onClick={onRemoveAgent}
                  className="DeleteIcon"
                />
                <Pencil
                  width="24"
                  height="24"
                  title="Edit contact information for agent"
                  onClick={onEditAgent}
                  className="EditIcon"
                />
              </Card.Text>
              {showUpArrow && (
                <div style={{ position: 'absolute', top: '35%', right: 15 }}>
                  <ArrowUpCircleFill
                    className="MoveAgentButton"
                    onClick={onMoveAgentUp}
                    size={24}
                    title={'Move agent up one posistion'}
                    cursor="pointer"
                  />
                </div>
              )}
              {showDownArrow && (
                <div style={{ position: 'absolute', bottom: '35%', right: 15 }}>
                  <ArrowDownCircleFill
                    className="MoveAgentButton"
                    onClick={onMoveAgentDown}
                    size={24}
                    title={'Move agent down one position'}
                    cursor="pointer"
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
