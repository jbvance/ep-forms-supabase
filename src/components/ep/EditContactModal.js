import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useForm } from 'react-hook-form';
import FormAlert from 'components/FormAlert';
import FormField from 'components/FormField';
import { useAuth } from 'util/auth';
import { useContact, updateContact, createContact } from 'util/db';

function EditContactModal(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch item if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new item.
  //const { data: itemData, status: itemStatus } = useItem(props.id);
  const { data: contactData, status: contactStatus } = useContact(props.id);

  // If we are updating an existing item
  // don't show modal until item data is fetched.
  if (props.id && contactStatus !== 'success') {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.id
      ? updateContact(props.id, data)
      : createContact({ user_id: auth.user.uid, ...data });

    query
      .then((response) => {
        // Let parent know we're done so they can hide modal
        const newOrUpdatedContact = response[0];
        props.onDone({
          ...newOrUpdatedContact,
          fullName: newOrUpdatedContact['full_name'],
        });
      })
      .catch((error) => {
        // Hide pending indicator
        setPending(false);
        // Show error alert message
        setFormAlert({
          type: 'error',
          message: error.message,
        });
      });
  };

  return (
    <Modal show={true} centered={true} animation={false} onHide={props.onDone}>
      <Modal.Header closeButton={true}>
        {props.id && <>Update</>}
        {!props.id && <>Create</>}
        {` `}Contact
      </Modal.Header>
      <Modal.Body>
        {formAlert && (
          <FormAlert type={formAlert.type} message={formAlert.message} />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formName">
            <FormField
              size="lg"
              name="full_name"
              type="text"
              placeholder="Full Name"
              defaultValue={contactData && contactData.full_name}
              error={errors.full_name}
              autoFocus={true}
              inputRef={register({
                required: 'Please enter a name',
              })}
            />
            <FormField
              size="lg"
              name="address"
              type="text"
              placeholder="Address"
              defaultValue={contactData && contactData.address}
              error={errors.address}
              inputRef={register()}
            />
            <FormField
              size="lg"
              name="phone"
              type="text"
              placeholder="Phone"
              defaultValue={contactData && contactData.phone}
              error={errors.phone}
              inputRef={register()}
            />
          </Form.Group>
          <Button size="lg" variant="primary" type="submit" disabled={pending}>
            <span>Save</span>

            {pending && (
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden={true}
                className="ml-2"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditContactModal;
