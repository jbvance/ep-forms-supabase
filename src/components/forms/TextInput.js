import React from 'react';
import { useField } from 'formik';
import Form from 'react-bootstrap/Form';

const TextInput = ({ label, labelClass = 'InputLabel', ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  //console.log(field);
  return (
    <React.Fragment>
      <Form.Label className={labelClass}>{label}</Form.Label>
      <Form.Control
        type="text"
        {...field}
        {...props}
        style={{ borderColor: meta.touched && meta.error ? 'red' : '' }}
      />
      {meta.touched && meta.error ? (
        <div className="formError">{meta.error}</div>
      ) : null}
    </React.Fragment>
  );
};

export default TextInput;
