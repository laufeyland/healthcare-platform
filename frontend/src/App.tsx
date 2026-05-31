import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import PremiumPage from './pages/PremiumPage';
import DashboardPage from './pages/DashbordPage';
import AdminDashboard from './pages/AdminDashboard';
import SignUpPage from './pages/SignUpPage';
import NotificationPage from './pages/NotificationPage';
import ReschedulePage from './pages/ReschedulePage';
function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book-appointment" element={<BookingPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/NotificationPage" element={<NotificationPage/>} />
        <Route path="/signup" element={<SignUpPage />} />
       <Route path="/reschedule" element={<ReschedulePage />} />

        <Route path="/dashboard" element={
      
            <DashboardPage />
          } />
      </Routes>
    </div>
  );
}
/*  */
export default App;