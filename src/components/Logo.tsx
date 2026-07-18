import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-16 h-16', showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 200 200"
        className={`${className} text-brand-rose-deep fill-none`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular Outer Flourished Border */}
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="0.5" />
        
        {/* Subtle inner decorative dashes */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <line
              key={i}
              x1="100"
              y1="13"
              x2="100"
              y2="17"
              stroke="currentColor"
              strokeWidth="1"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

        {/* Vintage Rose Illustration (Line Art SVG) */}
        <g transform="translate(75, 40) scale(0.65)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Rose Bud Petals */}
          <path d="M 38 25 C 38 18, 48 10, 55 18 C 60 10, 70 18, 70 25 C 70 35, 54 48, 54 48 C 54 48, 38 35, 38 25 Z" />
          <path d="M 45 23 C 48 18, 52 18, 55 23" />
          <path d="M 52 23 C 54 15, 60 18, 62 23" />
          <path d="M 48 27 C 50 35, 58 35, 60 27" />
          <path d="M 39 27 C 35 32, 42 42, 48 42" />
          <path d="M 69 27 C 73 32, 66 42, 60 42" />
          
          {/* Stem & Leaves */}
          <path d="M 54 48 C 54 60, 48 75, 45 85" strokeWidth="2" />
          
          {/* Left Leaf */}
          <path d="M 51 58 C 40 58, 30 52, 28 62 C 32 68, 45 66, 49 61 Z" />
          <path d="M 50 60 L 35 59" strokeWidth="1" />
          
          {/* Right Leaf */}
          <path d="M 52 64 C 62 66, 72 62, 74 72 C 70 76, 58 72, 51 67 Z" />
          <path d="M 52 66 L 66 69" strokeWidth="1" />

          {/* Additional Leaf stems */}
          <path d="M 47 70 C 40 76, 32 78, 35 84 C 40 85, 45 80, 47 75" />
          <path d="M 47 73 L 38 78" strokeWidth="1" />
        </g>

        {/* Vintage Text Elements inside Logo */}
        <g fill="currentColor" stroke="none" className="font-serif">
          {/* Amra's */}
          <text
            x="100"
            y="125"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="0.5"
            className="font-serif"
          >
            Amra's
          </text>
          
          {/* STUDIO */}
          <text
            x="100"
            y="142"
            textAnchor="middle"
            fontSize="8"
            fontFamily="sans-serif"
            fontWeight="600"
            letterSpacing="5"
          >
            STUDIO
          </text>

          {/* SINCE 2025 */}
          <text
            x="100"
            y="160"
            textAnchor="middle"
            fontSize="6.5"
            fontFamily="sans-serif"
            fontWeight="500"
            letterSpacing="2.5"
          >
            SINCE 2025
          </text>
        </g>
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif text-xl font-bold tracking-wide text-brand-rose-deep leading-tight">
            Amra's Studio
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-brand-green-olive font-semibold leading-none">
            Everlasting Blooms
          </span>
        </div>
      )}
    </div>
  );
};
