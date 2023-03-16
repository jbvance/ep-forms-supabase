import { useField } from 'formik';
import Form from 'react-bootstrap/Form';

const SelectField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <Form.Label className={props.labelclass}>{label}</Form.Label>
      <Form.Control
        as="select"
        custom
        {...field}
        {...props}
        style={{ borderColor: meta.touched && meta.error ? 'red' : '' }}
      ></Form.Control>
      {meta.touched && meta.error ? (
        <div className="formError">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectField;
