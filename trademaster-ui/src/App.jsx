import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home/Home';
import ProtectedRoute from  "./components/ProtectedRoute";
import UserPage from './components/User/UserPage'

function App() {
  return (

    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;