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
import { setHipaaValues, hipaaActions } from '../../store/hipaaSlice';
import PageLoader from 'components/PageLoader';
import PoaHeader from './PoaHeader';
import { FormContext } from 'context/formContext';

const schema = Yup.object().shape({
  agents: Yup.array()
    .of(
      Yup.object().shape({
        fullName: Yup.string().required('Agent name is required'),
        address: Yup.string(),
        phone: Yup.string(),
      })
    )
    .required('Please add at least one agent')
    .min(1, 'Please add at least one agent'),
});

const HipaaForm = (props) => {
  const dispatch = useDispatch();
  const hipaaState = useSelector((state) => state.hipaa);
  const [userError, setUserError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const { activeStepIndex, setStepIndex } = useContext(FormContext);

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        dispatch(hipaaActions.setHipaaStatus('loading'));
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.log(userError);
          setUserError('Error getting user');
        }
        // Set initial state if user found in database
        const { data: hipaaData, error: hipaaError } = await supabase
          .from('hipaa')
          .select('json_value')
          .eq('user_id', userData.user.id);
        if (hipaaError) {
          console.log('HIPAA ERROR', hipaaError);
        }
        if (hipaaData && hipaaData.length > 0) {
          dispatch(
            hipaaActions.setHipaaValues(JSON.parse(hipaaData[0].json_value))
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hipaaActions.setHipaaStatus('idle'));
      }
    };
    getUserInfo();
  }, [dispatch]);

  const submitForm = async (values) => {
    try {
      // Update state before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(setHipaaValues({ ...values }));
      dispatch(hipaaActions.setHipaaStatus('loading'));
      setUpdateError(null);
      let userId = null;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userData) {
        userId = userData.user.id;
      }
      if (userError) {
        console.log('USER ERROR IN HIPAA', userError);
      }
      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for hipaa Table on supabase
      const { error } = await supabase
        .from('hipaa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(values) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update HIPAA data. Please try again.');
      } else {
        // If no error, update state
        dispatch(setHipaaValues({ ...values }));
        // Change wizard step
        setStepIndex(activeStepIndex + 1);
      }
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update HIPAA data at the current time. Please try again.'
      );
    } finally {
      dispatch(hipaaActions.setHipaaStatus('idle'));
    }
  };

  if (hipaaState.status === 'loading') {
    return <PageLoader />;
  }

  return (
    <React.Fragment>
      <PoaHeader
        headerText="Hipaa Release and Authorization"
        paragraphText="Enter the information below to complete your Hipaa Release and Authorizzation. This document will allow your agents to have access to your protected health information, such as your medical records"
      />
      <Formik
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          submitForm(values);
          //dispatch(setHipaaValues({ ...values }));
        }}
        initialValues={hipaaState}
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
                //dispatch(setHipaaValues({ ...values }));
              }}
            >
              <Row>
                <Col>
                  <p className="PoaLabelText">
                    Who will serve as your Agent? Add one or more Agents below
                    (to serve in the order listed). Your agents will all have
                    access to your medical records and other protected health
                    information.
                  </p>
                </Col>
              </Row>
              <FieldArray name="agents">
                {({ insert, remove, push }) => (
                  <>
                    {values.agents.length > 0 &&
                      values.agents.map((agent, index) => (
                        <Row key={index} className="AgentBox">
                          <Form.Group as={Col} md="3">
                            <TextInput
                              label={`Full Name for Agent No. ${index + 1}`}
                              name={`agents.${index}.fullName`}
                              labelclass="PoaLabelText"
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="6">
                            <TextInput
                              label={`Address`}
                              name={`agents.${index}.address`}
                              labelclass="PoaLabelText"
                            />
                          </Form.Group>
                          <Form.Group as={Col} md="3">
                            <TextInput
                              label={`Phone`}
                              name={`agents.${index}.phone`}
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
                    {values.agents.length < 10 && (
                      <Button
                        variant="outline-primary"
                        onClick={() => push({ fullName: '', address: '' })}
                        className="mb-3"
                      >
                        Add Agent
                      </Button>
                    )}
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

export default HipaaForm;
