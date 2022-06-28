import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllProductsThunk } from './allProductsThunk';

const initialFiltersState = {
  search: '',
  searchCategory: 'all', 
  sort: 'lowest',
  sortOptions: ['lowest', 'highest'],
};

const initialState = {
  isLoading: true,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  perPage: 3,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllProducts = createAsyncThunk('allProducts/getProducts', getAllProductsThunk);

const allProductsSlice = createSlice({
  name: 'allProducts',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    clearAllJobsState: (state) => initialState,
  },
  extraReducers: {
    [getAllProducts.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllProducts.fulfilled]: (state, { payload }) => {
      state.isLoading = false;      
      const { products, errorMessage, page, total, lastPage } = payload;
      state.jobs = products;
      state.numOfPages = lastPage;
      state.page = page;
      state.totalJobs = total;
    },
    [getAllProducts.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },   
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  changePage,
  clearAllJobsState,
} = allProductsSlice.actions;

export default allProductsSlice.reducer;
