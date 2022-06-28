import { useState, useEffect } from 'react';
import { Logo, FormRow, FormRowSelect } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const initialState = {
  firstName : '',
  lastName : '',
  roleId: '',
  email: '',
  password: '',
  isMember: true,  
  roleTypeOptions: ['Seller', 'Buyer'],
  roleType: 'Seller'
};

function Register() {
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.user);
  const[validationMessage, setValidationMessage] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, roleType, isMember } = values;
    
    const roleId = roleType === "Seller" ? 1 : 2;

    if (!isMember && !firstName)
    {
      toast.error('Please enter First Name');
      return;
    }
    else if(!isMember && firstName.length < 3 && firstName.length > 15)
    {
      toast.error('Please endte first name atleast 3 characters.!');
      return;
    }
    if (!isMember && !lastName)
    {
      toast.error('Please enter Last Name');
      return;
    }
    else if(!isMember && lastName.length < 3 && lastName.length > 15)
    {
      toast.error('Please endte last name atleast 3 characters.!');
      return;
    }
    if (!email)
    {
      toast.error('Please enter email!');
      return;
    }
    if (!password)
    {
      toast.error('Please enter valid password');
      return;
    }
    else if(password.length <3 || password.length > 12)
    {
      toast.error('Password cannot be lessthan 3 charaters!');
      return;
    }

    if (isMember) {
      dispatch(loginUser({ email: email, password: password }));
      return;
    }
    setValues({ ...values, roleId : roleId });

    dispatch(registerUser({ firstName, lastName, roleId, email, password }));
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember, firstName: '', lastName:'', email: '', password: '' });
  };
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [user]);
  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {/* name field */}      
        {!values.isMember && 
        (              
          <FormRow
            type='text'
            name='firstName'
            value={values.firstName}
            handleChange={handleChange}
            labelText = "First Name"
          />                   
        )}
         {!values.isMember && 
        (              
          <FormRow
            type='text'
            name='lastName'
            value={values.lastName}
            handleChange={handleChange}
            labelText = "Last Name"
          />                   
        )}
        {/* email field */}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />            
        {/* password field */}
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />

         {/* job type*/}
         {!values.isMember && 
         (<FormRowSelect
            name='role'
            labelText='register as'
            value={values.roleType}
            handleChange={handleChange}
            list={values.roleTypeOptions}
          />)}

        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'loading...' : 'submit'}
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}
export default Register;
