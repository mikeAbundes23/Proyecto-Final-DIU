import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ComicsPage from './components/Comics/ComicsPage';
import Home from './components/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import WishList from './components/WishList/WishList';

function App() {
  return (

    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path="/comics"
            element={
              <ProtectedRoute>
                <ComicsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;