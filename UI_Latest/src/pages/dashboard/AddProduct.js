import { FormRow, FormRowSelect } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';

import {
  handleChange,
  clearValues,
  createProduct,
  editJob,
  getBids,
  editProduct
} from '../../features/product/productSlice';
import { useEffect, useState } from 'react';
import { MdContactSupport } from 'react-icons/md';
import { FaDivide } from 'react-icons/fa';
const AddProduct = () => {
  const {
    isLoading,
    productName,
    shortDescription,
    longDescription,
    bidEndDate,
    startingPrice,
    categoryOptions,
    category,
    firstName,
    lastName,
    city,
    state,
    address,
    pin,
    phone,
    email,
    productId,
    bidAmount
  } = useSelector((store) => store.product);

  const { user } = useSelector((store) => store.user);
  const isSeller = user.roleId === 1;
  const dispatch = useDispatch();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName)
    {
      toast.error('Please enter product name!');
      return;
    }
    else if (productName.length < 5 || productName.length > 30)
    {
      toast.error('Product name should contain atleast 5 and max 30 charaters!');
      return;
    }

    if (!firstName)
    {
      toast.error('Please enter First Name!');
      return;
    }
    else if (firstName.length < 5 || firstName.length > 30)
    {
      toast.error('First name should contain atleast 5 and max 30 charaters!');
      return;
    }

    if (!lastName)
    {
      toast.error('Please enter Last Name!');
      return;
    }
    else if (firstName.length < 3 || firstName.length > 25)
    {
      toast.error('First name should contain atleast 5 and max 30 charaters!');
      return;
    }

    if (!phone)
    {
      toast.error('Please enter Phone!');
      return;
    }
    else if (phone.length !== 10)
    {
      toast.error('Please enter 10 digit valid phone number!');
      return;
    }

    if (!startingPrice)
    {
      toast.error('Please enter Starting Price!');
      return;
    }    

    if (isSeller) {
      if (!bidEndDate) {
        toast.error('Please select valid bid end date!');
        return;
      }
      else if (!moment(new Date()).isBefore(new Date(bidEndDate))) {
        toast.error('Bid end date should be in future!');
        return;
      }
      const bidEndDateValue = new Date(bidEndDate).toISOString();
    }
    else if(!isSeller) {
      if (!moment(new Date()).isAfter(new Date(bidEndDate)))
      {
        toast.error('you cannot place a Bid. The bid end date on selected product is in past!!');
        return;
      }
    }

    var categoryId = getCategory(category);

    if (isSeller) {
      dispatch(createProduct({ productName, shortDescription, longDescription, address, city, state, firstName, lastName, phone, pin, bidEndDate: new Date(bidEndDate).toISOString(), startingPrice, category: categoryId, email: user.mail }));
      dispatch(clearValues());
      return;
    }
    else {
      dispatch(
        editProduct({ productId, address, city, state, firstName, lastName, phone, pin, bidAmount: startingPrice }));
    }
  };

  const getCategory = (name) => {
    var categoryId = 0;
    if (name === "Painting") {
      categoryId = 1;
    }
    else if (name === "Sculptor") {
      categoryId = 2;
    }
    else {
      categoryId = 3;
    }

    return categoryId;
  };

  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };

  return (
    <Wrapper>
      <form className='form'>
        <h3>{user.roleId === 1 ? 'add product' : 'Bid Product'}</h3>
        <div className='form-center'>
          {/* product name */}
          <FormRow
            type='text'
            name='productName'
            labelText={<b>Product Name *</b>}
            value={productName}
            handleChange={handleJobInput}
            disabled={!isSeller}
            placeHolder='Enter Min 5 and Max 30 characters..'
            minLength="5"
            maxLength="30" />
          {/* short desc */}
          <FormRow
            type='text'
            name='shortDescription'
            labelText='Short Description'
            value={shortDescription}
            handleChange={handleJobInput}
            disabled={!isSeller}
          />
          {/* long desc */}
          <FormRow
            type='text'
            name='longDescription'
            labelText='Long Description'
            value={longDescription}
            handleChange={handleJobInput}
            disabled={!isSeller}
          />
          {/* category */}
          <FormRowSelect
            name='category'
            value={category}
            handleChange={handleJobInput}
            list={categoryOptions}
            disabled={!isSeller}
          />
          {/* bid end date */}

          <FormRow
            type={user.roleId === 1 ? 'date' : 'text'}
            name='bidEndDate'
            labelText={<b>Bid End Date *</b>}
            value={bidEndDate}
            handleChange={handleJobInput}
            disabled={!isSeller}
          />
          <FormRow
            type='number'
            name='startingPrice'
            labelText={user.roleId === 1 ? <b>Stating Price *</b> : <b>Bid Price *</b>}
            value={startingPrice}
            handleChange={handleJobInput}
          />
          {/* first name*/}
          <FormRow
            type='text'
            name='firstName'
            labelText={<b>First Name *</b>}
            value={firstName}
            handleChange={handleJobInput}
            placeHolder='Enter Min 5 and Max 30 characters..'
            minLength="5"
            maxLength="30"
          />
          <FormRow
            type='text'
            name='lastName'
            labelText={<b>Last Name *</b>}
            value={lastName}
            handleChange={handleJobInput}
            placeHolder='Enter Min 3 and Max 25 characters..'
            minLength="3"
            maxLength="25"
          />
          <FormRow
            type='text'
            name='address'
            labelText='Address'
            value={address}
            handleChange={handleJobInput}
          />
          <FormRow
            type='text'
            name='city'
            labelText='city'
            value={city}
            handleChange={handleJobInput}
          />
          <FormRow
            type='text'
            name='state'
            labelText='state'
            value={state}
            handleChange={handleJobInput}
          />
          <FormRow
            type='text'
            name='pin'
            labelText='pin'
            value={pin}
            handleChange={handleJobInput}
          />
          <FormRow
            type='text'
            name='phone'
            labelText={<b>phone *</b>}
            value={phone}
            handleChange={handleJobInput}
            minLength="10"
            maxLength="10"
          />
          <FormRow
            type='text'
            name='email'
            labelText={<b>email *</b>}
            value={user.email}
            handleChange={handleJobInput}
            disabled={true}
          />
          <div className='btn-container'>
            {isSeller &&
              <button
                type='button'
                className='btn btn-block clear-btn'
                onClick={() => dispatch(clearValues())}
              >
                clear
              </button>
            }
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default AddProduct;
