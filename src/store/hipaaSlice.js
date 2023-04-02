import { createSlice } from '@reduxjs/toolkit';
import { arrMove } from 'util/util';

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
    removeAgent(state, action) {
      const copyOfAgents = [...state.agents];
      const indexToRemove = copyOfAgents.findIndex(
        (a) => a.id == action.payload.id
      );
      if (indexToRemove > -1) {
        copyOfAgents.splice(indexToRemove, 1);
        state.agents = [...copyOfAgents];
      }
    },
    updateAgent(state, action) {
      state.agents = state.agents.map((agent) => {
        if (agent.id === action.payload.id) {
          return action.payload;
        } else {
          return agent;
        }
      });
    },
    setValues(state, action) {
      Object.assign(state, action.payload);
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    moveAgent(state, action) {
      state.agents = arrMove(
        [...state.agents],
        action.payload.oldIndex,
        action.payload.newIndex
      );
    },
  },
});

export const setValues = (values) => {
  return async (dispatch) => {
    // TODO: call database to update values - Currently done in component

    dispatch(hipaaActions.setValues(values));
  };
};

export const hipaaActions = hipaaSlice.actions;
export default hipaaSlice;
