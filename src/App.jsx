import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import ScrollToTop from './components/ScrollToTop';
import useTheme from './assets/hooks/useTheme';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('user'));
  const [userProfile, setUserProfile] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error(e);
      return null;
    }
  });
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      try {
        setUserProfile(JSON.parse(storedUser));
      } catch(e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className={`app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <ScrollToTop />
      {isLoggedIn && (
        <NavigationBar 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
        />
      )}

      <Container className="mt-4 py-3" style={{ flexGrow: 1 }}>
        <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userProfile={userProfile} setUserProfile={setUserProfile} />
      </Container>

      {isLoggedIn && <Footer />}
    </div>
  );
}

export default App;