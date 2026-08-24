import { useState, useEffect, useRef, useCallback } from 'react';

export interface DeviceInfo {
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface CardLayoutConfig {
  cardWidth: number;
  cardHeight: number;
  stepOffset: number;
  totalFanWidth: number;
  maxAngle: number;
  arcFactor: number;
  fontSize: number;
  suitSize: number;
  trickCardWidth: number;
  trickCardHeight: number;
}

/**
 * Custom hook to detect container dimensions, screen orientation, and pixel ratio,
 * dynamically scaling card sizes and fan layout so elements NEVER overflow or collide.
 */
export function useDeviceScale(cardCount: number = 13) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 700,
  });

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 390;
    const h = typeof window !== 'undefined' ? window.innerHeight : 700;
    const pr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const isPortrait = h >= w;

    return {
      orientation: isPortrait ? 'portrait' : 'landscape',
      pixelRatio: pr,
      width: w,
      height: h,
      isMobile: w < 640,
      isTablet: w >= 640 && w < 1024,
      isDesktop: w >= 1024,
    };
  });

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0) w = rect.width;
      if (rect.height > 0) h = rect.height;
    }

    const pr = window.devicePixelRatio || 1;
    const isPortrait = h >= w;

    setContainerSize({ width: w, height: h });
    setDeviceInfo({
      orientation: isPortrait ? 'portrait' : 'landscape',
      pixelRatio: pr,
      width: w,
      height: h,
      isMobile: w < 640,
      isTablet: w >= 640 && w < 1024,
      isDesktop: w >= 1024,
    });
  }, []);

  useEffect(() => {
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setContainerSize({ width, height });
          }
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateDimensions]);

  // Dimensions based on ACTUAL container geometry
  const w = containerSize.width;
  const h = containerSize.height;

  // Maximum width available for the card fan (with safety padding for screen edges)
  const maxHandWidth = Math.max(260, Math.min(w - 20, 720));

  // Determine hand card dimensions based on container height
  // In a mobile container of height 600px: bottom hand should be ~100-115px tall
  let cardHeight: number;
  let baseCardWidth: number;

  if (h < 560) {
    // Very compact height (e.g. mobile landscape or small pane)
    cardHeight = Math.max(85, Math.round(h * 0.18));
    baseCardWidth = Math.round(cardHeight * 0.48);
  } else if (h < 750) {
    // Standard mobile portrait
    cardHeight = Math.max(105, Math.min(125, Math.round(h * 0.17)));
    baseCardWidth = Math.round(cardHeight * 0.48);
  } else {
    // Large screen / desktop
    cardHeight = Math.min(160, Math.round(h * 0.19));
    baseCardWidth = Math.round(cardHeight * 0.48);
  }

  // Trick cards in center table: must be compact so North & South NEVER collide
  // Inside center area of ~180-240px, cards must be ~64-85px tall
  let trickCardHeight: number;
  let trickCardWidth: number;

  if (h < 560) {
    trickCardHeight = 60;
    trickCardWidth = 42;
  } else if (h < 750) {
    trickCardHeight = Math.min(78, Math.max(65, Math.round(h * 0.11)));
    trickCardWidth = Math.round(trickCardHeight * 0.68);
  } else {
    trickCardHeight = 96;
    trickCardWidth = 66;
  }

  const count = Math.max(1, cardCount);

  // Step offset calculation for hand fan
  let stepOffset: number;
  if (count === 1) {
    stepOffset = 0;
  } else {
    const requiredSpan = maxHandWidth - baseCardWidth;
    const naturalStep = baseCardWidth * 0.42;
    const maxPossibleStep = requiredSpan / (count - 1);
    stepOffset = Math.min(naturalStep, maxPossibleStep);

    // Safeguard: Ensure legible rank index is visible
    if (stepOffset < 16 && count > 1) {
      stepOffset = Math.max(14, (maxHandWidth - baseCardWidth) / (count - 1));
    }
  }

  const totalFanWidth = count === 1 ? baseCardWidth : (count - 1) * stepOffset + baseCardWidth;

  // Arc rotation tuning
  const maxAngle = count > 8 ? 10 : count > 4 ? 6 : 3;
  const arcFactor = count > 8 ? 0.6 : 0.3;

  // Font and Suit icon scale
  const fontSize = Math.max(18, Math.min(30, Math.round(baseCardWidth * 0.42)));
  const suitSize = Math.max(12, Math.min(18, Math.round(baseCardWidth * 0.28)));

  const cardConfig: CardLayoutConfig = {
    cardWidth: baseCardWidth,
    cardHeight,
    stepOffset,
    totalFanWidth,
    maxAngle,
    arcFactor,
    fontSize,
    suitSize,
    trickCardWidth,
    trickCardHeight,
  };

  return {
    containerRef,
    deviceInfo,
    containerSize,
    cardConfig,
  };
}
