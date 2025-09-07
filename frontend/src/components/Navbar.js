import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Library Management System</Link>
            </div>
            <div className="navbar-menu">
                {isAuthenticated ? (
                    <>
                        <span>Welcome, {user.name}</span>
                        <Link to="/my-books">My Books</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin">Admin Dashboard</Link>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;