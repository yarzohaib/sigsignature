import React from "react";

export interface FeatureIconTileProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FeatureIconTile:
 * Wraps the feature card icon tile.
 * Moves up 2px and scales to 1.05 on card hover and card focus-visible via CSS transitions.
 */
export function FeatureIconTile({
  children,
  className = "",
}: FeatureIconTileProps) {
  return (
    <span
      className={`inline-flex items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-focus-visible:-translate-y-0.5 group-focus-visible:scale-105 ${className}`}
    >
      {children}
    </span>
  );
}

export default FeatureIconTile;
