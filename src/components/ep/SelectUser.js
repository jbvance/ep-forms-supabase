import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { clientInfoActions, initialClientState } from 'store/clientInfoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle } from 'react-bootstrap-icons';
import { FormContext } from 'context/formContext';
import { useAuth } from 'util/auth';
import { useClientContactInfoByUser } from 'util/db';
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
  const [isMarried, setIsMarried] = useState(false);
  const auth = useAuth();
  const clientInfo = useSelector((state) => state.clientInfo);
  const dispatch = useDispatch();
  const {
    data: clientContactInfo,
    status: clientContactInfoStatus,
    error: clientContactInfoError,
  } = useClientContactInfoByUser(auth.user.uid);
  const {
    activeStepIndex,
    setStepIndex,
    isSpouse,
    setIsSpouse,
    setCrumbSteps,
  } = useContext(FormContext);

  useEffect(() => {
    // See if the user is married. If not, or we don't know yet because
    // they haven't filled out their contact information, yet, the option
    // to select spouse documents will not be available below
    if (clientContactInfo && clientContactInfo.length > 0) {
      const clientJson = clientContactInfo[0].json_value;
      console.log('JSON', clientJson);
      if (clientJson) {
        const clientObj = JSON.parse(clientJson);
        if (clientObj && clientObj.maritalStatus === 'married') {
          setIsMarried(true);
        }
      }
    }
  }, [clientContactInfo]);

  const handleIsSpouseChanged = (value) => {
    //console.log(isSpouse, value);
    setIsSpouse(value);
    if (value === isSpouse) {
      // Do nothing and return because user didn't change the value
      return;
    }
    // remove crumb steps to start over when switching from sopuse
    // to not spouse or vice versa
    setCrumbSteps([]);
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
      {isMarried ? (
        <Row style={{ marginTop: '20px' }}>
          <Col
            className={`DocSelector ${isSpouse ? 'active' : ''}`}
            onClick={() => handleIsSpouseChanged(true)}
          >
            {isSpouse && <CheckCircle size={20} />} I want to create documents
            for my spouse
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: '10px' }}>
          <Col>
            <Alert variant="success">
              If you are married, you will need to select 'married' on the
              contact information screen and save your spouse's information
              before you can prepare documents for your spouse
            </Alert>
          </Col>
        </Row>
      )}
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
