import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormContext } from 'context/formContext';
import MultiStepForm from '../components/MultiStepForm';
import { requireAuth } from 'util/auth';

export const products = ['dpoa', 'mpoa'];

const WizardPage = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const products = useSelector((state) => state.selectedProducts.products);
  const steps = ['select-products', 'client-info', 'dpoa', 'mpoa', 'finalize'];
  return (
    <FormContext.Provider
      value={{ activeStepIndex, setActiveStepIndex, steps }}
    >
      <MultiStepForm />
    </FormContext.Provider>
  );
};

export default requireAuth(WizardPage);
