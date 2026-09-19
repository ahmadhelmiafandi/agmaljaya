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
        // Smooth, instant fluid tracking
        const distance = Math.min(delta * 0.65, 75);
        setPullDistance(distance);
        // Prevent native browser overscroll/pull
        if (delta > 10 && e.cancelable) {
          e.preventDefault();
        }
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      // Sensitive trigger threshold (~26px of pull)
      if (pullDistance >= 26) {
        setIsRefreshing(true);
        setPullDistance(0);

        try {
          if ('vibrate' in navigator) navigator.vibrate(25);
        } catch (_) {}

        try {
          if (onRefresh) {
            await Promise.resolve(onRefresh());
            // Hold briefly for visual satisfaction (matching Frame 5 of reference)
            await new Promise((res) => setTimeout(res, 750));
          } else {
            await new Promise((res) => setTimeout(res, 850));
            window.location.reload();
            return;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsRefreshing(false);
        }
      } else {
        setPullDistance(0);
      }
    };

    // Mouse event handlers for desktop / simulator testing
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
        const distance = Math.min(delta * 0.65, 75);
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

  const showCircle = isRefreshing || pullDistance > 5;
  const rotationAngle = isRefreshing ? undefined : (pullDistance / 26) * 360;

  // Floating position:
  // - While pulling: smoothly descends below the navbar (from top 15px down to ~80px)
  // - While refreshing (Frame 5): stays floating at top: 80px
  // - At rest: tucked away off-screen (-60px)
  const circleTop = isRefreshing
    ? 80
    : pullDistance > 0
    ? Math.min(15 + pullDistance * 1.0, 85)
    : -60;

  return (
    <>
      {/* Floating Refresh Badge (Clean, elegant, matches Frame 5 of reference without touching header) */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-[100] pointer-events-none ${
          isPulling.current ? 'transition-none' : 'transition-all duration-300 ease-out'
        }`}
        style={{
          top: `${circleTop}px`,
          opacity: showCircle ? 1 : 0,
          transform: `translateX(-50%) scale(${
            showCircle ? (isRefreshing ? 1 : Math.min(0.5 + (pullDistance / 26) * 0.5, 1)) : 0.4
          })`,
        }}
      >
        <div className="w-11 h-11 bg-white rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.35)] border border-slate-100 flex items-center justify-center p-2">
          <RotateCw
            size={22}
            className={`transition-colors ${
              isRefreshing
                ? 'animate-spin text-[#b08d57]'
                : 'text-[#64748b]'
            }`}
            style={
              !isRefreshing
                ? { transform: `rotate(${rotationAngle}deg)` }
                : undefined
            }
          />
        </div>
      </div>

      {children}
    </>
  );
}
