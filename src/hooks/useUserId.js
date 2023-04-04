import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from 'util/auth';
import { getSpouseInfo } from 'util/db';
import supabase from 'util/supabase';

export const useUserId = () => {
  const auth = useAuth();
  const primaryUserId = auth.user.id;
  const [userIdForUpdate, setUserIdForUpdate] = useState(null);
  const state = useSelector((state) => state.clientInfo);
  //console.log('IS SPOUSE', state.isSpouse);

  const getUpdateUserId = async () => {
    // Only update user id to spouse's if isSpouse === true
    console.log('YESSIR');
    if (state.isSpouse === false) {
      setUserIdForUpdate(primaryUserId);
      return;
    }
    console.log('GOT HERE ******');
    const spouseObj = await getSpouseInfo(primaryUserId);
    // console.log('SPOUSEOBJ', spouseObj);
    if (spouseObj.spouse_id) {
      setUserIdForUpdate(spouseObj.spouse_id);
    }
  };

  return { getUpdateUserId, userIdForUpdate };
};
