import React, { useEffect, useRef, useState } from "react";

interface TypingTextProps {
  text?: string;
  speed?: number;
  delay?: number;
  className?: string;
  startOnVisible?: boolean;
}

export default function TypingText({
  text = "",
  speed = 40,
  delay = 300,
  className = "",
  startOnVisible = false,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(!startOnVisible);
  const [isCompleted, setIsCompleted] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!startOnVisible) return;
    if (started) return;

    const element = spanRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [startOnVisible, started]);

  useEffect(() => {
    setDisplayedText("");
    setIsCompleted(false);
    if (!text || (startOnVisible && !started)) return;

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      let index = 0;
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length && intervalId) {
          window.clearInterval(intervalId);
          setIsCompleted(true);
        }
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speed, delay, startOnVisible, started]);

  return (
    <span
      ref={spanRef}
      className={`inline-block whitespace-pre-wrap overflow-hidden ${className}`}
    >
      <span>{displayedText}</span>
      {!isCompleted && (
        <span className="inline-block w-0.5 h-5 align-middle bg-slate-400 animate-[blink_1s_steps(2)_infinite] ml-1" />
      )}
    </span>
  );
}
