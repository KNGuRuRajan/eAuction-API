import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { getBidDetails, setProductName } from './bidSlice';
export const getBidThunk = async (product, thunkAPI) => {
  const roleId = thunkAPI.getState().user.user.roleId;
  let url;
  if (roleId === 1) {
    const { productId, productName } = product;
    url = `/e-auction/api/v1/seller/show-bids/${productId}`;
  }
  else {
    const emailId = thunkAPI.getState().user.user.email;
    url = `/e-auction/api/v1/buyer/bid-history/${emailId}`;
  }
  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const updateBidStatusThunk = async (bid, thunkAPI) => {   
  try {   
    const { productId, bidStatus, email} = bid;
    const resp = await customFetch.put('/e-auction/api/v1/seller/updatebidstatus/'+ `${productId}/${email}/${bidStatus}`);    
    thunkAPI.dispatch(getBidDetails({productId : productId}));   
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};



