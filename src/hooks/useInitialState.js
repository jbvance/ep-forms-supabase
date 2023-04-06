import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchState } from 'util/db';

const useInitialState = (type, poaActions, userIdForUpdate, defaultState) => {
  const [stateLoading, setStateLoading] = useState(false);
  const [stateError, setStateError] = useState(null);
  const dispatch = useDispatch();

  const getInitialState = async () => {
    try {
      setStateError(null);
      setStateLoading(true);
      const poaResponse = await fetchState(userIdForUpdate, type);
      if (poaResponse && poaResponse.length > 0) {
        dispatch(poaActions.setValues(JSON.parse(poaResponse[0].json_value)));
      } else {
        dispatch(poaActions.setValues(defaultState));
      }
    } catch (err) {
      console.log('ERROR', err.message);
      setStateError(
        'Unable to load the initial information. Please try again in a few minutes.'
      );
    } finally {
      setStateLoading(false);
    }
  };

  return { getInitialState, stateLoading, stateError };
};

export default useInitialState;
