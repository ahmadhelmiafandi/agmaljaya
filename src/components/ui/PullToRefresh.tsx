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
        // Smooth, responsive resistance
        const distance = Math.min(delta * 0.7, 75);
        setPullDistance(distance);
        if (delta > 8 && e.cancelable) {
          e.preventDefault();
        }
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      // Sensitive trigger threshold (~45px of natural drag)
      if (pullDistance >= 32) {
        setIsRefreshing(true);
        setPullDistance(45);

        try {
          if ('vibrate' in navigator) navigator.vibrate(20);
        } catch (_) {}

        try {
          if (onRefresh) {
            await Promise.resolve(onRefresh());
            await new Promise((res) => setTimeout(res, 650));
          } else {
            await new Promise((res) => setTimeout(res, 750));
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

    // Mouse event handlers for desktop / simulator testing
    const handleMouseDown = (e: MouseEvent) => {
      if (window.scrollY <= 5 && e.clientY < 120 && !isRefreshing) {
        startY.current = e.clientY;
        isPulling.current = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPulling.current || isRefreshing) return;
      const delta = e.clientY - startY.current;
      if (delta > 0 && window.scrollY <= 5) {
        const distance = Math.min(delta * 0.7, 75);
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
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
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

  // Dynamic calculation for the water wave dip depth
  const activeDistance = isRefreshing ? 42 : pullDistance;
  const showWave = activeDistance > 2 || isRefreshing;

  // dipY: starts at 4, smoothly expands down to ~52px
  const dipY = activeDistance > 0 ? 4 + Math.min(activeDistance * 1.15, 48) : 4;
  const rotationAngle = isRefreshing ? undefined : (pullDistance / 32) * 360;

  // Badge scale & opacity based on pull progress
  const badgeProgress = Math.min(activeDistance / 24, 1);
  const badgeTop = dipY - 34;

  return (
    <>
      {/* Elastic Liquid Wave Canvas (Fixed at top of screen) */}
      <div
        className={`fixed top-0 left-0 right-0 z-[100] pointer-events-none ${
          isRefreshing
            ? 'transition-all duration-300 ease-out'
            : isPulling.current
            ? ''
            : 'transition-all duration-300 ease-out'
        }`}
        style={{
          opacity: showWave ? 1 : 0,
        }}
      >
        {/* Dynamic Water Wave SVG with continuous, smooth cubic curves */}
        <div className="w-full relative">
          <svg
            viewBox="0 0 400 65"
            preserveAspectRatio="none"
            className="w-full h-[65px] block filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.09)]"
          >
            {/* Seamless white water wave stretching dynamically */}
            <path
              d={`M 0 -150 L 400 -150 L 400 4 C 280 4, 240 ${dipY}, 200 ${dipY} C 160 ${dipY}, 120 4, 0 4 Z`}
              fill="#ffffff"
            />
          </svg>

          {/* Floating Circular Badge nested at the apex of the wave */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center transition-opacity"
            style={{
              top: `${badgeTop}px`,
              opacity: badgeProgress,
              transform: `translateX(-50%) scale(${0.5 + badgeProgress * 0.5})`,
            }}
          >
            <RotateCw
              size={20}
              className={`transition-colors ${
                isRefreshing ? 'animate-spin text-[#b08d57]' : 'text-[#64748b]'
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
