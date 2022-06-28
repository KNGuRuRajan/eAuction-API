import { showLoading, hideLoading, getAllProducts } from '../allProducts/allProductsSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './productSlice';
import moment from 'moment';

export const createProductThunk = async (product, thunkAPI) => { 
 product = { ...product, email: thunkAPI.getState().user.user.email };
  try {   
    const resp = await customFetch.post('/e-auction/api/v1/seller/add-product', product);
    // thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const deleteProductThunk = async (productId, thunkAPI) => { 
  thunkAPI.dispatch(showLoading());
  try {    
    const resp = await customFetch.delete(`/e-auction/api/v1/seller/delete/${productId}`);
    thunkAPI.dispatch(getAllProducts());    
    return resp.data;
  } catch (error) {
    thunkAPI.dispatch(hideLoading());
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
export const editProductThunk = async (bid, thunkAPI) => {  
  bid = { ...bid, email: thunkAPI.getState().user.user.email, createdAt: new Date().toISOString() };
  try {   
    const resp = await customFetch.post('/e-auction/api/v1/buyer/place-bid', bid);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
