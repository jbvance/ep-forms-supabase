import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SummaryHeader from 'components/summary/SummaryHeader';
import SummaryField from 'components/summary/SummaryField';
import { getSelectedProductTitle } from './WizardSummary';
import { FormContext } from 'context/formContext';
import useFormErrors from 'hooks/useFormErrors';

const ErrorSummary = ({ docType, returnToStep, selectedProducts, errors }) => {
  const { listErrors } = useFormErrors();
  const { gotoStep } = useContext(FormContext);

  return (
    <Container className="SummarySection error">
      <Row>
        <SummaryHeader
          text={getSelectedProductTitle(docType, selectedProducts)}
        />
      </Row>
      <Row>
        <h4 className="SummarySubheader error">
          Please fix the following errors:
        </h4>
      </Row>
      {listErrors(errors)}
      <Row className="EditSummaryRow">
        <Col xs={12}>
          <Button
            variant="danger"
            className="EditButton"
            onClick={() => gotoStep(docType, returnToStep)}
          >
            Click here to fix errors
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorSummary;
