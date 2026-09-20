import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getInitials, formatDate } from '../../utils/helpers';
import { Save, User, Building, MapPin, Phone, Mail } from 'lucide-react';

export default function DonorProfile() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    organization: user.organization || '',
    address: user.address || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your account details have been saved successfully.',
    });
  };

  return (
    <div>
      <div className="profile-header fade-in">
        <div className="profile-avatar-large">
          {getInitials(user.name)}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email} • Member since {formatDate(user.createdAt)}</p>
          <div style={{ marginTop: '8px' }}>
            <span className="badge badge-teal">Verified Donor</span>
          </div>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} className="text-teal" /> Personal Information
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  className="form-input" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <h3 style={{ margin: '10px 0 0 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} className="text-teal" /> Organization Details
            </h3>
            
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input 
                type="text" 
                name="organization"
                className="form-input" 
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Default Pickup Address</label>
              <textarea 
                name="address"
                className="form-textarea" 
                style={{ minHeight: '80px' }}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bhopal Area</label>
              <input 
                type="text" 
                className="form-input" 
                value={user.area}
                disabled
                style={{ opacity: 0.7 }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Area changes require admin approval.</span>
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <div className="glass-card fade-in" style={{ animationDelay: '0.2s', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Account Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)' }}>
                  <CheckCircle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Email Verified</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)' }}>
                  <CheckCircle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Donor Approved</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>You can post donations immediately.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { CheckCircle } from 'lucide-react';
