import React, { useState } from 'react';
import { FormContext } from 'context/formContext';
import MultiStepForm from '../components/MultiStepForm';
import { requireAuth } from 'util/auth';

const WizardPage = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const steps = ['client-info', 'dpoa', 'mpoa'];
  return (
    <FormContext.Provider
      value={{ activeStepIndex, setActiveStepIndex, steps }}
    >
      <MultiStepForm />
    </FormContext.Provider>
  );
};

export default requireAuth(WizardPage);
