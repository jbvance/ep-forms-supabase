import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from 'util/db';

export const initialState = {
  products: [],
};

const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (undefined, thunkAPI) => {
    const response = await getProducts();
    console.log('PRODUCTS', response);
    return response;
  }
);

const selectedProductsSlice = createSlice({
  name: 'selectedProducts',
  initialState,
  reducers: {
    addProduct(state, action) {
      const existingProduct = state.products.find(
        (p) => p.type === action.payload.type
      );
      if (!existingProduct) {
        state.products.push(action.payload);
      }
      return state;
    },

    removeProduct(state, action) {
      state.products = state.products.filter(
        (p) => p.type !== action.payload.type
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      console.log(action.payload);
      state.products.push(action.payload);
    });
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
