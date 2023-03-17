import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  agents: [],
  status: 'idle',
};

const mpoaSlice = createSlice({
  name: 'mpoa',
  initialState,
  reducers: {
    addAgent(state, action) {
      state.agents = [...state.agents, action.payload];
    },
    setMpoaValues(state, action) {
      Object.assign(state, action.payload);
    },
    setMpoaStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const setMpoaValues = (values) => {
  return async (dispatch) => {
    // TODO: call database to update values - Currently done in component

    dispatch(mpoaActions.setMpoaValues(values));
  };
};

export const mpoaActions = mpoaSlice.actions;
export default mpoaSlice;
