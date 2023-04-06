import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { clientInfoActions } from 'store/clientInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle } from 'react-bootstrap-icons';
import { FormContext } from 'context/formContext';

const SelectUser = (props) => {
  const state = useSelector((state) => state.clientInfo);
  const dispatch = useDispatch();
  const isSpouse = state.isSpouse;
  const { activeStepIndex, setStepIndex } = useContext(FormContext);
  return (
    <Container>
      <Row
        style={{
          fontWeight: 600,
          padding: '5px 10px',
          marginBottom: '20px',
          backgroundColor: '#edf0f8',
        }}
      >
        <Col>
          <h3>Who do you want to create documents for?</h3>
        </Col>
      </Row>
      <Row>
        <Col
          className={`DocSelector ${!isSpouse ? 'active' : ''}`}
          onClick={() => dispatch(clientInfoActions.updateIsSpouse(false))}
        >
          {!isSpouse && <CheckCircle size={20} />} I want to create documents
          for myself
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col
          className={`DocSelector ${isSpouse ? 'active' : ''}`}
          onClick={() => dispatch(clientInfoActions.updateIsSpouse(true))}
        >
          {isSpouse && <CheckCircle size={20} />} I want to create documents for
          my spouse
        </Col>
      </Row>
      <form
        id={props.id}
        onSubmit={(e) => {
          e.preventDefault();
          setStepIndex(activeStepIndex + 1);
        }}
      ></form>
    </Container>
  );
};

export default SelectUser;
