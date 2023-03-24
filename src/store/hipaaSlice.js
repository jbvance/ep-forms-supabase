import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  agents: [],
  status: 'idle',
};

const hipaaSlice = createSlice({
  name: 'hipaa',
  initialState,
  reducers: {
    addAgent(state, action) {
      state.agents = [...state.agents, action.payload];
    },
    setHipaaValues(state, action) {
      Object.assign(state, action.payload);
    },
    setHipaaStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const setHipaaValues = (values) => {
  return async (dispatch) => {
    // TODO: call database to update values - Currently done in component

    dispatch(hipaaActions.setHipaaValues(values));
  };
};

export const hipaaActions = hipaaSlice.actions;
export default hipaaSlice;
