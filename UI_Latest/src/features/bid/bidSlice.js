import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getUserFromLocalStorage } from '../../utils/localStorage';
import { getBidThunk, updateBidStatusThunk } from './bidThunk';
const initialState = {
    isLoading: false,
    bids: [],
    productId: '',
    productName: '',
    bidStatus: '',
    comment: ''
};

export const getBidDetails = createAsyncThunk('bid/getBids', getBidThunk);
export const updateBidStatus = createAsyncThunk('bid/updateBidStatus', updateBidStatusThunk);

const bidSlice = createSlice({
    name: 'bid',
    initialState,
    reducers: {        
        setProductName: (state, { payload }) => {            
            const {productId, productName}  = payload;          
            state.productName = productName;          
            state.productId = productId;           
          },     
    },

    extraReducers: {
        [getBidDetails.pending]: (state) => {
            state.isLoading = true;
        },
        [getBidDetails.fulfilled]: (state, { payload }) => {
            state.isLoading = false;            
            state.bids = payload;            
        },
        [getBidDetails.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
        [updateBidStatus.pending]: (state) => {
            state.isLoading = true;
        },
        [updateBidStatus.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            toast.success('Bid status updated successfully!!');
        },
        [updateBidStatus.rejected]: (state, { payload }) => {
            state.isLoading = false;
            toast.error(payload);
        },
    },
});

export const { setProductName } = bidSlice.actions;

export default bidSlice.reducer;