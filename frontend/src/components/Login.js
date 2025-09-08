import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            const result = await login(email, password);

            if (result.success) {
                // Redirect based on user role or explicit admin login
                if (isAdminLogin && result.redirectTo !== '/admin') {
                    setError('This account does not have admin privileges');
                    setLoading(false);
                    return;
                }

                navigate(result.redirectTo || '/');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-tabs">
                <button
                    className={!isAdminLogin ? 'active' : ''}
                    onClick={() => setIsAdminLogin(false)}
                >
                    Member Login
                </button>
                <button
                    className={isAdminLogin ? 'active' : ''}
                    onClick={() => setIsAdminLogin(true)}
                >
                    Admin Login
                </button>
            </div>

            <div className="auth-form">
                <h2>{isAdminLogin ? 'Admin Login' : 'Member Login'}</h2>
                {isAdminLogin && (
                    <div className="admin-notice">
                        <p>Please use your admin credentials to access the dashboard</p>
                    </div>
                )}

                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {!isAdminLogin && (
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                )}

                {isAdminLogin && (
                    <p>
                        Are you a member? <button
                            className="link-button"
                            onClick={() => setIsAdminLogin(false)}
                        >
                            Switch to member login
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;