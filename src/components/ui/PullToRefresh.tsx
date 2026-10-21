import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RotateCw, Check } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh?: () => Promise<void> | void;
  children?: React.ReactNode;
}

function getScrollTop(): number {
  return Math.max(
    0,
    window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  );
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const startY = useRef(0);
  const pulling = useRef(false);
  const pullVal = useRef(0);
  const busy = useRef(false);
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;

  useEffect(() => {
    // Only enable on touch devices (mobile/tablet) - Desktop has zero pull-to-refresh listeners
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (!isTouchDevice) return;

    const onStart = (e: TouchEvent) => {
      if (busy.current) return;
      if (getScrollTop() <= 4) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
        setIsDragging(true);
      }
    };

    const onMove = (e: TouchEvent) => {
      if (!pulling.current || busy.current) return;
      const y = e.touches[0].clientY;
      const delta = y - startY.current;
      const scrollTop = getScrollTop();

      if (delta > 0 && scrollTop <= 4) {
        // Smooth logarithmic resistance dampening for natural feel
        const dist = Math.min(delta * 0.45, 80);
        setPullDistance(dist);
        pullVal.current = dist;
        if (delta > 8 && e.cancelable) {
          e.preventDefault();
        }
      } else if (delta <= 0) {
        if (pullVal.current > 0) {
          setPullDistance(0);
          pullVal.current = 0;
        }
      }
    };

    const onEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      const val = pullVal.current;

      const THRESHOLD = 52;
      if (val >= THRESHOLD) {
        busy.current = true;
        setIsRefreshing(true);
        setPullDistance(THRESHOLD);
        pullVal.current = THRESHOLD;
        setIsDragging(false);

        try {
          if ('vibrate' in navigator) navigator.vibrate(20);
        } catch (_) {}

        try {
          if (cbRef.current) {
            await Promise.resolve(cbRef.current());
            await new Promise((r) => setTimeout(r, 600));
          } else {
            await new Promise((r) => setTimeout(r, 600));
            window.location.reload();
            return;
          }
          setIsSuccess(true);
          await new Promise((r) => setTimeout(r, 450));
        } catch (err) {
          console.error(err);
        } finally {
          setIsRefreshing(false);
          setIsSuccess(false);
          setPullDistance(0);
          pullVal.current = 0;
          busy.current = false;
        }
      } else {
        setPullDistance(0);
        pullVal.current = 0;
        setIsDragging(false);
      }
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
  }, []);

  const showIndicator = isRefreshing || pullDistance > 6;
  const progress = Math.min(pullDistance / 52, 1);
  const translateY = isRefreshing
    ? 20
    : pullDistance > 0
    ? -45 + progress * 65
    : -50;

  const indicator = createPortal(
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${translateY}px)`,
        opacity: showIndicator ? 1 : 0,
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${isRefreshing ? 1 : Math.max(0.75, progress)})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
      >
        {isSuccess ? (
          <Check size={20} className="text-teal-600 animate-in zoom-in-50 duration-200" strokeWidth={2.5} />
        ) : (
          <RotateCw
            size={19}
            strokeWidth={2.4}
            style={{
              color: progress >= 1 || isRefreshing ? '#0d9488' : '#64748b',
              transform: !isRefreshing ? `rotate(${progress * 280}deg)` : undefined,
              animation: isRefreshing ? 'ptr-spin 0.8s linear infinite' : undefined,
            }}
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ptr-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>,
    document.body
  );

  return (
    <>
      {indicator}
      {children}
    </>
  );
}
