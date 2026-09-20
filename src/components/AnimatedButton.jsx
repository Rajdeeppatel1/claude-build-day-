import { motion } from 'framer-motion';
import 'remixicon/fonts/remixicon.css';

export default function AnimatedButton({ 
  children, 
  variant = 'primary', 
  icon = null, 
  onClick, 
  className = '',
  ...props 
}) {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 28px',
        borderRadius: '9999px',
        fontWeight: 600,
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${isPrimary ? 'var(--color-black)' : 'var(--color-border)'}`,
        background: isPrimary ? 'var(--color-black)' : 'var(--color-white)',
        color: isPrimary ? 'var(--color-white)' : 'var(--color-black)',
        cursor: 'pointer',
      }}
      {...props}
    >
      {/* Cool sliding background animation on hover */}
      <motion.div
        className="btn-bg-slide"
        initial={{ x: '-100%' }}
        whileHover={{ x: 0 }}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isPrimary ? 'var(--color-white)' : 'var(--color-black)',
          zIndex: 0,
        }}
      />
      
      <motion.span 
        style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}
        whileHover={{ color: isPrimary ? 'var(--color-black)' : 'var(--color-white)' }}
      >
        {children}
        {icon && <i className={icon} style={{ fontSize: '1.2em' }}></i>}
      </motion.span>
    </motion.button>
  );
}
