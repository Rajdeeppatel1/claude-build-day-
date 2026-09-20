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
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'} ${className}`}
      {...props}
    >
      {children}
      {icon && <i className={icon} style={{ fontSize: '1.1em' }}></i>}
    </motion.button>
  );
}
