import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import supabase from 'util/supabase';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik, setIn } from 'formik';
import * as yup from 'yup';
import { FormContext } from '../../context/formContext';
import TextInput from 'components/forms/TextInput';
import SelectField from 'components/forms/SelectField';
import FormAlert from 'components/FormAlert';
import { useAuth } from 'util/auth';
import { getSpouseInfo } from 'util/db';

import { updateClientInfo } from '../../store/clientInfoSlice';

const reqErrorMsg = '* required';

export const initialClientInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  county: '',
  dob: '',
  phone: '',
  email: '',
  maritalStatus: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  spouseSuffix: '',
  spouseEmail: '',
  spouseDob: '',
};

const schema = yup.object().shape({
  firstName: yup.string().required(reqErrorMsg),
  lastName: yup.string().required(reqErrorMsg),
  middleName: yup.string(),
  suffix: yup.string(),
  email: yup.string().required(reqErrorMsg).email('Please enter a valid email'),
  address: yup.string().required(reqErrorMsg),
  city: yup.string().required(reqErrorMsg),
  state: yup.string().required(reqErrorMsg),
  zip: yup.string().required(reqErrorMsg),
  county: yup.string().required(reqErrorMsg),
  maritalStatus: yup.string().required(reqErrorMsg),
  dob: yup.date('Please enter a valid date'),
  spouseFirstName: yup.string().when('maritalStatus', {
    is: (maritalStatus) => {
      return maritalStatus === 'married';
    },
    then: (schema) => schema.required(reqErrorMsg),
  }),
  spouseLastName: yup.string().when('maritalStatus', {
    is: (maritalStatus) => {
      return maritalStatus === 'married';
    },
    then: (schema) => schema.required(reqErrorMsg),
  }),
  spouseMiddleName: yup.string(),
  spouseSuffix: yup.string(),
  spouseEmail: yup.string().email('Please enter a valid email'),
  spouseDob: yup.date('Please enter a valid date'),
});

function ClientContactInfo(props) {
  const initialState = useSelector((state) => state.clientInfo);
  const [isLoading, setIsLoading] = useState(false);
  const userIdForUpdate = initialState.userIdForUpdate;
  const isSpouse = initialState.isSpouse;
  const [userError, setUserError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [initialUserState, setInitialUserState] = useState(initialClientInfo);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const dispatch = useDispatch();
  let primaryUserId = useAuth().user.id;
  //console.log('ID FOR UPDATE', userIdForUpdate);

  // Form context info
  const { activeStepIndex, setStepIndex, addStepToCrumbs } =
    useContext(FormContext);

  //Scroll to top of screen and set initial State to Blank
  useEffect(() => {
    window.scrollTo(0, 0);
    addStepToCrumbs(activeStepIndex);
    dispatch(updateClientInfo(initialClientInfo));
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        let uid;
        if (initialState.isSpouse) {
          const spouseRec = await getSpouseInfo(primaryUserId);
          if (spouseRec.spouses && spouseRec.spouses.length > 0) {
            uid = spouseRec.spouses[0].id;
          }
        } else {
          uid = primaryUserId;
        }
        //console.log('UID', uid);
        if (uid) {
          const { data: clientInfoData, error: clientInfoError } =
            await supabase
              .from('client_contact')
              .select('json_value')
              .eq('user_id', uid);
          if (clientInfoError) {
            console.log('ERROR GETTING USER DATA', clientInfoError);
            throw new Error(
              'Unable to load your information. Please refresh the page to try again'
            );
          }
          //console.log('CLIENT INFO', clientInfoData);
          if (clientInfoData && clientInfoData.length > 0) {
            setInitialUserState(JSON.parse(clientInfoData[0].json_value));
          } else {
            const defaultSpouseInfo = await getDefaultSpouseInfo();
            console.log('DEFAULT SPOUSE INFO', defaultSpouseInfo);
            console.log('INITIAL STATE*********', initialState);
            // setInitialUserState(
            //   defaultSpouseInfo ? { ...initialState } : initialState
            // );
            if (defaultSpouseInfo) {
              setInitialUserState({ ...initialState, ...defaultSpouseInfo });
            } else {
              setInitialUserState(initialState);
            }
          }
        } else {
          setInitialUserState(initialState);
        }
      } catch (err) {
        setUserError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Get name of spouse if user has selected to create documents
    // for spouse AND no spouse exists yet (i.e, is not filled in clientContactInfo for the user already)
    const getDefaultSpouseInfo = async () => {
      try {
        // Only get spouse info default if docs are prepared for pouse
        if (!initialState.isSpouse) {
          return null;
        }
        // Check if spouse is already in spouses table. If so, do NOT get default
        const { error, data } = await supabase
          .from('spouses')
          .select()
          .single()
          .eq('user_id', primaryUserId);
        console.log('ERROR', error);
        console.log('DATA', data);
        if (data) {
          // Found a spouse in spouses table, now see if client_contact already exists for spouse
          // If client_contact exists, don't return anything because you don't want to overwrite
          // what client has already put in.
          const spouseId = data.id;
          const { error: ccError, data: ccData } = await supabase
            .from('client_contact')
            .select()
            .single()
            .eq('user_id', spouseId);
          console.log('CC DATA', ccData);
          if (ccData) {
            return null;
          } else {
            // Get default infor for primary user to fill in as default
            const { error: puError, data: puData } = await supabase
              .from('client_contact')
              .select('json_value')
              .single()
              .eq('user_id', primaryUserId);
            console.log('PU ERROR', puError);
            if (puData) {
              const { firstName, middleName, lastName, suffix, dob, email } =
                JSON.parse(puData['json_value']);
              return {
                spouseFirstName: firstName,
                spouseMiddleName: middleName,
                spouseLastName: lastName,
                spouseSuffix: suffix,
                spouseDob: dob,
                spouseEmail: email,
                maritalStatus: 'married',
              };
            }
          }
        }
      } catch (error) {
        console.error('ERROR GETTING DEFAULT SPOUSE INFO', error.message);
        return null;
      }
    };

    getUserInfo();
  }, [initialState]);

  const submitForm = async (values) => {
    try {
      let formValues = {};
      // If client entered married and spouse info, but then changed to another status,
      // then clear out spouse fields
      if (values.maritalStatus !== 'married') {
        formValues = {
          ...values,
          spouseFirstName: '',
          spouseMiddleName: '',
          spouseLastName: '',
          spouseSuffix: '',
          spouseEmail: '',
          spouseDob: '',
        };
      } else {
        formValues = { ...values };
      }
      setUpdateError(null);

      // Perform "upsert" to update if already exists or update otherwise
      // ***Row level security is in place for ClientContact Table on supabase
      const { error } = await supabase
        .from('client_contact')
        .upsert(
          { user_id: userIdForUpdate, json_value: JSON.stringify(formValues) },
          { onConflict: 'user_id' }
        )
        .select();
      //console.log(formValues);

      if (error) {
        console.log(error);
        setUpdateError('Unable to update data. Please try again.');
        throw new Error('Unable to update data');
      }

      // Change wizard step
      console.log('ACTIVE STEP INDEX', activeStepIndex);
      setStepIndex(activeStepIndex + 1);
    } catch (err) {
      console.log(err);
      setUpdateError(
        'Unable to update data at the current time. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <Spinner animation="border" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (userError) {
    return <FormAlert type="error" message={userError} />;
  }

  return (
    <React.Fragment>
      <Jumbotron className="IntakeJumbotron">
        <h4>
          NOTE: For ALL names on this questionnaire, please use either the full
          legal name or the name as you would prefer it to appear in your
          documents. It is most common to use full first names with middle
          initials
        </h4>
      </Jumbotron>
      <div style={{ backgroundColor: '#edf0f8', padding: '10px' }}>
        <Formik
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            submitForm(values);
            dispatch(updateClientInfo({ ...values }));
          }}
          initialValues={initialUserState}
          enableReinitialize
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            validateForm,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form
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
              id={props.id}
            >
              <h2 className="Header">Contact Information</h2>
              <Row className="mb-3">
                <Form.Group as={Col} md="3">
                  <TextInput
                    label="First Name"
                    name="firstName"
                    id="firstName"
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <TextInput
                    label="Middle Name"
                    name="middleName"
                    id="middleName"
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <TextInput label="Last Name" name="lastName" id="lastName" />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <TextInput
                    label="Jr., Sr., III, etc?"
                    name="suffix"
                    id="suffix"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12">
                  <TextInput label="Address" name="address" id="address" />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6">
                  <TextInput label="City" name="city" id="city" />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <TextInput label="State" name="state" id="state" />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <TextInput label="Zip" name="zip" id="zip" />
                </Form.Group>
              </Row>
              <Row className="mb-4">
                <Form.Group as={Col} md="4">
                  <TextInput label="Email" name="email" id="email" />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <TextInput
                    label="County of Residence"
                    name="county"
                    id="county"
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <TextInput label="Date of Birth" name="dob" id="dob" />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="4">
                  <SelectField
                    label="Marital Status"
                    name="maritalStatus"
                    id="maritalStatus"
                  >
                    <option value="">Select a Value</option>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                    <option value="divorced">Divorced</option>
                    <option value="widow">Widow</option>
                  </SelectField>
                </Form.Group>
              </Row>
              {values.maritalStatus === 'married' && (
                <React.Fragment>
                  <h2 className="Header">Spouse Information</h2>
                  <h4>Enter your spouse's information below</h4>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="3">
                      <TextInput
                        label="Spouse First Name"
                        name="spouseFirstName"
                        id="spouseFirstName"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                      <TextInput
                        label="Spouse Middle Name"
                        name="spouseMiddleName"
                        id="spouseMiddleName"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                      <TextInput
                        label="Spouse Last Name"
                        name="spouseLastName"
                        id="spouseLastName"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="3">
                      <TextInput
                        label="Jr., Sr., III, etc?"
                        name="spouseSuffix"
                        id="spouseSuffix"
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-4">
                    <Form.Group as={Col} md="4">
                      <TextInput
                        label="Spouse Email"
                        name="spouseEmail"
                        id="spouseEmail"
                      />
                    </Form.Group>

                    <Form.Group as={Col} md="4">
                      <TextInput
                        label="Spouse Date of Birth"
                        name="spouseDob"
                        id="spouseDob"
                      />
                    </Form.Group>
                  </Row>
                </React.Fragment>
              )}
              {updateError && <FormAlert type="error" message={updateError} />}
              {showFormErrors && !isValid && (
                <FormAlert
                  type="error"
                  message="Please review the form above and correct any omissions or errors"
                />
              )}
              {/* <Button type="submit">Submit form</Button> */}
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
}

export default ClientContactInfo;
