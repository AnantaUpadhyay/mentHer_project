// src/components/Dashboard/AdminDashboard.jsx
import React, { useState } from 'react';
import '../../styles/Dashboard.css';

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Admin Navigation</h3>
        <ul className="sidebar-menu">
          <li>
            <button 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'mentors' ? 'active' : ''}
              onClick={() => setActiveTab('mentors')}
            >
              ✅ Verify Mentors
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'schemes' ? 'active' : ''}
              onClick={() => setActiveTab('schemes')}
            >
              📋 Schemes
            </button>
          </li>
        </ul>
      </div>

      <div className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <h2>System Overview</h2>
            <p>Welcome Admin {user.name}!</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <h2>User Management</h2>
            <p>Manage all users.</p>
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="tab-content">
            <h2>Mentor Verification</h2>
            <p>Verify mentor credentials.</p>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="tab-content">
            <h2>Manage Schemes</h2>
            <p>Manage funding and government schemes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;