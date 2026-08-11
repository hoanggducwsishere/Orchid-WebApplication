import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Detail from '../pages/Detail';
import Contact from '../pages/Contact';
import About from '../pages/About';
import Management from '../pages/Management';
import Natural from '../pages/Natural';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Favorites from '../pages/Favorites';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Protected Route wrapper
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function AppRoutes({ isLoggedIn, setIsLoggedIn, userProfile, setUserProfile }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register />} />
      
      <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Home isLoggedIn={isLoggedIn} /></ProtectedRoute>} />
      <Route path="/detail/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Detail userProfile={userProfile} isLoggedIn={isLoggedIn} /></ProtectedRoute>} />
      <Route 
        path="/management" 
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            {(userProfile?.isAdmin || userProfile?.admin) ? <Management isLoggedIn={isLoggedIn} /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        } 
      />
      <Route path="/profile" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Profile userProfile={userProfile} setUserProfile={setUserProfile} /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Favorites /></ProtectedRoute>} />
      <Route path="/natural" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Natural /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Contact userProfile={userProfile} isLoggedIn={isLoggedIn} /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute isLoggedIn={isLoggedIn}><About /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}