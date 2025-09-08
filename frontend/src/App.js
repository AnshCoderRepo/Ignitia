import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import MyBooks from './components/MyBooks';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import './index.css';
import UserProfile from './components/UserProfile';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<BookList />} />
              <Route path="/my-books" element={
                <PrivateRoute>
                  <MyBooks />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;