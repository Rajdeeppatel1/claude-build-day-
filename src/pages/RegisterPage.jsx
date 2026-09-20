import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BHOPAL_AREAS } from '../data/seedData';
import { Leaf, UserPlus, Building, User } from 'lucide-react';

export default function RegisterPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'ngo' ? 'ngo' : 'donor';
  
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    organization: '',
    address: '',
    area: BHOPAL_AREAS[0].name,
    license: '',
  });
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.organization || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (role === 'ngo' && !formData.license) {
      setError('NGO Registration Number / License is required');
      return;
    }
    
    const result = register({ ...formData, role });
    
    if (result.success) {
      navigate(`/${result.user.role}`);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '40px 20px' }}>
      <div className="auth-card glass-card fade-in" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <Leaf size={28} color="white" />
          </div>
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join the AnnaSetu network in Bhopal</p>
        </div>
        
        <div className="role-selector">
          <button 
            className={`role-option ${role === 'donor' ? 'selected' : ''}`}
            onClick={() => setRole('donor')}
          >
            <User size={24} />
            <span className="role-option-label">Food Donor</span>
          </button>
          <button 
            className={`role-option ${role === 'ngo' ? 'selected' : ''}`}
            onClick={() => setRole('ngo')}
          >
            <Building size={24} />
            <span className="role-option-label">NGO Partner</span>
          </button>
        </div>
        
        {error && <div className="form-error" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                name="password"
                className="form-input" 
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                className="form-input" 
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              {role === 'donor' ? 'Organization / Restaurant Name *' : 'NGO Name *'}
            </label>
            <input 
              type="text" 
              name="organization"
              className="form-input" 
              placeholder={role === 'donor' ? 'e.g., Sharma Restaurant' : 'e.g., Feeding India Bhopal'}
              value={formData.organization}
              onChange={handleChange}
            />
          </div>
          
          {role === 'ngo' && (
            <div className="form-group">
              <label className="form-label">NGO Registration / License No. *</label>
              <input 
                type="text" 
                name="license"
                className="form-input" 
                placeholder="e.g., NGO-MP-2024-XXXX"
                value={formData.license}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Area in Bhopal *</label>
              <select 
                name="area" 
                className="form-select"
                value={formData.area}
                onChange={handleChange}
              >
                {BHOPAL_AREAS.map(area => (
                  <option key={area.name} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Full Address *</label>
              <input 
                type="text" 
                name="address"
                className="form-input" 
                placeholder="Street, Building, Landmark"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '16px' }}>
            <UserPlus size={18} /> Register as {role === 'donor' ? 'Donor' : 'NGO'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
