// src/components/Dashboard/MentorDashboard.jsx
import React, { useState } from 'react';
import '../../styles/Dashboard.css';

function MentorDashboard({ user }) {
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
              className={activeTab === 'mentees' ? 'active' : ''}
              onClick={() => setActiveTab('mentees')}
            >
              👥 My Mentees
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'requests' ? 'active' : ''}
              onClick={() => setActiveTab('requests')}
            >
              🔔 Requests
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
          <li>
            <button 
              className={activeTab === 'feedback' ? 'active' : ''}
              onClick={() => setActiveTab('feedback')}
            >
              ⭐ Feedback
            </button>
          </li>
        </ul>
      </div>

      <div className="dashboard-main">
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>My Mentor Profile</h2>
            <p>Welcome, {user.name}! Share your expertise and guide entrepreneurs.</p>
          </div>
        )}

        {activeTab === 'mentees' && (
          <div className="tab-content">
            <h2>My Mentees</h2>
            <p>You currently have 0 mentees.</p>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="tab-content">
            <h2>Mentorship Requests</h2>
            <p>No pending requests.</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="tab-content">
            <h2>Messages</h2>
            <p>No messages yet.</p>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="tab-content">
            <h2>Your Feedback</h2>
            <p>Your rating: 0 ⭐</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorDashboard;