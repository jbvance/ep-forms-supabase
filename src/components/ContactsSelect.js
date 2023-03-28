import React from 'react';
import Select from 'react-select';
import { useUserContacts } from 'hooks/useUserContacts';

export default ({ selName }) => {
  console.log('SELNAME', selName);
  const { userContacts } = useUserContacts();
  if (!userContacts) return null;

  const options = userContacts.map((c) => {
    return {
      value: c.full_name,
      label: c.full_name,
      address: c.address,
    };
  });

  return <Select options={options} defaultValue={selName} />;
};
