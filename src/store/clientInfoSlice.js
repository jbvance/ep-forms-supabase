import { createSlice } from '@reduxjs/toolkit';

// export const initialClientState = {
//   firstName: '',
//   middleName: '',
//   lastName: '',
//   address: '',
//   city: '',
//   state: '',
//   zip: '',
//   county: '',
//   phone: '',
//   occupation: '',
//   email: '',
//   employer: '',
//   married: '',
//   spouseFirstName: '',
//   spouseMiddleName: '',
//   spouseLastName: '',
//   spouseEmail: '',
//   spouseOccupation: '',
//   spouseEmployer: '',
// };

export const initialClientState = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  county: '',
  dob: '',
  //phone: '(713) 555-1234',
  email: '',
  maritalStatus: '',
  spouseFirstName: '',
  spouseMiddleName: '',
  spouseLastName: '',
  spouseSuffix: '',
  spouseEmail: '',
  spouseDob: '',
  isSpouse: false,
  userIdForUpdate: null,
};

const initialState = { ...initialClientState };

const clientInfoSlice = createSlice({
  name: 'clientInfo',
  initialState,
  reducers: {
    updateClientInfo(state, action) {
      const newState = { ...action.payload };
      if (newState.maritalStatus !== 'married') {
        newState.spouseFirstName = '';
        newState.spouseMiddleName = '';
        newState.spouseLastName = '';
        newState.spouseSuffix = '';
        newState.spouseEmail = '';
        newState.spouseDob = '';
      }
      Object.assign(state, newState);
    },
    updateIsSpouse(state, action) {
      state.isSpouse = action.payload;
    },
    updateUserIdForUpdate(state, action) {
      state.userIdForUpdate = action.payload;
    },
  },
});

export const updateClientInfo = (clientInfo) => {
  return async (dispatch) => {
    // TODO: call api to update client info before dispatching
    // to redux
    dispatch(clientInfoActions.updateClientInfo(clientInfo));
  };
};

// export const getFavorites = (token: string) => {
//   const axiosParams = {
//     method: 'get',
//     url: `${process.env.REACT_APP_API_BASE_URL}/favorites`,
//     headers: {
//       accept: '*/*',
//       authorization: `Bearer ${token}`,
//     },
//   };
//   return async (dispatch: Dispatch) => {
//     try {
//       const result: any = await axios(axiosParams);
//       dispatch(favoritesActions.setFavorites(result.data.favorites));
//     } catch (error) {
//       console.log('ERROR', error);
//     }
//   };
// };

export const clientInfoActions = clientInfoSlice.actions;
export default clientInfoSlice;
