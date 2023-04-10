import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Jumbotron,
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useAuth } from 'util/auth';
import { FormContext } from 'context/formContext';
import SummaryField from 'components/summary/SummaryField';
import SummaryHeader from 'components/summary/SummaryHeader';
import AgentsSummary from './AgentsSummary';
import ErrorSummary from './ErrorSummary';
import { useContactsByUser } from 'util/db';
import useFormErrors from 'hooks/useFormErrors';

export const getSelectedProductTitle = (type, productsToSearch) => {
  //console.log('TYPE', type);
  //console.log('PTS', productsToSearch);
  const selectedProduct = productsToSearch.find((p) => p.type === type);
  if (selectedProduct) {
    return selectedProduct.title;
  } else {
    return 'Product Not Found';
  }
};

const WizardSummary = (props) => {
  const auth = useAuth();
  const userId = auth.user.id;
  const { activeStepIndex, setStepIndex, steps, gotoStep, addStepToCrumbs } =
    useContext(FormContext);
  const dispatch = useDispatch();
  const wizState = useSelector((state) => state);
  const wizardErrors = useSelector((state) => state['wizardErrors']);
  const { validateForm } = useFormErrors();
  //const [isValid, setIsValid] = useState(true);

  const {
    data: ucData,
    error: ucError,
    status: ucStatus,
    isLoading: ucIsLoading,
  } = useContactsByUser(userId);

  //Scroll to top of screen
  useEffect(() => {
    addStepToCrumbs(activeStepIndex);
    window.scrollTo(0, 0);
  }, []);

  const clientInfo = { ...wizState.clientInfo };
  const selectedProducts = wizState.selectedProducts.products.map((p) => {
    return {
      type: p.type.includes('-') ? p.type.split('-')[1] : p.type,
      title: p.title,
    };
  });
  console.log('SELECTED PRODUCTS', selectedProducts.length);

  let isValid = true;
  for (let i = 0; i < selectedProducts.length; i++) {
    if (!validateForm(wizardErrors[selectedProducts[i].type])) {
      isValid = false;
      break;
    }
  }
  console.log('isValid', isValid);

  const submitForm = (e) => {
    e.preventDefault();
    setStepIndex(activeStepIndex + 1);
  };

  const isProductTypeSelected = (type) => {
    return selectedProducts.find((p) => p.type === type);
  };

  if (ucIsLoading) {
    return (
      <Spinner animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Fragment>
      <Jumbotron className="IntakeJumbotron">
        <h2>Review your Information</h2>
        <p>
          You are almost ready to prepare your documents. First, take a moment
          to review the information below to make sure everything is correct. Be
          sure to make any necessary changes before continuing.
        </p>
      </Jumbotron>
      <Container className="SummarySection">
        <Row>
          <SummaryHeader text="Your Information" />
        </Row>
        <Row>
          <SummaryField
            spanCols="3"
            label="First Name"
            text={clientInfo.firstName}
          />
          <SummaryField
            spanCols="3"
            label="Middle Name"
            text={clientInfo.middleName}
          />
          <SummaryField
            spanCols="3"
            label="Last Name"
            text={clientInfo.lastName}
          />
          <SummaryField
            spanCols="3"
            label="Suffix (Jr., III, etc.)"
            text={clientInfo.suffix}
          />
        </Row>
        <Row>
          <SummaryField
            spanCols="12"
            label="Address"
            text={clientInfo.address}
          />
        </Row>
        <Row>
          <SummaryField spanCols="6" label="City" text={clientInfo.city} />
          <SummaryField spanCols="2" label="State" text={clientInfo.state} />
          <SummaryField spanCols="4" label="Zip" text={clientInfo.zip} />
        </Row>
        <Row>
          <SummaryField spanCols="12" label="County" text={clientInfo.county} />
        </Row>

        {clientInfo.maritalStatus === 'married' && (
          <React.Fragment>
            <Row>
              <h4 className="SummarySubheader">Spouse Information</h4>
            </Row>
            <Row>
              <SummaryField
                spanCols="3"
                label="First Name"
                text={clientInfo.spouseFirstName}
              />
              <SummaryField
                spanCols="3"
                label="Middle Name"
                text={clientInfo.spouseMiddleName}
              />
              <SummaryField
                spanCols="3"
                label="Last Name"
                text={clientInfo.spouseLastName}
              />
              <SummaryField
                spanCols="3"
                label="Suffix (Jr., III, etc.)"
                text={clientInfo.spouseSuffix}
              />
            </Row>
            <Row>
              <SummaryField
                spanCols="3"
                label="Email"
                text={clientInfo.spouseEmail}
              />
              <SummaryField
                spanCols="3"
                label="Date of Birth"
                text={clientInfo.spouseDob}
              />
            </Row>
          </React.Fragment>
        )}
        <Row className="EditSummaryRow">
          <Col xs={12}>
            <Button
              variant="tertiary"
              className="EditButton"
              onClick={() => gotoStep('client-info', 'summary')}
            >
              Click here to edit contact information
            </Button>
          </Col>
        </Row>
      </Container>

      {isProductTypeSelected('dpoa') && (
        <React.Fragment>
          {validateForm(wizardErrors['dpoa']) ? (
            <AgentsSummary
              agents={wizState.dpoa.agents}
              docType="dpoa"
              returnToStep="summary"
              selectedProducts={selectedProducts}
            />
          ) : (
            <ErrorSummary
              docType="dpoa"
              returnToStep="summary"
              selectedProducts={selectedProducts}
              errors={wizardErrors['dpoa']}
            />
          )}
        </React.Fragment>
      )}

      {isProductTypeSelected('mpoa') && (
        <AgentsSummary
          agents={wizState.mpoa.agents}
          docType="mpoa"
          returnToStep="summary"
          selectedProducts={selectedProducts}
        />
      )}

      {isProductTypeSelected('hipaa') && (
        <AgentsSummary
          agents={wizState.hipaa.agents}
          docType="hipaa"
          returnToStep="summary"
          selectedProducts={selectedProducts}
        />
      )}

      {isValid && <form onSubmit={submitForm} id={props.id}></form>}
    </Fragment>
  );
};

export default WizardSummary;
