import { useState } from 'react';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { useEffect } from 'react';
import { getBidDetails, setProductName, updateBidStatus } from '../../features/bid/bidSlice';


const BidDetails = () => {
  const { isLoading, bids, productName, productId, bidStatus, comment } = useSelector((store) => store.bid);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();    
  };

  useEffect(() => {
    dispatch(
      setProductName({ productId, productName })
    );  

    dispatch(getBidDetails({productId : productId}));   
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
  };

  if (isLoading) {
    return <Loading />
  }

  if (bids.length === 0) {
    return <h3>No bids found for the selected product - {productName}</h3>;
  }

  const HighestBidPriceStyle = {
    backgroundColor: "red",
    color: "white"
    
  };

  const LowestBidPriceStyle = {
    backgroundColor: "green",
    color: "white"
  };

  const OherBidPriceStyle = {
    color: "black",
    backgroundColor: "white"
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h4>Placed bids for the product - {productName}</h4>
        <div className="App">
          <table id="customers" border="2" gridlines="2">
            <tbody>
              <tr>
                <th>Bid Amount</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Bid Status</th>
                <th></th>
                <th></th>
              </tr>
              {bids.length > 0 && bids.map((item, i) => (
                <tr key={i}>
                   <td style= {i === 0 ? LowestBidPriceStyle : i== bids.length - 1 ? HighestBidPriceStyle : OherBidPriceStyle}>{item.bidAmount} ₹</td>
                  <td>{item.firstName}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.bidStatus === "" ? 'Pending' : item.bidStatus}</td>
                 <td> <button
                    type='submit'
                    disabled = {item.bidStatus === "Accepted" || item.bidStatus === "Rejected"}
                    className='btn btn-block submit-btn'
                    onClick={() => dispatch(updateBidStatus({ productId, bidStatus: 'Accepted', email: item.email }))}
                  >
                    accept
                  </button>
                  </td>
                 <td><button
                    type='submit'
                    className='btn btn-block submit-btn'
                    disabled = {item.bidStatus === "Accepted" || item.bidStatus === "Rejected"}
                    onClick={() => dispatch(updateBidStatus({ productId, bidStatus: 'Rejected', email: item.email }))}
                  >
                    reject
                  </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </Wrapper>
  );
};
export default BidDetails;
