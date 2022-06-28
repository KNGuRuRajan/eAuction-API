import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const getAllProductsThunk = async (_, thunkAPI) => {

  const { page, search, perPage, sort } =
    thunkAPI.getState().allProducts;
  const emailId = thunkAPI.getState().user.user.email;
  const roleId = thunkAPI.getState().user.user.roleId;

  const searchParam = {searchText : search, sortOrder : sort, emailId: emailId, page, perPage: perPage};  

  let url = `/e-auction/api/v1/seller/get-products`;
  if (roleId === 2) {    
    url = `/e-auction/api/v1/seller/get-all-products`;
  }
  try {

    const resp = await customFetch.post(url, searchParam);    
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

