import { dpoaActions } from './dpoaSlice';
import { mpoaActions } from './mpoaSlice';
import { hipaaActions } from './hipaaSlice';

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
