import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Product';
import { useDispatch, useSelector } from 'react-redux';
import ProductInfo from './ProductInfo';
import moment from 'moment';
import { deleteProduct, setEditJob } from '../features/product/productSlice';
import { getBidDetails, setProductName } from '../features/bid/bidSlice';
const Job = ({
  id,
  productName,
  shortDescription,
  longDescription,
  city,  
  bidEndDate,
  category,
  startingPrice,
  state,
  address,
  phone,
  pin,
  firstName,
  lastName,  
  productId, 
}) => {
  const dispatch = useDispatch();
  const { categoryOptions } = useSelector((store) => store.product);
  const { user } = useSelector((store) => store.user);
  const isSeller = user.roleId === 1;
  const date = moment(bidEndDate).format('MMM Do, YYYY');

  const handleViewBids = () => {
    dispatch(               
      getBidDetails({productId : id})                  
    );
    dispatch(               
      setProductName({productId : id, productName})                  
    );               
  }
  const getCategory = (categoryId) => {
    var cateGoryName = '';
    if (categoryId === 1)
    {
      cateGoryName = "Painting";
    }
    else if (categoryId === 2)
    {
      cateGoryName = "Sculptor";
    }
    else
    {
      cateGoryName = "Ornament";
    }

    return cateGoryName;
  };  

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{productName.charAt(0)}</div>
        <div className='info'>
          <h5><b>Name: </b>{productName}</h5>
          <p><b>Description: </b>{shortDescription}</p>
          <p><b>Long Description: </b>{longDescription}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <ProductInfo icon={<FaCalendarAlt />} text={date}  />
          <ProductInfo icon={<FaLocationArrow />} text={city} /> 
          <ProductInfo icon={<FaBriefcase />} text={getCategory(category)} />
          <div className={`Price ${startingPrice}`}>Starting Price : {startingPrice} ₹</div>
        </div>
        <footer>
          <div className='actions'>
          {user.roleId === 2 && 
            <Link
              to='/add-product'
              className='btn edit-btn'
              onClick={() =>
                dispatch(
                  setEditJob({
                    productId: id,
                    productName,
                    shortDescription,
                    longDescription,
                    bidEndDate : date,                  
                    category,
                    startingPrice                    
                  })
                )
              }
            >
               Bid Product
            </Link> }
            
            {user.roleId === 1 &&
            <Link
              to='/view-placed-bids'
              className='btn edit-btn'
              onClick={handleViewBids}
            >
           View Bids
            </Link>  }   
            {user.roleId === 1 && 
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => dispatch(deleteProduct(id))}
            >
              delete
            </button>}
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default Job;
