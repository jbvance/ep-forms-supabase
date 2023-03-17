import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  products: [],
};

const selectedProductsSlice = createSlice({
  name: 'selectedProducts',
  initialState,
  reducers: {
    addProduct(state, action) {
      const existingProduct = state.products.find((p) => p === action.payload);
      if (!existingProduct) {
        state.products.push(action.payload);
      }
      return state;
    },

    removeProduct(state, action) {
      state.products = state.products.filter((p) => p !== action.payload);
    },
  },
});

export const updateSelectedProducts = (products) => {
  return async (dispatch) => {
    // TODO: call api to update client info before dispatching
    // to redux
    dispatch(selectedProductsActions.updateSelectedProducts(products));
  };
};

export const selectedProductsActions = selectedProductsSlice.actions;
export default selectedProductsSlice;
