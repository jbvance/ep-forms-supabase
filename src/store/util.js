import { dpoaActions, initialState as dpoaInitialState } from './dpoaSlice';
import { mpoaActions, initialState as mpoaInitialState } from './mpoaSlice';
import { hipaaActions, initialState as hipaaInitialState } from './hipaaSlice';

// If a contact changes in one form, change it in any
// other forms where that contact is listed as an agent
export const updateAllAgentsForContactChange = (dispatch, contact) => {
  // console.log('STARTING');
  // dispatch(dpoaActions.updateAgent(contact));
  // console.log('DONE WITH DPOA');
  // dispatch(mpoaActions.updateAgent(contact));
  // console.log('DONE WITH MED POA');
  // //dispatch(hipaaActions.updateAgent(contact));
  // console.log('DONE WITH HIPAA');
};
