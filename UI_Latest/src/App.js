import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Landing, Error, Register, ProtectedRoute } from './pages';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  
  AddProduct,
  AllProducts,
  Stats,
  SharedLayout,
  BidHistory,
} from './pages/dashboard';
import { ImTextWidth } from 'react-icons/im';
import BidDetails from './pages/dashboard/BidDetails';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AllProducts />} />
          <Route path='all-products' element={<AllProducts />} />
          <Route path='add-product' element={<AddProduct />} />
          <Route path='view-placed-bids' element={<BidDetails />} />
          <Route path='view-bid-history' element={<BidHistory />} />
        </Route>
        <Route path='landing' element={<Landing />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        bodyClassName="toastBody"
        style={{ width:"auto" }}
        transition={Slide}
      />
    </BrowserRouter>
  );
}

export default App;
