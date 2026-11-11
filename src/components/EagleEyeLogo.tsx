/**
 * Eagle Eye Security System - Official Brand Logo Component
 * Incorporates the official logo asset uploaded by the user:
 * /assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png
 */

import React from 'react';

export const OFFICIAL_LOGO_URL = '/assets/aistudio/Eagle_Eye_Security_Systems_Logo_cbbbecb6.png';

interface EagleEyeLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  theme?: 'dark' | 'light';
  layout?: 'badge-only' | 'horizontal';
}

export const EagleEyeLogo: React.FC<EagleEyeLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  theme = 'light',
  layout = 'horizontal'
}) => {
  // Height configurations for image
  const sizeMap = {
    xs: { h: 'h-8', w: 'w-8', imgPx: 32, title: 'text-xs', sub: 'text-[8px]', tag: 'text-[6px]' },
    sm: { h: 'h-11', w: 'w-11', imgPx: 44, title: 'text-sm', sub: 'text-[9px]', tag: 'text-[7px]' },
    md: { h: 'h-16', w: 'w-16', imgPx: 64, title: 'text-xl', sub: 'text-[11px]', tag: 'text-[9px]' },
    lg: { h: 'h-24', w: 'w-24', imgPx: 96, title: 'text-2xl', sub: 'text-xs', tag: 'text-[10px]' },
    xl: { h: 'h-32', w: 'w-32', imgPx: 128, title: 'text-3xl', sub: 'text-sm', tag: 'text-xs' },
    '2xl': { h: 'h-44', w: 'w-44', imgPx: 176, title: 'text-4xl', sub: 'text-base', tag: 'text-sm' }
  }[size];

  const isDark = theme === 'dark';

  // If layout is badge-only (the uploaded logo already contains the arched EAGLE EYE, SECURITY SYSTEMS, and SECURE TODAY, SAFE TOMORROW)
  if (layout === 'badge-only' || !showText) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src={OFFICIAL_LOGO_URL}
          alt="Eagle Eye Security Systems"
          className={`${sizeMap.h} ${sizeMap.w} object-contain drop-shadow-md transition-transform duration-200 hover:scale-102`}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  // Horizontal lockup matching the quotation document header layout
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Official Shield Logo Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={OFFICIAL_LOGO_URL}
          alt="Eagle Eye Security Systems"
          className={`${sizeMap.h} ${sizeMap.w} object-contain drop-shadow-sm`}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>

      {/* Typography Lockup beside logo for document header & titles */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div
            className={`font-black tracking-tight leading-none uppercase ${sizeMap.title} ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em' }}
          >
            EAGLE EYE
          </div>
          <div
            className={`font-bold tracking-[0.24em] uppercase leading-tight mt-0.5 ${sizeMap.sub} ${
              isDark ? 'text-amber-400' : 'text-slate-800'
            }`}
          >
            SECURITY SYSTEM
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-transparent my-1" />
          <div
            className={`font-extrabold tracking-wider uppercase ${sizeMap.tag} ${
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
