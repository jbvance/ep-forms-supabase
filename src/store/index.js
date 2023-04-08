import { configureStore } from '@reduxjs/toolkit';
import clientInfoSlice from './clientInfoSlice';
//import childrenSlice from './childrenSlice';
import dpoaSlice from './dpoaSlice';
import mpoaSlice from './mpoaSlice';
import selectedProductsSlice from './productsSlice';
import hipaaSlice from './hipaaSlice';
import errorsSlice from './errorsSlice';

export const store = configureStore({
  reducer: {
    clientInfo: clientInfoSlice.reducer,
    //children: childrenSlice.reducer,
    dpoa: dpoaSlice.reducer,
    mpoa: mpoaSlice.reducer,
    hipaa: hipaaSlice.reducer,
    selectedProducts: selectedProductsSlice.reducer,
    wizardErrors: errorsSlice.reducer,
  },
});

export default store;
