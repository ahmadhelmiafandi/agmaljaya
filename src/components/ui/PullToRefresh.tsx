import React, { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh?: () => Promise<void> | void;
  onPullChange?: (active: boolean) => void;
  children?: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, onPullChange, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  // Notify parent component (Home/Navbar) to activate solid white mode
  useEffect(() => {
    const active = isRefreshing || pullDistance > 3;
    onPullChange?.(active);
  }, [pullDistance, isRefreshing, onPullChange]);

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
        // Highly responsive, instant fluid tracking
        const distance = Math.min(delta * 0.65, 65);
        setPullDistance(distance);
        // Prevent native browser overscroll/pull
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

      // Sensitive trigger threshold (~28px of pull)
      if (pullDistance >= 26) {
        setIsRefreshing(true);
        setPullDistance(0); // The elastic wave snaps back up immediately (Frame 4 & 5)

        try {
          if ('vibrate' in navigator) navigator.vibrate(25);
        } catch (_) {}

        try {
          if (onRefresh) {
            await Promise.resolve(onRefresh());
            // Hold briefly for visual satisfaction (Frame 5)
            await new Promise((res) => setTimeout(res, 700));
          } else {
            await new Promise((res) => setTimeout(res, 800));
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
        const distance = Math.min(delta * 0.65, 65);
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

  // Gentle, wide, full-width fluid wave (spans entire 400px width with soft, gentle curvature)
  const dipDepth = pullDistance > 0 ? Math.min(pullDistance * 0.55, 26) : 0;
  const baseY = 1;
  const centerDipY = baseY + dipDepth;

  // Ultra-smooth full-width Bezier wave (no sharp angles or narrow V-wedges)
  const wavePath = `M 0 -100 L 400 -100 L 400 ${baseY} C 310 ${baseY}, 255 ${centerDipY}, 200 ${centerDipY} C 145 ${centerDipY}, 90 ${baseY}, 0 ${baseY} Z`;

  // Circle vertical position below the header:
  // - While pulling: nestled right in the gentle wave dip
  // - While refreshing (Frame 5): floats below the header at top: 68px
  // - At rest: tucked away
  const circleTop = isRefreshing
    ? 68
    : pullDistance > 0
    ? Math.max(48 + centerDipY - 14, 20)
    : -60;

  const showCircle = isRefreshing || pullDistance > 6;
  const rotationAngle = isRefreshing ? undefined : (pullDistance / 26) * 360;

  return (
    <>
      {/* Massive 600px pure white ceiling preventing ANY brown gap during iOS Safari rubber-band overscroll */}
      <div className={`fixed top-[-600px] left-0 right-0 h-[600px] bg-white z-[60] transition-opacity duration-200 ${
        isRefreshing || pullDistance > 0 ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Gentle Fluid Water Wave attached to bottom edge of the white Navbar */}
      <div
        className={`fixed top-[52px] md:top-[60px] left-0 right-0 z-[45] pointer-events-none ${
          isPulling.current ? 'transition-none' : 'transition-all duration-300 ease-out'
        }`}
        style={{
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <svg
          viewBox="0 0 400 45"
          preserveAspectRatio="none"
          className="w-full h-9 block filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] fill-white"
        >
          <path d={wavePath} />
        </svg>
      </div>

      {/* Floating Refresh Badge (Matches Frame 2, 3, and 5) */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-[65] pointer-events-none ${
          isPulling.current ? 'transition-none' : 'transition-all duration-300 ease-out'
        }`}
        style={{
          top: `${circleTop}px`,
          opacity: showCircle ? 1 : 0,
          transform: `translateX(-50%) scale(${showCircle ? (isRefreshing ? 1 : Math.min(0.6 + (pullDistance / 26) * 0.4, 1)) : 0.5})`,
        }}
      >
        <div className="w-11 h-11 bg-white rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.14)] border border-slate-100 flex items-center justify-center p-2">
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
