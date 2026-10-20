"use client";

import { motion } from "motion/react";

/**
 * Static map of pre-created HTML motion components for client components.
 * Prevents dynamic component creation during render cycles in React 19.
 */
export const motionTagMap = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  ul: motion.ul,
  li: motion.li,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  aside: motion.aside,
  nav: motion.nav,
  main: motion.main,
} as const;

export type MotionElementTag = keyof typeof motionTagMap;
