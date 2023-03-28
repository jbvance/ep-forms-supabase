import React from 'react';
import { Spinner, Row, Col, Button } from 'react-bootstrap';
import { useUserContacts } from 'hooks/useUserContacts';

const AddAgentForm = ({ onAgentSelected, onCancelAdd }) => {
  const { userContacts, userContactsStatus, userContactsError } =
    useUserContacts();
  if (userContactsStatus === 'loading') {
    return (
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
  return (
    <div className="AddAgentForm">
      <h5>Select a contact to add as an agent</h5>
      <Row style={{ margin: '20px 0' }}>
        <select
          name="userContacts"
          style={{ width: '300px' }}
          onChange={onAgentSelected}
        >
          <option value="">Select an agent</option>
          {userContacts.map((uc) => {
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
    </div>
  );
};

export default AddAgentForm;
