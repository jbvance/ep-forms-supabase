import { FieldProps, useField } from 'formik';
import React from 'react';
import Form from 'react-bootstrap/Form';
import CreatableSelect from 'react-select/creatable';

export const ReactSelectField = ({
  options,
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  labelClass,
  label,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.field);
  const { setValue, setTouched, setError } = helpers;

  const setFieldProps = (selectedOption) => {
    setValue(selectedOption.value);
    setTouched(true);
    setError(undefined);
  };
  //console.log(props);
  console.log(field.value);

  return (
    <div>
      <Form.Label className={labelClass}>{label}</Form.Label>
      <CreatableSelect
        options={[
          { value: '', label: 'Select a name or enter a new name' },
          ...options,
        ]}
        name={field.name}
        value={
          options
            ? options.find((option) => option.value === field.value)
            : field.value
        }
        onChange={(selectedOption) => setFieldProps(selectedOption)}
        onBlur={field.onBlur}
      />
      {meta.touched && meta.error ? (
        <div className="formError">{meta.error}</div>
      ) : null}
    </div>
  );
};
export default ReactSelectField;
