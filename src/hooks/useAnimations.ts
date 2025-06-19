import { AnimationProps } from 'framer-motion';

export const useAnimations = () => {
  const containerVariants: AnimationProps["variants"] = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: AnimationProps["variants"] = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardHoverVariants: AnimationProps["variants"] = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return {
    containerVariants,
    itemVariants,
    cardHoverVariants
  };
}; 