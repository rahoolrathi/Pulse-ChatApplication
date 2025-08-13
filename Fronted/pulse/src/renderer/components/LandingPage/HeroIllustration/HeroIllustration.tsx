'use client';

import { useState } from 'react';
import styles from './style.module.scss';
import {
  menSvg,
  menHoverSvg,
  womenSvg,
  womenHoverSvg,
  planetSvg,
  planetHoverSvg,
  marksSvg,
} from '../../../assets/icons';

export default function HeroIllustration() {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const handleMouseEnter = (element: string) => {
    setHoveredElement(element);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  const getClassName = (baseClass: string, isVisible: boolean, visibleClass: string) =>
    `${baseClass} ${isVisible ? visibleClass : ''}`;

  return (
    <div className={styles.illustrationContainer}>
      {/* Men */}
      <div
        className={`${styles.svgWrapper} ${styles.menWrapper}`}
        onMouseEnter={() => handleMouseEnter('men')}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={menSvg}
          alt="Men illustration"
          className={getClassName(styles.defaultSvg, hoveredElement === 'men', styles.hidden)}
        />
        <img
          src={menHoverSvg}
          alt="Men hover illustration"
          className={getClassName(styles.hoverSvg, hoveredElement === 'men', styles.visible)}
        />
      </div>

      {/* Women */}
      <div
        className={`${styles.svgWrapper} ${styles.womenWrapper}`}
        onMouseEnter={() => handleMouseEnter('women')}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={womenSvg}
          alt="Women illustration"
          className={getClassName(styles.defaultSvg, hoveredElement === 'women', styles.hidden)}
        />
        <img
          src={womenHoverSvg}
          alt="Women hover illustration"
          className={getClassName(styles.hoverSvg, hoveredElement === 'women', styles.visible)}
        />
      </div>

      {/* Planet */}
      <div
        className={`${styles.svgWrapper} ${styles.planetWrapper}`}
        onMouseEnter={() => handleMouseEnter('planet')}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={planetSvg}
          alt="Planet illustration"
          className={getClassName(styles.defaultSvg, hoveredElement === 'planet', styles.hidden)}
        />
        <img
          src={planetHoverSvg}
          alt="Planet hover illustration"
          className={getClassName(styles.hoverSvg, hoveredElement === 'planet', styles.visible)}
        />
      </div>

      {/* Location Marks */}
      <div className={styles.locationMarks}>
        <img src={marksSvg} alt="Location marks" className={styles.marks} />
      </div>
    </div>
  );
}
