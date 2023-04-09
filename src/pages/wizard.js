import React, { useState, useEffect } from 'react';
import { useAuth } from 'util/auth';
import { FormContext } from 'context/formContext';
import MultiStepForm from '../components/MultiStepForm';
import { requireAuth } from 'util/auth';
import { useUserId } from 'hooks/useUserId';

import FormAlert from 'components/FormAlert';
// products is a list of the documents that require user information to be filled out.
export const products = ['dpoa', 'mpoa', 'hipaa'];
const steps = [
  'select-user',
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
  const [crumbSteps, setCrumbSteps] = useState([]);

  useUserId();

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

  const addStepToCrumbs = (index) => {
    const stepToMark = steps[index];
    if (stepToMark && !crumbSteps.includes(stepToMark)) {
      setCrumbSteps([...crumbSteps, stepToMark]);
    }
  };

  const removeStepFromCrumbs = (stepNameToRemove) => {
    const stepsCopy = [...crumbSteps];
    if (stepNameToRemove && crumbSteps.includes(stepNameToRemove)) {
      const indexToRemove = stepsCopy.findIndex(
        (step) => step === stepNameToRemove
      );
      if (indexToRemove > -1) {
        stepsCopy.splice(indexToRemove, 1);
        setCrumbSteps([...stepsCopy]);
      }
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
        crumbSteps,
        addStepToCrumbs,
        removeStepFromCrumbs,
      }}
    >
      <MultiStepForm />
    </FormContext.Provider>
  );
};

export default requireAuth(WizardPage);
