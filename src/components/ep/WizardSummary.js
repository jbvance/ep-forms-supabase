import React, { Fragment, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { FormContext } from 'context/formContext';
import SummaryField from 'components/summary/SummaryField';
import SummaryHeader from 'components/summary/SummaryHeader';

const WizardSummary = (props) => {
  const { activeStepIndex, setStepIndex, steps, gotoStep } =
    useContext(FormContext);
  const dispatch = useDispatch();
  const wizState = useSelector((state) => state);
  //console.log('WIZ STATE IN SUMMARY', wizState);
  //console.log('STEPS IN WIZ', steps);

  const submitForm = (e) => {
    e.preventDefault();
    setStepIndex(activeStepIndex + 1);
  };
  const clientInfo = { ...wizState.clientInfo };
  const selectedProducts = wizState.selectedProducts.products.map((p) => {
    return {
      type: p.type.includes('-') ? p.type.split('-')[1] : p.type,
      title: p.title,
    };
  });
  //console.log('SELECTED PRODUCTS', selectedProducts);

  const isProductTypeSelected = (type) => {
    return selectedProducts.find((p) => p.type === type);
  };

  const getSelectedProductTitle = (type) => {
    const selectedProduct = selectedProducts.find((p) => p.type === type);
    if (selectedProduct) {
      return selectedProduct.title;
    } else {
      return 'Product Not Found';
    }
  };

  return (
    <Fragment>
      <Row>
        <Col>
          <SummaryHeader text="Your Information" />
        </Col>
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
        <SummaryField spanCols="12" label="Address" text={clientInfo.address} />
      </Row>
      <Row>
        <SummaryField spanCols="6" label="City" text={clientInfo.city} />
        <SummaryField spanCols="2" label="State" text={clientInfo.state} />
        <SummaryField spanCols="4" label="Zip" text={clientInfo.zip} />
      </Row>
      <Row>
        <SummaryField spanCols="12" label="County" text={clientInfo.county} />
      </Row>
      <Row>
        <Col xs={12}>
          <Button
            variant="warning"
            className="EditButton"
            onClick={() => gotoStep('client-info', 'summary')}
          >
            Click here to edit information
          </Button>
        </Col>
      </Row>
      {/* TODO - ADD MARITAL SPOUSE INFO IF MARRIED */}

      {isProductTypeSelected('dpoa') && (
        <React.Fragment>
          <Row>
            <Col>
              <SummaryHeader text={getSelectedProductTitle('dpoa')} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h4 className="SummarySubheader">Agents</h4>
            </Col>
          </Row>
          {wizState.dpoa.agents.map((agent) => {
            return (
              <Row key={agent.fullName}>
                <SummaryField spanCols="4" label="Name" text={agent.fullName} />
                <SummaryField
                  spanCols="8"
                  label="Address"
                  text={agent.address}
                />
              </Row>
            );
          })}
          <Row>
            <Col xs={12}>
              <Button
                variant="warning"
                className="EditButton"
                onClick={() => gotoStep('dpoa', 'summary')}
              >
                Click here to edit information
              </Button>
            </Col>
          </Row>
        </React.Fragment>
      )}

      {isProductTypeSelected('mpoa') && (
        <React.Fragment>
          <Row>
            <Col>
              <SummaryHeader text={getSelectedProductTitle('mpoa')} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h4 className="SummarySubheader">Agents</h4>
            </Col>
          </Row>
          {wizState.dpoa.agents.map((agent) => {
            return (
              <Row key={agent.fullName}>
                <SummaryField spanCols="4" label="Name" text={agent.fullName} />
                <SummaryField
                  spanCols="8"
                  label="Address"
                  text={agent.address}
                />
              </Row>
            );
          })}
          <Row>
            <Col xs={12}>
              <Button
                variant="warning"
                className="EditButton"
                onClick={() => gotoStep('mpoa', 'summary')}
              >
                Click here to edit information
              </Button>
            </Col>
          </Row>
        </React.Fragment>
      )}

      <form onSubmit={submitForm} id={props.id}></form>
    </Fragment>
  );
};

export default WizardSummary;
