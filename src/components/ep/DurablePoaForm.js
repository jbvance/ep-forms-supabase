import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from 'util/supabase';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik, FieldArray, setIn } from 'formik';
import * as Yup from 'yup';
import TextInput from 'components/forms/TextInput';
import SelectField from 'components/forms/SelectField';
import FormAlert from 'components/FormAlert';
import { setDpoaValues, dpoaActions } from '../../store/dpoaSlice';
import PageLoader from 'components/PageLoader';
import { FormContext } from 'context/formContext';
import PoaHeader from './PoaHeader';

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
  effectiveImmediately: Yup.string().required('Please select a value'),
});

const DpoaForm = (props) => {
  const dispatch = useDispatch();
  const dpoaState = useSelector((state) => state.dpoa);
  const [userError, setUserError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [showFormErrors, setShowFormErrors] = useState(false);
  // Form context info
  const { activeStepIndex, setStepIndex } = useContext(FormContext);

  //Scroll to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        dispatch(dpoaActions.setDpoaStatus('loading'));
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.log(userError);
          setUserError('Error getting user');
        }
        //console.log('USER', userData.user);
        // Set initial state if user found in database
        const { data: dpoaData, error: dpoaError } = await supabase
          .from('dpoa')
          .select('json_value')
          .eq('user_id', userData.user.id);
        if (dpoaData && dpoaData.length > 0) {
          dispatch(
            dpoaActions.setDpoaValues(JSON.parse(dpoaData[0].json_value))
          );
        }
        if (dpoaError) {
          console.log('DPOA ERROR', dpoaError);
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(dpoaActions.setDpoaStatus('idle'));
      }
    };
    getUserInfo();
  }, [dispatch]);

  const submitForm = async (values) => {
    try {
      // set initialDpoaState before submitting so if there is an error
      // the form won't reset to blank values if it has never been saved
      dispatch(setDpoaValues({ ...values }));
      dispatch(dpoaActions.setDpoaStatus('loading'));
      setUpdateError(null);
      let userId = null;
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userData) {
        userId = userData.user.id;
      }
      if (userError) {
        console.log('USER ERROR IN DPOA', userError);
      }
      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for dpoa Table on supabase
      const { error } = await supabase
        .from('dpoa')
        .upsert(
          { user_id: userId, json_value: JSON.stringify(values) },
          { onConflict: 'user_id' }
        )
        .select();
      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error('Unable to update MPOA Data');
      }
      // Change wizard step
      setStepIndex(activeStepIndex + 1);
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update data at the current time. Please try again.'
      );
    } finally {
      dispatch(dpoaActions.setDpoaStatus('idle'));
    }
  };

  if (dpoaState.status === 'loading') {
    return <PageLoader />;
  }

  return (
    <React.Fragment>
      <PoaHeader
        headerText="Statutory Durable Power of Attorney"
        paragraphText="Enter the information below to complete your Statutory Durable Power of Attorney"
      />
      <Formik
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          submitForm(values);
          dispatch(setDpoaValues({ ...values }));
        }}
        initialValues={dpoaState}
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
          //if (errors) console.log(errors);
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
              }}
            >
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <SelectField
                    label="Select whether is power of attorney should become effective immediately ('Yes' is recommended)"
                    name="effectiveImmediately"
                    labelclass="PoaLabelText"
                  >
                    <option value="">Select a Value</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </SelectField>
                </Form.Group>
              </Row>
              <hr className="solid" />
              <Row>
                <Col>
                  <p className="PoaLabelText">
                    Who will serve as your Agent? Add one or more Agents below
                    (to serve in the order listed). Your agent will make legal
                    and financial decisions on your behalf.
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
                              label={`Full Name for Agent #${index + 1}`}
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
              <hr className="solid" />
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

export default DpoaForm;
