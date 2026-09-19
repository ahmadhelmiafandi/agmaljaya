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
    ? Math.min(pullDistance - 70, 6)
    : -130;

  return (
    <>
      {/* Pull-to-Refresh Liquid Water Wave Canopy & Badge */}
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
        {/* Seamless Fluid Water Wave SVG (No seams, purely smooth C2 cubic curves) */}
        <div className="w-full relative">
          <svg
            viewBox="0 0 400 64"
            preserveAspectRatio="none"
            className="w-full h-16 block filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
          >
            {/* Secondary Soft Water Wave Ripple */}
            <path
              d="M 0 -200 L 400 -200 L 400 10 C 300 12 250 24 232 38 C 218 50 210 56 200 56 C 190 56 182 50 168 38 C 150 24 100 12 0 10 Z"
              fill="rgba(255, 255, 255, 0.45)"
            />

            {/* Primary Pure White Fluid Water Wave */}
            <path
              d="M 0 -200 L 400 -200 L 400 6 C 290 8 245 18 228 32 C 216 44 208 50 200 50 C 192 50 184 44 172 32 C 155 18 110 8 0 6 Z"
              fill="#ffffff"
            />
          </svg>

          {/* White Circular Refresh Badge resting seamlessly in the wave cradle */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-11 h-11 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center justify-center p-2">
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
