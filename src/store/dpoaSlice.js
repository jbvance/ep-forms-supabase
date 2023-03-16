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
      state.agents = [...state.agents, action.payload];
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
  console.log('GOT HERE');
  return async (dispatch) => {
    // TODO: call database to update values - Currently done in component
    console.log('UPDATING STATE', values);
    dispatch(dpoaActions.setDpoaValues(values));
  };
};

export const dpoaActions = dpoaSlice.actions;
export default dpoaSlice;
