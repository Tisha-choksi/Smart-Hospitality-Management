import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <main className="container">
      <section className="hero">
        <h2>Welcome to Smart Hospitality Management</h2>
        <p>Manage your hotel operations with ease</p>
        {!user ? (
          <Link to="/login" className="btn btn-primary">Get Started</Link>
        ) : (
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        )}
      </section>
    </main>
  );
}

export default Home;