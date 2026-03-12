// src/components/Dashboard/EntrepreneurDashboard.jsx
import React, { useState } from 'react';
import '../../styles/Dashboard.css';

function EntrepreneurDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Navigation</h3>
        <ul className="sidebar-menu">
          <li>
            <button 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              📋 My Profile
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'mentors' ? 'active' : ''}
              onClick={() => setActiveTab('mentors')}
            >
              🤝 Find Mentors
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'funding' ? 'active' : ''}
              onClick={() => setActiveTab('funding')}
            >
              💰 Funding
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'schemes' ? 'active' : ''}
              onClick={() => setActiveTab('schemes')}
            >
              📊 Government Schemes
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'messages' ? 'active' : ''}
              onClick={() => setActiveTab('messages')}
            >
              💬 Messages
            </button>
          </li>
        </ul>
      </div>

      <div className="dashboard-main">
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>My Business Profile</h2>
            <div className="card">
              <h3>Welcome, {user.name}!</h3>
              <p>Fill in your business details to get matched with mentors.</p>
            </div>
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="tab-content">
            <h2>Find Mentors</h2>
            <p>Browse available mentors in your industry.</p>
          </div>
        )}

        {activeTab === 'funding' && (
          <div className="tab-content">
            <h2>Funding Opportunities</h2>
            <p>Explore funding options for your business.</p>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="tab-content">
            <h2>Government Schemes</h2>
            <p>Discover government support programs.</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="tab-content">
            <h2>Messages</h2>
            <p>No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntrepreneurDashboard;