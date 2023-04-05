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
      <Row>
        <Col md={12}>
          <h3>Who do you want to create documents for?</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            className={!isSpouse ? 'ActiveButton' : ''}
            onClick={() => dispatch(clientInfoActions.updateIsSpouse(false))}
          >
            {!isSpouse && <CheckCircle />} I want to create documents for myself
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col>
          <Button
            className={isSpouse ? 'ActiveButton' : ''}
            onClick={() => dispatch(clientInfoActions.updateIsSpouse(true))}
          >
            {isSpouse && <CheckCircle />} I want to create documents for my
            spouse
          </Button>
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
