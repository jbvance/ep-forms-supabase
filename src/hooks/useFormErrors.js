import React, { useState } from 'react';
import FormAlert from 'components/FormAlert';

const useFormErrors = () => {
  // const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  const validateForm = (wizardErrorsForType) => {
    let isValid = true;
    for (const [key, value] of Object.entries(wizardErrorsForType)) {
      //console.log(`${key}: ${value}`);
      if (value) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const listErrors = (errors) => {
    return Object.keys(errors).map((key) => {
      return errors[key].length > 0 ? (
        <li
          style={{
            padding: '5px',
            backgroundColor: 'var(--red)',
            color: 'white',
            listStyleType: 'none',
          }}
          key={key}
        >
          {errors[key]}
        </li>
      ) : null;
    });
  };

  return {
    //formErrors,
    //setFormErrors,
    formTouched,
    setFormTouched,
    listErrors,
    validateForm,
  };
};

export default useFormErrors;
