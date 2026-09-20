import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Heart, Users, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-logo">
          <div className="home-logo-icon">
            <Leaf size={24} color="white" />
          </div>
          <span className="home-logo-text">AnnaSetu</span>
        </div>
        <div className="home-nav-links">
          <Link to="/about">About Us</Link>
          <a href="#how-it-works">How It Works</a>
          <a href="#impact">Our Impact</a>
          {user ? (
            <Link to={`/${user.role}`} className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content fade-in">
          <div className="hero-badge">
            <MapPin size={14} />
            <span>Serving Bhopal, Madhya Pradesh</span>
          </div>
          <h1 className="hero-title">
            Zero Food Waste.<br />
            <span className="text-gradient">Zero Hunger.</span>
          </h1>
          <p className="hero-description">
            Connecting surplus food from restaurants, hotels, and events with local NGOs in Bhopal. 
            Join our mission to redistribute edible food to those who need it most.
          </p>
          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Join as Donor <ArrowRight size={18} />
                </Link>
                <Link to="/register?role=ngo" className="btn btn-secondary btn-lg">
                  Register NGO
                </Link>
              </>
            ) : (
              <Link to={`/${user.role}`} className="btn btn-primary btn-lg">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          A seamless digital platform connecting donors and NGOs in real-time.
        </p>
        
        <div className="steps-grid">
          <div className="step-card glass-card-static slide-in">
            <div className="step-number">1</div>
            <h3 className="step-title">Donate Surplus</h3>
            <p className="step-description">
              Restaurants, hotels, or event organizers post available surplus food with quantity, expiry time, and location in Bhopal.
            </p>
          </div>
          
          <div className="step-card glass-card-static slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="step-number">2</div>
            <h3 className="step-title">NGOs Notified</h3>
            <p className="step-description">
              Verified local NGOs receive real-time notifications about available food in their vicinity and can accept the request.
            </p>
          </div>
          
          <div className="step-card glass-card-static slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="step-number">3</div>
            <h3 className="step-title">Track & Deliver</h3>
            <p className="step-description">
              NGOs pick up the food and update the status. Donors track the entire journey from pickup to delivery.
            </p>
          </div>
        </div>
      </section>

      <section id="impact" className="section" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <h2 className="section-title">Our Impact in Bhopal</h2>
        <p className="section-subtitle">
          Together we are making a difference and contributing to UN Sustainable Development Goals 2 & 12.
        </p>
        
        <div className="impact-stats">
          <div className="impact-stat-card fade-in">
            <div className="impact-stat-value text-gradient">2,500+</div>
            <div className="impact-stat-label">Meals Redistributed</div>
          </div>
          <div className="impact-stat-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="impact-stat-value text-gradient-warm">45</div>
            <div className="impact-stat-label">Active Donors</div>
          </div>
          <div className="impact-stat-card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="impact-stat-value text-gradient">12</div>
            <div className="impact-stat-label">Verified NGOs</div>
          </div>
          <div className="impact-stat-card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="impact-stat-value text-gradient-warm">5,000</div>
            <div className="impact-stat-label">kg CO2 Saved</div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 AnnaSetu - Smart Food Waste Management System. Created for Bhopal, MP.</p>
      </footer>
    </div>
  );
}
