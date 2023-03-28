import React, { useState, useEffect } from 'react';
import { useAuth } from 'util/auth';
import supabase from 'util/supabase';

export const useUserContacts = () => {
  const [userContacts, setUserContacts] = useState([]);
  const [userContactsError, setUserContactsError] = useState(null);
  const [userContactsStatus, setUserContactsStatus] = useState(null);
  const auth = useAuth();

  const getUserContacts = async () => {
    try {
      setUserContactsStatus('loading');
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
    } catch (err) {
      console.log('USER CONTACTS ERROR', err);
      setUserContactsError('Error getting contacts information');
    } finally {
      setUserContactsStatus(null);
    }
  };

  useEffect(() => {
    getUserContacts();
  }, []);

  return { userContacts, userContactsError, userContactsStatus };
};
