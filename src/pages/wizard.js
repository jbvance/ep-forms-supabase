import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import MultiStepForm from '../components/MultiStepForm';
import { requireAuth } from 'util/auth';
import supabase from 'util/supabase';

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
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [returnToStep, setReturnToStep] = useState('');

  const setStepIndex = (index) => {
    if (returnToStep !== '') {
      setReturnToStep('');
      return setActiveStepIndex(
        steps.findIndex((step) => step === returnToStep)
      );
    }
    setActiveStepIndex(index);
  };
  //const products = useSelector((state) => state.selectedProducts.products);

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
