import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <main className="container">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>
    </main>
  );
}

export default Profile;