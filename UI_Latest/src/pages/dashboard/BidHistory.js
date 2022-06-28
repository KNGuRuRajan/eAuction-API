import { useEffect } from 'react';
import { useState } from 'react';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { getBidDetails } from '../../features/bid/bidSlice';
import moment from 'moment';

const BidHistory = () => {
  const { isLoading, bids, productName, productId } = useSelector((store) => store.bid);
  const dispatch = useDispatch();
 
  const handleSubmit = (e) => {
    e.preventDefault(); 
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;    
  };

  useEffect(() => {
    dispatch(               
      getBidDetails(productId)                 
    )
  }, []);

  if (isLoading) {
    return <Loading/>
  }

  if (bids.length === 0)
  {
    return  <h3>No bids history found!!</h3>;
  }

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>Bid History</h3>
        <div className="App">
          <table id="customers" border="2" gridlines="2">
            <tbody>
              <tr>
                <th>Product Name</th>
                <th>Bid Amount</th>
                <th>Created on</th>               
              </tr>
              {bids.map((item, i) => (
                <tr key={i}>
                  <td>{item.productId}</td>
                  <td>{item.bidAmount} ₹</td>                 
                  <td>{moment(item.createdAt).format('MMM Do, YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </Wrapper>
  );
};
export default BidHistory;
