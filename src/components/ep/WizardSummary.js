import React, { useContext } from 'react';
import { FormContext } from 'context/formContext';

const WizardSummary = (props) => {
  const { activeStepIndex, setActiveStepIndex } = useContext(FormContext);
  const submitForm = (e) => {
    e.preventDefault();
    setActiveStepIndex(activeStepIndex + 1);
  };
  return (
    <div>
      <form onSubmit={submitForm} id={props.id}></form>
    </div>
  );
};

export default WizardSummary;
