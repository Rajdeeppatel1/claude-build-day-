import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getInitials, formatDate } from '../../utils/helpers';
import { BHOPAL_AREAS } from '../../data/seedData';
import { Save, Building, FileText, CheckCircle, MapPin } from 'lucide-react';

export default function NGOProfile() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    organization: user.organization || '',
    address: user.address || '',
    serviceAreas: user.serviceAreas || [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAreaToggle = (areaName) => {
    setFormData(prev => {
      const areas = [...prev.serviceAreas];
      if (areas.includes(areaName)) {
        return { ...prev, serviceAreas: areas.filter(a => a !== areaName) };
      } else {
        return { ...prev, serviceAreas: [...areas, areaName] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your organization details have been saved successfully.',
    });
  };

  return (
    <div>
      <div className="profile-header fade-in">
        <div className="profile-avatar-large">
          {getInitials(user.organization || user.name)}
        </div>
        <div className="profile-info">
          <h2>{user.organization}</h2>
          <p>{user.email} • NGO Partner since {formatDate(user.createdAt)}</p>
          <div style={{ marginTop: '8px' }}>
            <span className="badge badge-teal">Verified NGO</span>
            <span className="badge badge-blue" style={{ marginLeft: '8px' }}>{user.license}</span>
          </div>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={18} className="text-teal" /> Organization Details
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Representative Name</label>
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
            
            <div className="form-group">
              <label className="form-label">Office Address</label>
              <textarea 
                name="address"
                className="form-textarea" 
                style={{ minHeight: '80px' }}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <h3 style={{ margin: '10px 0 0 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} className="text-teal" /> Service Areas in Bhopal
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
              Select the areas where your NGO can collect food. You will only receive notifications for these areas.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BHOPAL_AREAS.map(area => (
                <button
                  key={area.name}
                  type="button"
                  className={`btn ${formData.serviceAreas.includes(area.name) ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ 
                    padding: '6px 12px', 
                    border: formData.serviceAreas.includes(area.name) ? 'none' : '1px solid var(--color-border)',
                    borderRadius: '20px'
                  }}
                  onClick={() => handleAreaToggle(area.name)}
                >
                  {area.name}
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <div className="glass-card fade-in" style={{ animationDelay: '0.2s', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} className="text-teal" /> License & Verification
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)' }}>
                  <CheckCircle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Admin Approved</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>You can accept and collect donations.</div>
                </div>
              </div>
              
              <div style={{ background: 'var(--color-bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Registered License Number</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', fontFamily: 'monospace' }}>{user.license}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                  To update your license information, please contact the AnnaSetu admin team.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
