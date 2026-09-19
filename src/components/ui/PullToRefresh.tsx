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

  return (
    <>
      {/* Pull-to-Refresh Floating Indicator Badge */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-[9999] pointer-events-none transition-all ${
          isRefreshing ? 'duration-300 ease-out' : 'duration-75 ease-linear'
        }`}
        style={{
          top: `${isRefreshing ? 64 : pullDistance > 0 ? pullDistance + 8 : -70}px`,
          opacity: showIndicator ? Math.min(pullDistance / 25, 1) : 0,
          transform: `translateX(-50%) scale(${
            showIndicator ? Math.min(0.7 + (pullDistance / 55) * 0.3, 1) : 0.6
          })`,
        }}
      >
        <div className="w-12 h-12 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.18)] border border-slate-100 flex items-center justify-center p-2.5">
          <RotateCw
            size={22}
            className={`text-[#b08d57] transition-transform ${
              isRefreshing ? 'animate-spin' : ''
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
