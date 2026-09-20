import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Download, FileText, Calendar } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function Reports() {
  const { addToast } = useNotifications();
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleGenerate = (e) => {
    e.preventDefault();
    // Simulate report generation
    addToast({
      type: 'info',
      title: 'Generating Report...',
      message: 'Your report is being compiled. Please wait.',
    });
    
    setTimeout(() => {
      addToast({
        type: 'success',
        title: 'Report Ready',
        message: 'Your report has been successfully downloaded as a CSV file.',
      });
    }, 2000);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>Generate and download analytical reports for stakeholders.</p>
      </div>

      <div className="two-col-layout">
        <div className="glass-card fade-in">
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} className="text-teal" /> Generate Custom Report
          </h3>
          
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select 
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="monthly">Monthly Summary</option>
                <option value="ngo">NGO Performance</option>
                <option value="donor">Donor Activity</option>
                <option value="area">Area-wise Distribution</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Download size={18} /> Generate & Download CSV
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Recent Automated Reports</h3>
          <div className="glass-card fade-in" style={{ animationDelay: '0.1s', padding: 0 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                padding: '16px', 
                borderBottom: i === 3 ? 'none' : '1px solid var(--color-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(0, 212, 170, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--color-teal)' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>August 2026 Summary</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Generated on Sep 1, 2026</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-icon">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
