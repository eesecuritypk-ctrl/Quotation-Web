/**
 * Eagle Eye Security System - Official Brand Logo
 * Vector-sharp SVG emblem replicating the shield, golden eagle, and typography
 * from the uploaded PDF document, with option to use asset crop.
 */

import React from 'react';

interface EagleEyeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'dark' | 'light';
}

export const EagleEyeLogo: React.FC<EagleEyeLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'light'
}) => {
  const dimensions = {
    sm: { shield: 44, title: 'text-base', sub: 'text-[9px]', tag: 'text-[7px]' },
    md: { shield: 64, title: 'text-2xl', sub: 'text-xs', tag: 'text-[10px]' },
    lg: { shield: 84, title: 'text-3xl', sub: 'text-sm', tag: 'text-xs' },
    xl: { shield: 104, title: 'text-4xl', sub: 'text-base', tag: 'text-sm' }
  }[size];

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Golden Shield Emblem */}
      <div className="relative shrink-0 flex items-center justify-center drop-shadow-sm">
        <svg
          width={dimensions.shield}
          height={dimensions.shield * 1.25}
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200"
        >
          <defs>
            {/* Gold Gradients */}
            <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="25%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="75%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="innerShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E1E1E" />
              <stop offset="100%" stopColor="#0B0B0B" />
            </linearGradient>

            <linearGradient id="eagleGold" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer Shield Frame with Gold Stroke */}
          <path
            d="M80 6 C115 6, 148 16, 154 26 C154 85, 146 142, 80 194 C14 142, 6 85, 6 26 C12 16, 45 6, 80 6 Z"
            fill="url(#innerShieldBg)"
            stroke="url(#shieldGold)"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Inner Golden Border */}
          <path
            d="M80 14 C110 14, 138 22, 144 32 C144 82, 137 132, 80 180 C23 132, 16 82, 16 32 C22 22, 50 14, 80 14 Z"
            fill="none"
            stroke="url(#shieldGold)"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Eagle Graphics: Wings & Head */}
          {/* Left Wing Feathers */}
          <path
            d="M80 75 Q45 50 24 64 Q38 78 52 82 Q28 82 22 94 Q40 102 56 102 Q28 106 24 120 Q44 126 62 122 Q38 130 36 144 Q56 142 76 132 Z"
            fill="url(#eagleGold)"
          />

          {/* Right Wing Feathers */}
          <path
            d="M80 75 Q115 50 136 64 Q122 78 108 82 Q132 82 138 94 Q120 102 104 102 Q132 106 136 120 Q116 126 98 122 Q122 130 124 144 Q104 142 84 132 Z"
            fill="url(#eagleGold)"
          />

          {/* Eagle Body & Breast Shield */}
          <path
            d="M72 88 L88 88 L84 140 L80 146 L76 140 Z"
            fill="url(#eagleGold)"
          />

          {/* Eagle Head & Beak */}
          <path
            d="M80 44 C86 44 92 48 94 56 C96 64 88 72 80 76 C72 72 64 64 66 56 C68 48 74 44 80 44 Z"
            fill="#FBBF24"
          />
          <path
            d="M80 50 L96 60 L80 65 L76 56 Z"
            fill="#FEF08A"
          />
          {/* Eye */}
          <circle cx="84" cy="55" r="2.5" fill="#0F172A" />
          <circle cx="85" cy="54" r="0.8" fill="#FFFFFF" />

          {/* Security Crest Lines / Star Accent */}
          <polygon
            points="80,152 83,160 91,160 85,165 87,173 80,168 73,173 75,165 69,160 77,160"
            fill="url(#shieldGold)"
          />
        </svg>
      </div>

      {/* Typography Lockup */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div
            className={`font-black tracking-tight leading-none uppercase ${dimensions.title} ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em' }}
          >
            EAGLE EYE
          </div>
          <div
            className={`font-bold tracking-[0.22em] uppercase leading-tight mt-0.5 ${dimensions.sub} ${
              isDark ? 'text-amber-400' : 'text-slate-800'
            }`}
          >
            SECURITY SYSTEM
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-transparent my-1" />
          <div
            className={`font-extrabold tracking-wider uppercase ${dimensions.tag} ${
              isDark ? 'text-amber-300' : 'text-slate-900'
            }`}
          >
            SECURE TODAY, SAFE TOMMOROW
          </div>
        </div>
      )}
    </div>
  );
};
