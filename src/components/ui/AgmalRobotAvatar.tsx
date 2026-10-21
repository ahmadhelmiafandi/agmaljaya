import React from 'react';

interface AgmalRobotAvatarProps {
  className?: string;
  size?: number | string;
  primaryColor?: string; // Warna badan robot (Default Agmal Gold #b08d57)
  faceColor?: string;    // Warna layar muka (Default #ffffff)
  featureColor?: string; // Warna mata dan senyum
}

export default function AgmalRobotAvatar({
  className = '',
  size = 40,
  primaryColor = '#b08d57',
  faceColor = '#ffffff',
  featureColor = '#b08d57',
}: AgmalRobotAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antena Kiri & Kanan */}
      <rect x="11" y="24" width="3.2" height="14" rx="1.6" fill={primaryColor} />
      <rect x="85.8" y="24" width="3.2" height="14" rx="1.6" fill={primaryColor} />

      {/* Headphone / Bantalan Telinga Kiri */}
      <path
        d="M17 37C11.5 41.5 8 48 8 55C8 62 11.5 68.5 17 73C18 70 18.5 66 18.5 62C15.5 60 13.5 57.5 13.5 55C13.5 52.5 15.5 50 18.5 48C18.5 44 18 40 17 37Z"
        fill={primaryColor}
      />

      {/* Headphone / Bantalan Telinga Kanan */}
      <path
        d="M83 37C88.5 41.5 92 48 92 55C92 62 88.5 68.5 83 73C82 70 81.5 66 81.5 62C84.5 60 86.5 57.5 86.5 55C86.5 52.5 84.5 50 81.5 48C81.5 44 82 40 83 37Z"
        fill={primaryColor}
      />

      {/* Kepala Berbentuk Speech Bubble dengan Ekor Chat di Kiri Bawah */}
      <path
        d="M50 20C28 20 13 34 13 53.5C13 65 19.5 75 31 81L23.5 91.5C22.2 93 23.5 95 25.2 94.2L42.5 85.5C45 86.5 47.5 87 50 87C72 87 87 73 87 53.5C87 34 72 20 50 20Z"
        fill={primaryColor}
      />

      {/* Layar Muka Stadium / Rounded Screen */}
      <rect x="25" y="34" width="50" height="37" rx="18.5" fill={faceColor} />

      {/* Mata Senyum Melengkung Bahagia (Kiri) */}
      <path
        d="M33 53C34 48 38.5 45.5 43 48"
        stroke={featureColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Mata Senyum Melengkung Bahagia (Kanan) */}
      <path
        d="M57 48C61.5 45.5 66 48 67 53"
        stroke={featureColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Mulut Tersenyum Ramah */}
      <path
        d="M47 57.5C48 60 52 60 53 57.5"
        stroke={featureColor}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
