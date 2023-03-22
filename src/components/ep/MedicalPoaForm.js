import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from 'util/supabase';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import TextInput from 'components/forms/TextInput';
import FormAlert from 'components/FormAlert';
import { setMpoaValues, mpoaActions } from '../../store/mpoaSlice';
import PageLoader from 'components/PageLoader';
import PoaHeader from './PoaHeader';
import { FormContext } from 'context/formContext';

const schema = Yup.object().shape({
  agents: Yup.array()
    .of(
      Yup.object().shape({
        fullName: Yup.string().required('Agent name is required'),
        address: Yup.string(),
      })
    )
    .required('Please add at least one agent')
    .min(1, 'Please add at least one agent'),
});

const MpoaForm = (props) => {
  const dispatch = useDispatch();
  const mpoaState = useSelector((state) => state.mpoa);
  const [userError, setUserError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        dispatch(mpoaActions.setMpoaStatus('loading'));
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.log(userError);
          setUserError('Error getting user');
        }
        // Set initial state if user found in database
        const { data: mpoaData, error: mpoaError } = await supabase
          .from('mpoa')
          .select('json_value')
          .eq('user_id', userData.user.id);
        if (mpoaError) {
          console.log('MPOA ERROR', mpoaError);
        }
        if (mpoaData && mpoaData.length > 0) {
          dispatch(
            mpoaActions.setMpoaValues(JSON.parse(mpoaData[0].json_value))
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(mpoaActions.setMpoaStatus('idle'));
      }
    };
    getUserInfo();
  }, [dispatch]);

  const submitForm = async (values) => {
    try {
      // Update state before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(setMpoaValues({ ...values }));
      dispatch(mpoaActions.setMpoaStatus('loading'));
      setUpdateError(null);
      let userId = null;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userData) {
        userId = userData.user.id;
      }
      if (userError) {
        console.log('USER ERROR IN MEDICAL POA', userError);
      }
      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for mpoa Table on supabase
      const { error } = await supabase
        .from('mpoa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(values) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update MPOA data. Please try again.');
      } else {
        // If no error, update state
        dispatch(setMpoaValues({ ...values }));
        // Change wizard step
        setStepIndex(activeStepIndex + 1);
      }
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update MPOA data at the current time. Please try again.'
      );
    } finally {
      dispatch(mpoaActions.setMpoaStatus('idle'));
    }
  };

  if (mpoaState.status === 'loading') {
    return <PageLoader />;
  }

  return (
    <React.Fragment>
      <PoaHeader
        headerText="Medical Power of Attorney"
        paragraphText="Enter the information below to complete your Medical Power of Attorney"
      />
      <Formik
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          submitForm(values);
          //dispatch(setMpoaValues({ ...values }));
        }}
        initialValues={mpoaState}
        enableReinitialize
      >
        {({
          handleSubmit,
          values,
          touched,
          isValid,
          errors,
          validate,
          getFieldMeta,
          validateForm,
        }) => {
          return (
            <Form
              id={props.id}
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                setShowFormErrors(false);
                validateForm().then((value) => {
                  if (Object.keys(value).length > 0) {
                    setShowFormErrors(true);
                  }
                });
                handleSubmit();
                //dispatch(setMpoaValues({ ...values }));
              }}
            >
              <Row>
                <Col>
                  <p className="PoaLabelText">
                    Who will serve as your Agent? Add one or more Agents below
                    (to serve in the order listed). Your agent will make medical
                    decisions for you if you become incapacitated.
                  </p>
                </Col>
              </Row>
              <FieldArray name="agents">
                {({ insert, remove, push }) => (
                  <>
                    {values.agents.length > 0 &&
                      values.agents.map((agent, index) => (
                        <Row key={index} className="AgentBox">
                          <Form.Group as={Col} md="4">
                            <TextInput
                              label={`Full Name for Agent No. ${index + 1}`}
                              name={`agents.${index}.fullName`}
                              labelclass="PoaLabelText"
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="8">
                            <TextInput
                              label={`Address`}
                              name={`agents.${index}.address`}
                              labelclass="PoaLabelText"
                            />
                          </Form.Group>
                          <div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="AgentDeleteButton"
                              onClick={() => remove(index)}
                            >
                              Delete
                            </Button>{' '}
                          </div>
                        </Row>
                      ))}
                    <Button
                      variant="outline-primary"
                      onClick={() => push({ fullName: '', address: '' })}
                      className="mb-3"
                    >
                      Add Agent
                    </Button>{' '}
                  </>
                )}
              </FieldArray>
              {typeof errors.agents === 'string' &&
                getFieldMeta('agents').touched && (
                  <Row>
                    <Col>
                      <FormAlert type="error" message={errors.agents} />
                    </Col>
                  </Row>
                )}

              <Row>
                <Col>
                  {' '}
                  {updateError && (
                    <FormAlert type="error" message={updateError} />
                  )}
                </Col>
              </Row>
              {showFormErrors && !isValid && (
                <FormAlert
                  type="error"
                  message="Please review the form above and correct any omissions or errors"
                />
              )}
              {/* }
              <Row className="mb-3">
                <Col>
                  <Button variant="outline-success" type="submit">
                    Save and Continue
                  </Button>{' '}
                </Col>
                  </Row> */}
            </Form>
          );
        }}
      </Formik>
    </React.Fragment>
  );
};

export default MpoaForm;
