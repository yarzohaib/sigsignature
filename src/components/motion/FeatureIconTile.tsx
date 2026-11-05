import React from "react";

export interface FeatureIconTileProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FeatureIconTile:
 * Wraps the feature card icon tile.
 */
export function FeatureIconTile({
  children,
  className = "",
}: FeatureIconTileProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </span>
  );
}

export default FeatureIconTile;
