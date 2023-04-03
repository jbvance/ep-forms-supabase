import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SummaryHeader from 'components/summary/SummaryHeader';
import SummaryField from 'components/summary/SummaryField';
import { getSelectedProductTitle } from './WizardSummary';
import { FormContext } from 'context/formContext';
import { useContactsByUser } from 'util/db';
import { useAuth } from 'util/auth';

const AgentsSummary = ({ agents, docType, returnToStep, selectedProducts }) => {
  const userId = useAuth().user.id;
  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(userId);

  // console.log('AGENTS', agents);
  const { gotoStep } = useContext(FormContext);

  if (ucIsLoading) {
    return (
      <Spinner animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container className="SummarySection">
      <Row>
        <SummaryHeader
          text={getSelectedProductTitle(docType, selectedProducts)}
        />
      </Row>
      <Row>
        <h4 className="SummarySubheader">Agents</h4>
      </Row>
      {agents.map((a, index) => {
        const agent = ucData.find((uc) => uc.id === a.id);
        agent.fullName = agent.full_name;
        return (
          <Row
            key={agent.fullName}
            style={index % 2 === 0 ? { backgroundColor: '#f2f4f7' } : {}}
          >
            <SummaryField
              spanCols={'phone' in agent ? '3' : '6'}
              label="Name"
              text={agent.fullName}
            />
            <SummaryField spanCols="6" label="Address" text={agent.address} />
            {agent.phone && (
              <SummaryField spanCols="3" label="Phone" text={agent.phone} />
            )}
          </Row>
        );
      })}
      <Row>
        <Col xs={12}>
          <Button
            variant="warning"
            className="EditButton"
            onClick={() => gotoStep(docType, returnToStep)}
          >
            Click here to edit information
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AgentsSummary;
