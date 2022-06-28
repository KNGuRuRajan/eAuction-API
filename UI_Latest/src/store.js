import { configureStore } from '@reduxjs/toolkit';
import productSlice from './features/product/productSlice';
import userSlice from './features/user/userSlice';
import bidSlice from './features/bid/bidSlice';
import allProductsSlice from './features/allProducts/allProductsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    allProducts: allProductsSlice,
    bid: bidSlice,
  },
});
