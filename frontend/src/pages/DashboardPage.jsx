// src/pages/DashboardPage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import EntrepreneurDashboard from '../components/Dashboard/EntrepreneurDashboard';
import MentorDashboard from '../components/Dashboard/MentorDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import '../styles/Dashboard.css';

function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <h1 className="logo">👩‍💼 mentHer</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {user.role === 'entrepreneur' && <EntrepreneurDashboard user={user} />}
        {user.role === 'mentor' && <MentorDashboard user={user} />}
        {user.role === 'admin' && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}

export default DashboardPage;