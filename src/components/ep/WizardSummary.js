import React, { Fragment, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Jumbotron, Container, Row, Col, Button } from 'react-bootstrap';
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

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <Jumbotron>
        <h2>Review your Information</h2>
        <p>
          You are almost ready to prepare your documents. First, take a moment
          to review the infomrmation below to make sure everything is correct.
          Be sure to make any necessary changes before continuing.
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
      </Container>

      {isProductTypeSelected('dpoa') && (
        <Container className="SummarySection">
          <Row>
            <SummaryHeader text={getSelectedProductTitle('dpoa')} />
          </Row>
          <Row>
            <h4 className="SummarySubheader">Agents</h4>
          </Row>
          {wizState.dpoa.agents.map((agent, index) => {
            return (
              <Row
                key={agent.fullName}
                style={index % 2 === 0 ? { backgroundColor: '#f2f4f7' } : {}}
              >
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
        </Container>
      )}

      {isProductTypeSelected('mpoa') && (
        <Container className="SummarySection">
          <Row>
            <SummaryHeader text={getSelectedProductTitle('mpoa')} />
          </Row>
          <Row>
            <h4 className="SummarySubheader">Agents</h4>
          </Row>
          {wizState.mpoa.agents.map((agent, index) => {
            return (
              <Row
                key={agent.fullName}
                style={index % 2 === 0 ? { backgroundColor: '#f2f4f7' } : {}}
              >
                <SummaryField spanCols="3" label="Name" text={agent.fullName} />
                <SummaryField
                  spanCols="6"
                  label="Address"
                  text={agent.address}
                />
                <SummaryField spanCols="3" label="Phone" text={agent.phone} />
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
        </Container>
      )}

      <form onSubmit={submitForm} id={props.id}></form>
    </Fragment>
  );
};

export default WizardSummary;
