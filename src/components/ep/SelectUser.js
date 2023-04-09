import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { clientInfoActions, initialClientState } from 'store/clientInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle } from 'react-bootstrap-icons';
import { FormContext } from 'context/formContext';
import {
  dpoaActions,
  initialState as dpoaInitialState,
} from '../../store/dpoaSlice';
import {
  mpoaActions,
  initialState as mpoaInitialState,
} from '../../store/mpoaSlice';
import {
  hipaaActions,
  initialState as hipaaInitialState,
} from '../../store/hipaaSlice';

const SelectUser = (props) => {
  const state = useSelector((state) => state.clientInfo);
  const dispatch = useDispatch();
  const { activeStepIndex, setStepIndex, isSpouse, setIsSpouse } =
    useContext(FormContext);

  const handleIsSpouseChanged = (value) => {
    //console.log(isSpouse, value);
    setIsSpouse(value);
    if (value === isSpouse) {
      // Do nothing and return because user didn't change the value
      return;
    }
    //reset state for all slices when isSpouse changes so
    // saved state doesn't stay in place when switching
    // from spouse to not spouse or vice versa
    dispatch(
      clientInfoActions.updateClientInfo({
        ...initialClientState,
      })
    );
    dispatch(dpoaActions.setValues(dpoaInitialState));
    dispatch(mpoaActions.setValues(mpoaInitialState));
    dispatch(hipaaActions.setValues(hipaaInitialState));
  };

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
          onClick={() => handleIsSpouseChanged(false)}
        >
          {!isSpouse && <CheckCircle size={20} />} I want to create documents
          for myself
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col
          className={`DocSelector ${isSpouse ? 'active' : ''}`}
          onClick={() => handleIsSpouseChanged(true)}
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
