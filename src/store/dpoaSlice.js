import { createSlice } from '@reduxjs/toolkit';

// const initialState_TEST = {
//   allowGifts: true,
//   effectiveImmediately: true,
//   agents: [
//     {
//       fullName: 'Tom J. Smith',
//       address: '1234 Main St., Houston, TX 77002',
//     },
//   ],
// };

export const initialState = {
  allowGifts: 'N',
  effectiveImmediately: 'Y',
  agents: [],
  status: 'idle',
};

const dpoaSlice = createSlice({
  name: 'dpoa',
  initialState,
  reducers: {
    addAgent(state, action) {
      console.log('ACTION', action);
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
    setDpoaValues(state, action) {
      //console.log(action.payload);
      Object.assign(state, action.payload);
    },
    setDpoaStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const setDpoaValues = (values) => {
  return async (dispatch) => {
    // TODO: call database to update values - Currently done in component
    dispatch(dpoaActions.setDpoaValues(values));
  };
};

export const dpoaActions = dpoaSlice.actions;
export default dpoaSlice;
