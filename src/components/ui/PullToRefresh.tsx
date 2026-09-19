import React, { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh?: () => Promise<void> | void;
  children?: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    // Touch event handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 5 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - startY.current;

      if (delta > 0 && window.scrollY <= 5) {
        const distance = Math.min(delta * 0.45, 90);
        setPullDistance(distance);
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (pullDistance >= 55) {
        setIsRefreshing(true);
        setPullDistance(60);

        try {
          if ('vibrate' in navigator) navigator.vibrate(25);
        } catch (_) {}

        try {
          if (onRefresh) {
            await Promise.resolve(onRefresh());
            // Hold briefly for visual satisfaction
            await new Promise((res) => setTimeout(res, 600));
          } else {
            await new Promise((res) => setTimeout(res, 800));
            window.location.reload();
            return;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    // Mouse event handlers for desktop / responsive mode testing
    const handleMouseDown = (e: MouseEvent) => {
      if (window.scrollY <= 5 && e.clientY < 140 && !isRefreshing) {
        startY.current = e.clientY;
        isPulling.current = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPulling.current || isRefreshing) return;
      const delta = e.clientY - startY.current;
      if (delta > 0 && window.scrollY <= 5) {
        const distance = Math.min(delta * 0.45, 90);
        setPullDistance(distance);
      } else {
        setPullDistance(0);
      }
    };

    const handleMouseUp = () => {
      if (isPulling.current) {
        handleTouchEnd();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRefreshing, pullDistance, onRefresh]);

  const showIndicator = pullDistance > 5 || isRefreshing;
  const rotationAngle = isRefreshing ? undefined : (pullDistance / 55) * 360;

  // Calculate vertical position for the canopy
  const canopyTranslateY = isRefreshing
    ? 0
    : pullDistance > 0
    ? Math.min(pullDistance - 72, 6)
    : -130;

  return (
    <>
      {/* Pull-to-Refresh Curved Canopy & Badge (Matches Reference Image 2) */}
      <div
        className={`fixed top-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center transition-transform ${
          isRefreshing
            ? 'duration-300 ease-out'
            : isPulling.current
            ? 'duration-0'
            : 'duration-300 ease-out'
        }`}
        style={{
          transform: `translateY(${canopyTranslateY}px)`,
          opacity: showIndicator ? 1 : 0,
        }}
      >
        {/* Solid white top bar */}
        <div className="w-full h-8 bg-white" />

        {/* Curved Wave Dip SVG */}
        <div className="w-full relative">
          <svg
            viewBox="0 0 400 48"
            preserveAspectRatio="none"
            className="w-full h-10 fill-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.08)] block"
          >
            <path d="M 0 0 L 400 0 L 400 6 Q 295 14 238 26 C 222 39 212 45 200 45 C 188 45 178 39 162 26 Q 105 14 0 6 Z" />
          </svg>

          {/* White Circular Refresh Badge resting in the curved dip */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-11 h-11 bg-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.12)] border border-slate-100/90 flex items-center justify-center p-2">
            <RotateCw
              size={22}
              className={`transition-colors ${
                isRefreshing
                  ? 'animate-spin text-[#b08d57]'
                  : 'text-[#94a3b8]'
              }`}
              style={
                !isRefreshing
                  ? { transform: `rotate(${rotationAngle}deg)` }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
