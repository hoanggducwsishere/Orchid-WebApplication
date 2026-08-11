import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import ScrollToTop from './components/ScrollToTop';
import useTheme from './assets/hooks/useTheme';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('googleToken'));
  const [userProfile, setUserProfile] = useState(() => {
    const storedUser = localStorage.getItem('userProfile');
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
    const token = localStorage.getItem('googleToken');
    const storedUser = localStorage.getItem('userProfile');
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) {
        try {
          setUserProfile(JSON.parse(storedUser));
        } catch(e) {
          console.error(e);
        }
      }
    }
  }, []);

  return (
    <div className={`app-shell ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <ScrollToTop />
      <NavigationBar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
      />

      <Container className="mt-4 py-3" style={{ flexGrow: 1 }}>
        <AppRoutes isLoggedIn={isLoggedIn} userProfile={userProfile} setUserProfile={setUserProfile} />
      </Container>

      <Footer />
    </div>
  );
}

export default App;