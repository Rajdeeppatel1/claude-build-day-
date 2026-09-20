import { getStatusSteps, getStatusIndex } from '../../utils/helpers';
import { Check } from 'lucide-react';

export default function StatusTimeline({ currentStatus }) {
  const steps = getStatusSteps();
  const currentIdx = getStatusIndex(currentStatus);

  if (currentStatus === 'rejected' || currentStatus === 'expired') {
    return (
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <span className={`badge ${currentStatus === 'rejected' ? 'badge-red' : 'badge-rose'}`}>
          {currentStatus === 'rejected' ? 'Rejected' : 'Expired'}
        </span>
      </div>
    );
  }

  return (
    <div className="status-timeline">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;
        return (
          <div key={step.key} style={{ display: 'contents' }}>
            <div
              className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="timeline-dot">
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <span className="timeline-label">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`timeline-connector ${isCompleted ? 'completed' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
