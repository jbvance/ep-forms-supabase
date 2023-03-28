import React, { useState, useEffect } from 'react';
import { Spinner, Row, Col, Button } from 'react-bootstrap';
import { PersonFillAdd } from 'react-bootstrap-icons';
import EditContactModal from './EditContactModal';
import { useContactsByUser } from 'util/db';
import { useAuth } from 'util/auth';

const AddAgentForm = ({ onAgentSelected, onCancelAdd, onAddAgent }) => {
  const [creatingContact, setCreatingContact] = useState(false);
  const auth = useAuth();
  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(auth.user.id);

  if (ucIsLoading) {
    return (
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className="AddAgentForm">
      <h5>Select a contact to add as an agent</h5>
      <Row>
        <Col>
          <span
            className="CreateAgentLink"
            onClick={() => setCreatingContact(true)}
          >
            Contact not listed? Create a new contact{' '}
            <PersonFillAdd color="#007bff" />
          </span>
        </Col>
      </Row>
      <Row style={{ margin: '0 0 20px 0' }}>
        <select
          name="userContacts"
          style={{ width: '300px' }}
          onChange={onAgentSelected}
        >
          <option value="">Select an agent</option>
          {ucData.map((uc) => {
            return (
              <option key={uc.id} value={uc.id}>
                {uc.full_name}
              </option>
            );
          })}
        </select>
      </Row>
      <Row>
        <Col md={3}>
          <Button variant="danger" onClick={onCancelAdd}>
            Cancel
          </Button>
        </Col>
      </Row>

      {creatingContact && (
        <EditContactModal
          onDone={(contact) => {
            setCreatingContact(false);
            if (contact) {
              onAddAgent(contact);
            }
          }}
        />
      )}
    </div>
  );
};

export default AddAgentForm;
