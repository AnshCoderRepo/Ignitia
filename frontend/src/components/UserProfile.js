import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();

    const getRoleBadge = (role) => {
        const roleStyles = {
            admin: { background: '#e74c3c', color: 'white' },
            member: { background: '#3498db', color: 'white' }
        };

        return (
            <span className="role-badge" style={roleStyles[role]}>
                {role.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="user-profile">
            <h2>Your Profile</h2>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        {getRoleBadge(user.role)}
                    </div>
                </div>

                <div className="profile-details">
                    <h4>Account Details</h4>
                    <div className="detail-item">
                        <span className="label">User ID:</span>
                        <span className="value">{user._id}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Account Type:</span>
                        <span className="value">{user.role === 'admin' ? 'Administrator' : 'Library Member'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Member Since:</span>
                        <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {user.role === 'admin' && (
                    <div className="admin-features">
                        <h4>Admin Privileges</h4>
                        <ul>
                            <li>Add new books to the library</li>
                            <li>Manage book inventory and copies</li>
                            <li>View all borrowing activity</li>
                            <li>Manage user accounts</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;