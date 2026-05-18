import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const newsprintVariants = {
  initial: { opacity: 0, y: 16, filter: 'contrast(1.1) brightness(0.95)' },
  animate: { opacity: 1, y: 0, filter: 'contrast(1) brightness(1)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, filter: 'contrast(1.05) brightness(0.97)', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={newsprintVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
