import React, { useState, useEffect } from 'react';
import { useAuth } from 'util/auth';
import supabase from 'util/supabase';

export const useUserContacts = () => {
  const [userContacts, setUserContacts] = useState([]);
  const [userContactsError, setUserContactsError] = useState(null);
  const auth = useAuth();

  const getUserContacts = async () => {
    console.log('AUTH', auth);
    const { data, error } = await supabase
      .from('user_contacts')
      .select('*')
      .eq('user_id', auth.user.id);
    if (error) {
      setUserContactsError(err.message);
    }
    if (data) {
      setUserContacts(data);
    }
    console.log('DATA', data);
  };

  useEffect(() => {
    getUserContacts();
  }, []);

  return { userContacts, userContactsError };
};
