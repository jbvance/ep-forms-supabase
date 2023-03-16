import React, { useContext } from 'react';
import { FormContext } from 'context/formContext';
import Footer from './FooterMulti';
import ClientContactInfo from './ep/ClientContactInfo';
import DpoaForm from './ep/DurablePoaForm';
import MpoaForm from './ep/MedicalPoaForm';

const MultiStepForm = () => {
  const { activeStepIndex, steps } = useContext(FormContext);

  const props = {
    isFirst: activeStepIndex === 0,
    isLast: activeStepIndex === steps.length - 1,
  };

  const stepComponents = [
    <ClientContactInfo id={steps[0]} />,
    <DpoaForm {...props} id={steps[1]} />,
    <MpoaForm {...props} id={steps[2]} />,
  ];

  return (
    <div className="container">
      {stepComponents[activeStepIndex]}
      <Footer id={steps[activeStepIndex]} {...props} />
    </div>
  );
};

export default MultiStepForm;
