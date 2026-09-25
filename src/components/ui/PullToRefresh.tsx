import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RotateCw } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);

  const startY = useRef(0);
  const pulling = useRef(false);
  const pullVal = useRef(0);
  const busy = useRef(false);
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;

  useEffect(() => {
    // Touch event handlers for mobile
    const onStart = (e: TouchEvent) => {
      if (busy.current) return;
      if (getScrollTop() <= 8) {
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

      if (delta > 0 && scrollTop <= 8) {
        const dist = Math.min(delta * 0.55, 75);
        setPullDistance(dist);
        pullVal.current = dist;
        if (delta > 6 && e.cancelable) {
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

      if (val >= 35) {
        busy.current = true;
        setIsRefreshing(true);
        setPullDistance(0);
        pullVal.current = 0;
        setIsDragging(false);

        try {
          if ('vibrate' in navigator) navigator.vibrate(25);
        } catch (_) {}

        try {
          if (cbRef.current) {
            await Promise.resolve(cbRef.current());
            await new Promise((r) => setTimeout(r, 750));
          } else {
            await new Promise((r) => setTimeout(r, 800));
            window.location.reload();
            return;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsRefreshing(false);
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

    // Mouse event handlers for desktop testing
    let mouseDown = false;
    const onMD = (e: MouseEvent) => {
      if (busy.current || getScrollTop() > 8) return;
      if (e.clientY > 130) return;
      startY.current = e.clientY;
      pulling.current = true;
      mouseDown = true;
      setIsDragging(true);
    };

    const onMM = (e: MouseEvent) => {
      if (!mouseDown || !pulling.current || busy.current) return;
      const delta = e.clientY - startY.current;
      if (delta > 0 && getScrollTop() <= 8) {
        const dist = Math.min(delta * 0.55, 75);
        setPullDistance(dist);
        pullVal.current = dist;
      } else if (delta <= 0) {
        setPullDistance(0);
        pullVal.current = 0;
      }
    };

    const onMU = () => {
      if (mouseDown) {
        mouseDown = false;
        onEnd();
      }
    };

    document.addEventListener('mousedown', onMD);
    document.addEventListener('mousemove', onMM);
    document.addEventListener('mouseup', onMU);

    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('mousedown', onMD);
      document.removeEventListener('mousemove', onMM);
      document.removeEventListener('mouseup', onMU);
    };
  }, []);

  const showIndicator = isRefreshing || pullDistance > 3;

  // Calculate vertical translation of the canopy
  // Total canopy height is ~66px
  const canopyTranslateY = isRefreshing
    ? 0
    : pullDistance > 0
    ? -66 + Math.min(pullDistance / 48, 1) * 66 + (pullDistance > 48 ? (pullDistance - 48) * 0.2 : 0)
    : -70;

  const rotationAngle = isRefreshing ? undefined : (pullDistance / 42) * 360;

  const transitionStyle = isDragging
    ? 'none'
    : 'transform 0.38s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.25s ease';

  const indicator = createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `translateY(${canopyTranslateY}px)`,
        opacity: showIndicator ? 1 : 0,
        transition: transitionStyle,
      }}
    >
      {/* Massive pure white ceiling preventing any gap or brown line during iOS overscroll */}
      <div
        style={{
          position: 'absolute',
          top: -800,
          left: 0,
          right: 0,
          height: 800,
          backgroundColor: '#ffffff',
        }}
      />

      {/* Curved Wave Canopy SVG (Matches Reference Design Gambar 2) */}
      <div style={{ width: '100%', position: 'relative', overflow: 'visible' }}>
        <svg
          viewBox="0 0 400 66"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: 66,
            display: 'block',
            fill: '#ffffff',
            filter: 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.48)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
        >
          <path d="M 0 0 L 400 0 L 400 9 C 340 10, 290 12, 260 17 C 242 20, 230 32, 224 44 C 218 56, 210 63, 200 63 C 190 63, 182 56, 176 44 C 170 32, 158 20, 140 17 C 110 12, 60 10, 0 9 Z" />
        </svg>

        {/* White Circular Refresh Badge resting perfectly in the curved cradle */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 9,
            width: 44,
            height: 44,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
            border: '1px solid rgba(241, 245, 249, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}
        >
          <RotateCw
            size={22}
            strokeWidth={2.4}
            style={{
              color: isRefreshing ? '#b08d57' : '#798799',
              transform: !isRefreshing ? `rotate(${rotationAngle}deg)` : undefined,
              animation: isRefreshing ? 'ptr-spin 0.85s linear infinite' : undefined,
              transition: 'color 0.2s ease',
            }}
          />
        </div>
      </div>
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
