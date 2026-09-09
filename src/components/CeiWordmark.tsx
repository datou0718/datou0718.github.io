import React from 'react';

interface CeiWordmarkProps {
  className?: string;
}

/**
 * The CEI artwork is used as a mask so it can follow the site's theme color
 * without maintaining separate light- and dark-mode image files.
 */
const CeiWordmark: React.FC<CeiWordmarkProps> = ({ className = '' }) => (
  <a
    className={`cei-wordmark ${className}`.trim()}
    href="https://cei.pratt.duke.edu/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Duke Center for Computational Evolutionary Intelligence"
  >
    <span className="cei-wordmark-image" aria-hidden="true" />
  </a>
);

export default CeiWordmark;
