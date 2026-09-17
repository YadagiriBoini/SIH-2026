import type { Variants } from 'framer-motion';

/**
 * Framer Motion's Variants type requires `ease` to be an Easing string,
 * not a raw number[]. Use 'easeOut' or 'circOut' for smooth entrance animations.
 */
export const makeFadeUp = (): Variants => ({
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.65,
      ease: 'easeOut' as const,
    },
  }),
});

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.65,
      ease: 'easeOut' as const,
    },
  }),
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
