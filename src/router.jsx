import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import History from './pages/History';
import GeneratePlan from './pages/GeneratePlan';
import UserProfile from './pages/UserProfile';
import Output from './pages/Output';
import ForgotPassword from './pages/ForgotPassword';  
import ResetPassword from './pages/ResetPassword';    

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/History" element={<History />} />
      <Route path="/GeneratePlan" element={<GeneratePlan />} />
      <Route path="/UserProfile" element={<UserProfile />} />
      <Route path="/Output" element={<Output />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
