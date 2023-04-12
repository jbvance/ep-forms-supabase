import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  dpoa: {
    agents: 'Please add at least one agent to continue',
  },
  mpoa: {
    agents: 'Please add at least one agent to continue',
  },
  hipaa: {
    agents: 'Please add at least one agent to continue',
  },
  directive: {},
};

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    updateErrors(state, action) {
      const { type, key, value } = action.payload;
      state[type][key] = value;
    },

    removeError(state, action) {
      const { type, key } = action.payload;
      if (state[type] && state[type][key]) {
        delete state[type][key];
      }
    },
  },
});

export const setErrors = (type, key, values) => {
  return async (dispatch) => {
    // TODO: call database to update values - Currently done in component
    dispatch(dpoaActions.setValues(values));
  };
};

export const errorsActions = errorsSlice.actions;
export default errorsSlice;
