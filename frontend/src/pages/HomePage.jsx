// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">👩‍💼 mentHer</h1>
          <div className="nav-links">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h2>Empowering Women Entrepreneurs</h2>
          <p>Connect with experienced mentors, access funding opportunities, and discover government schemes designed to support women-owned businesses.</p>
          
          <div className="hero-buttons">
            <Link to="/signup?role=entrepreneur" className="btn btn-large btn-primary">
              I'm an Entrepreneur
            </Link>
            <Link to="/signup?role=mentor" className="btn btn-large btn-secondary">
              I'm a Mentor
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why mentHer?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🤝 Mentorship</h3>
            <p>Get paired with experienced women mentors in your field who can guide your journey.</p>
          </div>
          
          <div className="feature-card">
            <h3>💰 Funding Info</h3>
            <p>Access comprehensive information about funding opportunities and investment schemes.</p>
          </div>
          
          <div className="feature-card">
            <h3>📋 Government Schemes</h3>
            <p>Discover government schemes designed to support women entrepreneurs and businesses.</p>
          </div>
          
          <div className="feature-card">
            <h3>💬 Community</h3>
            <p>Join a supportive community of women entrepreneurs and mentors sharing experiences.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account and choose your role (Entrepreneur or Mentor)</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create Profile</h3>
            <p>Tell us about your business ideas, expertise, or mentoring interests</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Matched</h3>
            <p>Our system matches you with suitable mentors or mentees based on expertise</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Start Learning</h3>
            <p>Connect, chat, and grow together. Access funding and scheme information.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 mentHer - Empowering Women Entrepreneurs</p>
      </footer>
    </div>
  );
}

export default HomePage;