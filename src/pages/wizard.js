import React, { useState, useEffect } from 'react';
import { useAuth } from 'util/auth';
import { useDispatch } from 'react-redux';
import { FormContext } from 'context/formContext';
import MultiStepForm from '../components/MultiStepForm';
import { requireAuth } from 'util/auth';
import supabase from 'util/supabase';
import { mpoaActions } from 'store/mpoaSlice';
import { dpoaActions } from 'store/dpoaSlice';
import { hipaaActions } from 'store/hipaaSlice';
import { fetchState } from 'util/db';
import FormAlert from 'components/FormAlert';

// products is a list of the documents that require user information to be filled out.
export const products = ['dpoa', 'mpoa', 'hipaa'];
const steps = [
  'select-products',
  'client-info',
  'dpoa',
  'mpoa',
  'hipaa',
  'summary',
  'finalize',
];

const WizardPage = (props) => {
  const auth = useAuth();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [returnToStep, setReturnToStep] = useState('');
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize the state for each form
    const initializeState = async () => {
      try {
        setError(null);
        setIsLoading(true);
        // Durable POA
        const dpoaResponse = await fetchState(auth.user.id, 'dpoa');
        dpoaResponse &&
          dpoaResponse.length > 0 &&
          dispatch(
            dpoaActions.setDpoaValues(JSON.parse(dpoaResponse[0].json_value))
          );

        // Medical POA
        const mpoaResponse = await fetchState(auth.user.id, 'mpoa');
        mpoaResponse &&
          mpoaResponse.length > 0 &&
          dispatch(
            mpoaActions.setMpoaValues(JSON.parse(mpoaResponse[0].json_value))
          );

        // Hipaa
        const hipaaResponse = await fetchState(auth.user.id, 'hipaa');
        hipaaResponse &&
          hipaaResponse.length > 0 &&
          dispatch(
            hipaaActions.setHipaaValues(JSON.parse(hipaaResponse[0].json_value))
          );
      } catch (err) {
        console.log(err);
        setError('Unable to load data. Please try again in a moment');
      } finally {
        setIsLoading(false);
      }
    };

    initializeState();
  }, []);

  const setStepIndex = (index) => {
    if (returnToStep !== '') {
      setReturnToStep('');
      return setActiveStepIndex(
        steps.findIndex((step) => step === returnToStep)
      );
    }
    setActiveStepIndex(index);
  };

  const gotoStep = (stepName, returnToStepName = '') => {
    const stepIndex = steps.findIndex((s) => s === stepName);
    if (returnToStepName) {
      setReturnToStep(returnToStepName);
    }
    if (stepIndex) {
      setActiveStepIndex(stepIndex);
      //setStepIndex(stepIndex);
    }
  };

  if (isLoading) {
    return <div>Loading..</div>;
  }
  if (error) {
    return <FormAlert type="error" message={error} />;
  }
  return (
    <FormContext.Provider
      value={{
        activeStepIndex,
        setActiveStepIndex,
        steps,
        gotoStep,
        setStepIndex,
      }}
    >
      <MultiStepForm />
    </FormContext.Provider>
  );
};

export default requireAuth(WizardPage);
