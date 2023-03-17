import { configureStore } from '@reduxjs/toolkit';
import clientInfoSlice from './clientInfoSlice';
//import childrenSlice from './childrenSlice';
import dpoaSlice from './dpoaSlice';
import mpoaSlice from './mpoaSlice';
import selectedProductsSlice from './productsSlice';

export const store = configureStore({
  reducer: {
    clientInfo: clientInfoSlice.reducer,
    //children: childrenSlice.reducer,
    dpoa: dpoaSlice.reducer,
    mpoa: mpoaSlice.reducer,
    selectedProducts: selectedProductsSlice.reducer,
  },
});

export default store;
