import React, { useState } from 'react';

const useFormErrors = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  const validateForm = () => {
    let isValid = true;
    for (const [key, value] of Object.entries(formErrors)) {
      //console.log(`${key}: ${value}`);
      if (value) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const listErrors = () => {
    return Object.keys(formErrors).map((key) => {
      return <li key={key}>{formErrors[key]}</li>;
    });
  };

  return {
    formErrors,
    setFormErrors,
    formTouched,
    setFormTouched,
    listErrors,
    validateForm,
  };
};

export default useFormErrors;
