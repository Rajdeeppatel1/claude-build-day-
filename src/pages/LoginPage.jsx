import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'donor') {
      setEmail('donor@bhopal.com');
      setPassword('donor123');
    } else if (demoRole === 'ngo') {
      setEmail('ngo@bhopal.com');
      setPassword('ngo123');
    } else if (demoRole === 'admin') {
      setEmail('admin@bhopal.com');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const result = login(email, password);
    if (result.success) {
      navigate(`/${result.user.role}`);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <Leaf size={28} color="white" />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your AnnaSetu account</p>
        </div>
        
        {error && <div className="form-error" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-lg">
            <LogIn size={18} /> Sign In
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
        
        <div className="auth-demo-creds">
          <h5>Quick Login (Demo Accounts)</h5>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('donor')}>
              Fill Donor
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('ngo')}>
              Fill NGO
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('admin')}>
              Fill Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
