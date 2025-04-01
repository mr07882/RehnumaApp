import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import History from './pages/History';
import GeneratePlan from './pages/GeneratePlan';
import UserProfile from './pages/UserProfile';
import Output from './pages/Output';

const AppRouter = () => (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Home />} />          {/* Home Page */}
        <Route path="/Login" element={<Login />} />         {/* Cart Page */}
        <Route path="/SignUp" element={<SignUp />} />   {/* Contact Page */}
        <Route path="/History" element={<History />} /> {/* Checkout Page */}
        <Route path="/GeneratePlan" element={<GeneratePlan />} />  {/* Category Page */}
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/Output" element={<Output />} />
      </Routes>
    </BrowserRouter>
  );
  
  export default AppRouter;
  

  