import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from 'util/auth';
import { getSpouseInfo } from 'util/db';
import { clientInfoActions as actions } from 'store/clientInfoSlice';
import supabase from 'util/supabase';

export const useUserId = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const primaryUserId = auth.user.id;
  const [userIdForUpdate, setUserIdForUpdate] = useState(null);
  const state = useSelector((state) => state.clientInfo);
  const isSpouse = state.isSpouse;
  //console.log('IS SPOUSE', state.isSpouse);

  useEffect(() => {
    const getUpdateUserId = async () => {
      // Only update user id to spouse's if isSpouse === true
      if (isSpouse === false) {
        dispatch(actions.updateUserIdForUpdate(primaryUserId));
        //setUserIdForUpdate(primaryUserId);
        return;
      } else {
        const { spouses } = await getSpouseInfo(primaryUserId);
        //console.log('SPOUSES', spouses.length, spouses);
        if (spouses && spouses.length > 0) {
          dispatch(actions.updateUserIdForUpdate(spouses[0].id));
        } else {
          const { error, data: newSpouse } = await supabase
            .from('spouses')
            .insert({ user_id: primaryUserId })
            .select()
            .single();
          console.log('ERROR', error);
          dispatch(actions.updateUserIdForUpdate(newSpouse.id));
        }
      }
    };

    getUpdateUserId();
  }, [isSpouse]);

  //return { userIdForUpdate };
};
