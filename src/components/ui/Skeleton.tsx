import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Atomic skeleton block with rounded corners and shimmer animation.
 * Blocks default to aria-hidden="true" so screen readers don't announce every individual shape.
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-lg bg-slate-200/80 ${className}`}
      {...props}
    />
  );
}

interface SkeletonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/**
 * Accessible container for a group of skeletons.
 * Sets aria-busy="true" and provides a single visually hidden live status text for screen readers.
 */
export function SkeletonContainer({
  children,
  label = "Loading content...",
  className = "",
  ...props
}: SkeletonContainerProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={`relative w-full ${className}`}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export default Skeleton;
