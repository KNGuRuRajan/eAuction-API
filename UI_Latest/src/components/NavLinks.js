import { NavLink } from 'react-router-dom';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { useSelector, useDispatch } from 'react-redux';

const NavLinks = ({ toggleSidebar }) => {
  const { user } = useSelector((store) => store.user);

  return (
    <div className='nav-links'>     

      <NavLink
        to='all-products'
        className={({ isActive }) => {
          return isActive ? 'nav-link active' : 'nav-link';
        }}
        key="1"
        onClick={toggleSidebar}
      >
        <span className='icon'><MdQueryStats /></span>
        All products
      </NavLink>

      {user.roleId === 2 &&
        <NavLink
          to='view-bid-history'
          className={({ isActive }) => {
            return isActive ? 'nav-link active' : 'nav-link';
          }}
          key="2"
          onClick={toggleSidebar}
        >
          <span className='icon'><FaWpforms /></span>
          Bid History
        </NavLink>
}
      {user.roleId === 1 &&
        <NavLink
          to='add-product'
          className={({ isActive }) => {
            return isActive ? 'nav-link active' : 'nav-link';
          }}
          key="2"
          onClick={toggleSidebar}
        >
          <span className='icon'><FaWpforms /></span>
          Add Product
        </NavLink>}

   

    </div>
  );
};
export default NavLinks;
