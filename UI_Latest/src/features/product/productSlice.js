import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import { createProductThunk, deleteProductThunk, editProductThunk } from './productThunk';
const initialState = {
  isLoading: false,
  productName: '',
  shortDescription: '',
  longDescription: '',
  bidEndDate: '',
  startingPrice: '',
  categoryOptions: ['Painting', 'Sculptor', 'Ornament'],
  category: 'Painting',
  firstName: '',
  lastName: '',
  city: '',
  state: '',
  address: '',
  pin: '',
  phone: '',
  email: '',
  isEditing: false,
  productId: '',
  bidAmount: '',
};

export const createProduct = createAsyncThunk('product/createProduct', createProductThunk);

export const deleteProduct = createAsyncThunk('product/deleteProduct', deleteProductThunk);

export const editProduct = createAsyncThunk('product/editProduct', editProductThunk);


const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
        category: 'Painting',   
        categoryOptions: ['Painting', 'Sculptor', 'Ornament'],    
      };
    },
    setEditJob: (state, { payload }) => {
      return { ...state, ...payload };
    },
    getBids: (state) => {
      return { ...state, isEditing: false };
    },
  },
  extraReducers: {
    [createProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [createProduct.fulfilled]: (state) => {
      state.isLoading = false;
      toast.success('Product Created');
    },
    [createProduct.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [deleteProduct.fulfilled]: (state, { payload }) => {
      const productResponse = payload;
      if (!productResponse.errorMessage) {
        toast.success('Product deleted successfully');
      }
      else
      {
        toast.error(productResponse.errorMessage);
      }
      
    },
    [deleteProduct.rejected]: (state, { payload }) => {
      toast.error(payload);
    },
    [editProduct.pending]: (state) => {
      state.isLoading = true;
    },
    [editProduct.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      const bidResponse = payload;
      if (!bidResponse.errorMessage) {
        toast.success('successfully placed bid');
      }
      else
      {
        toast.error(bidResponse.errorMessage);
      }
    },
    [editProduct.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues, setEditJob, getBids } = productSlice.actions;

export default productSlice.reducer;
