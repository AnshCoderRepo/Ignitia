import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getRoleIndicator = (role) => {
        if (role === 'admin') {
            return <span className="role-indicator admin">ADMIN</span>;
        }
        return <span className="role-indicator member">MEMBER</span>;
    };

    return (
        <nav className="navbar bg-green-400">
            <div className="navbar-brand font-line">
                <Link to="/">Go-Library</Link>
            </div>
            <div className="navbar-menu">
                {isAuthenticated ? (
                    <>
                        <div className="user-info">
                            <span>Welcome, {user.name}</span>
                            {getRoleIndicator(user.role)}
                        </div>
                        <Link to="/my-books">My Books</Link>
                        <Link to="/profile">Profile</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin">Admin Dashboard</Link>
                        )}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
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