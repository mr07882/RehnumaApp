import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page2 from './pages/Page2';
import Page1 from './pages/Page1';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';

const AppRouter = () => (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Page1 />} />          {/* Home Page */}
        <Route path="/Page2" element={<Page2 />} />         {/* Cart Page */}
        <Route path="/Page3" element={<Page3 />} />   {/* Contact Page */}
        <Route path="/Page4" element={<Page4 />} /> {/* Checkout Page */}
        <Route path="/Page5" element={<Page5 />} />  {/* Category Page */}
      </Routes>
    </BrowserRouter>
  );
  
  export default AppRouter;
  