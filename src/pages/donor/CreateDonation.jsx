import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { BHOPAL_AREAS, FOOD_TYPES, BHOPAL_CENTER } from '../../data/seedData';
import MapView from '../../components/UI/MapView';
import { Save, AlertCircle } from 'lucide-react';

export default function CreateDonation() {
  const { user } = useAuth();
  const { createDonation } = useData();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodType: FOOD_TYPES[0],
    quantity: '',
    description: '',
    expiryHours: '4',
    pickupLocation: user.address || '',
    area: user.area || BHOPAL_AREAS[0].name,
  });
  
  const [error, setError] = useState('');

  const selectedAreaObj = BHOPAL_AREAS.find(a => a.name === formData.area);
  const mapCenter = selectedAreaObj ? [selectedAreaObj.lat, selectedAreaObj.lng] : [BHOPAL_CENTER.lat, BHOPAL_CENTER.lng];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.quantity || !formData.description || !formData.pickupLocation) {
      setError('Please fill in all required fields');
      return;
    }

    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + parseInt(formData.expiryHours));

    const newDonation = createDonation({
      donorId: user.id,
      donorName: user.name,
      donorOrg: user.organization,
      foodType: formData.foodType,
      quantity: formData.quantity,
      description: formData.description,
      expiryTime: expiryTime.toISOString(),
      preparedAt: new Date().toISOString(),
      pickupLocation: formData.pickupLocation,
      area: formData.area,
      lat: mapCenter[0],
      lng: mapCenter[1],
    });

    addToast({
      type: 'success',
      title: 'Donation Created!',
      message: 'NGOs in your area have been notified.',
    });

    navigate('/donor');
  };

  return (
    <div>
      <div className="page-header">
        <h1>New Donation</h1>
        <p>Post surplus food details to notify nearby NGOs.</p>
      </div>

      <div className="two-col-layout">
        <div className="glass-card fade-in">
          {error && (
            <div className="form-error" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Food Type *</label>
                <select name="foodType" className="form-select" value={formData.foodType} onChange={handleChange}>
                  {FOOD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input 
                  type="text" 
                  name="quantity"
                  className="form-input" 
                  placeholder="e.g., 50 plates, 20 kg"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea 
                name="description"
                className="form-textarea" 
                placeholder="Details about the food, packaging, dietary info..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expires In (Hours) *</label>
                <select name="expiryHours" className="form-select" value={formData.expiryHours} onChange={handleChange}>
                  <option value="2">2 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="6">6 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area in Bhopal *</label>
                <select name="area" className="form-select" value={formData.area} onChange={handleChange}>
                  {BHOPAL_AREAS.map(area => (
                    <option key={area.name} value={area.name}>{area.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Exact Pickup Location / Address *</label>
              <input 
                type="text" 
                name="pickupLocation"
                className="form-input" 
                placeholder="Street name, landmark..."
                value={formData.pickupLocation}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} /> Post Donation
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px 0' }}>Pickup Location Map</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            NGOs will see this location to estimate travel time. The map centers on your selected area in Bhopal.
          </p>
          <MapView 
            center={mapCenter} 
            zoom={14}
            markers={[{ lat: mapCenter[0], lng: mapCenter[1], popup: { title: formData.area, description: formData.pickupLocation } }]}
          />
        </div>
      </div>
    </div>
  );
}
