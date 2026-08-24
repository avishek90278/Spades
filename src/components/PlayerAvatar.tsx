import React from 'react';
import { Position } from '../types/spades';

interface PlayerAvatarProps {
  position: Position;
  name: string;
  isSelf?: boolean;
  isBot?: boolean;
  botDifficulty?: string;
  avatarEmoji?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isTurn?: boolean;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  position,
  name,
  isSelf = false,
  size = 'md',
  className = '',
  isTurn = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13 sm:w-15 sm:h-15',
    lg: 'w-16 h-16 sm:w-18 sm:h-18',
    xl: 'w-20 h-20 sm:w-22 sm:h-22',
  }[size];

  // Custom vector avatar portraits matching the reference app screenshot
  const renderAvatarGraphic = () => {
    if (name === 'Ashley' || position === 'north') {
      // Ashley: Wavy blonde/light-brown hair, warm expression, hoop earrings
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
          <circle cx="50" cy="50" r="48" fill="#F4D8CD" />
          {/* Hair background */}
          <path d="M22 45 C15 65 20 85 30 92 C30 92 20 55 35 40 Z" fill="#9C7A5B" />
          <path d="M78 45 C85 65 80 85 70 92 C70 92 80 55 65 40 Z" fill="#9C7A5B" />
          {/* Neck & Shoulders */}
          <path d="M38 75 L38 95 L62 95 L62 75 Z" fill="#E8B59E" />
          <path d="M25 95 C30 85 70 85 75 95 Z" fill="#4B6B94" />
          {/* Face */}
          <ellipse cx="50" cy="52" rx="24" ry="26" fill="#FADBC8" />
          {/* Hair top & bangs */}
          <path
            d="M26 44 C26 22 74 22 74 44 C74 30 65 24 50 24 C35 24 26 30 26 44 Z"
            fill="#B89370"
          />
          <path
            d="M26 40 C34 32 46 36 50 44 C54 36 66 32 74 40 C70 30 58 26 50 26 C42 26 30 30 26 40 Z"
            fill="#C9A37E"
          />
          {/* Eyes */}
          <ellipse cx="41" cy="50" rx="4" ry="4.5" fill="#4A6572" />
          <ellipse cx="59" cy="50" rx="4" ry="4.5" fill="#4A6572" />
          <circle cx="42.5" cy="48.5" r="1.5" fill="#FFFFFF" />
          <circle cx="60.5" cy="48.5" r="1.5" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M36 43 Q41 40 46 43" stroke="#7A5638" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M54 43 Q59 40 64 43" stroke="#7A5638" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Nose */}
          <path d="M50 50 Q52 56 48 57" stroke="#D3957D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Lips / Smile */}
          <path d="M43 65 Q50 71 57 65" stroke="#D9534F" strokeWidth="2.2" fill="#E87A77" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="36" cy="58" rx="4" ry="2.5" fill="#F28D85" opacity="0.4" />
          <ellipse cx="64" cy="58" rx="4" ry="2.5" fill="#F28D85" opacity="0.4" />
        </svg>
      );
    }

    if (name === 'Isabella' || position === 'west') {
      // Isabella: Dark hair, warm tanned skin, cheerful red accent
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
          <circle cx="50" cy="50" r="48" fill="#FDE2D6" />
          {/* Hair back */}
          <circle cx="50" cy="50" r="38" fill="#3D2314" />
          {/* Neck & Shoulders */}
          <path d="M38 75 L38 95 L62 95 L62 75 Z" fill="#E0A480" />
          <path d="M25 95 C30 84 70 84 75 95 Z" fill="#E14B5A" />
          {/* Face */}
          <ellipse cx="50" cy="53" rx="23" ry="25" fill="#F5BA96" />
          {/* Hair style front */}
          <path
            d="M27 48 C27 24 73 24 73 48 C68 34 58 30 50 32 C42 30 32 34 27 48 Z"
            fill="#2C180B"
          />
          <path d="M27 44 Q35 55 33 68 Q26 60 27 44 Z" fill="#2C180B" />
          <path d="M73 44 Q65 55 67 68 Q74 60 73 44 Z" fill="#2C180B" />
          {/* Eyes */}
          <ellipse cx="42" cy="51" rx="4.2" ry="4.5" fill="#2A1A10" />
          <ellipse cx="58" cy="51" rx="4.2" ry="4.5" fill="#2A1A10" />
          <circle cx="43.5" cy="49.5" r="1.5" fill="#FFFFFF" />
          <circle cx="59.5" cy="49.5" r="1.5" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M37 44 Q42 41 47 43" stroke="#2C180B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M53 43 Q58 41 63 44" stroke="#2C180B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Nose */}
          <path d="M50 51 Q52 57 48 58" stroke="#C4805A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Smile */}
          <path d="M43 66 Q50 73 57 66" stroke="#C93B47" strokeWidth="2.4" fill="#E85D6A" strokeLinecap="round" />
          {/* Cheeks */}
          <ellipse cx="37" cy="59" rx="3.5" ry="2" fill="#E8655E" opacity="0.45" />
          <ellipse cx="63" cy="59" rx="3.5" ry="2" fill="#E8655E" opacity="0.45" />
        </svg>
      );
    }

    if (name === 'Tyler' || position === 'east') {
      // Tyler: Grey hair, bun, warm gentle elder look
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
          <circle cx="50" cy="50" r="48" fill="#FCECE6" />
          {/* Hair Bun */}
          <circle cx="50" cy="22" r="14" fill="#C5C8CC" />
          {/* Neck & Shoulders */}
          <path d="M38 75 L38 95 L62 95 L62 75 Z" fill="#E8B8A2" />
          <path d="M25 95 C30 84 70 84 75 95 Z" fill="#A85B7A" />
          {/* Face */}
          <ellipse cx="50" cy="54" rx="23" ry="25" fill="#F7CCB8" />
          {/* Hair */}
          <path
            d="M27 46 C27 24 73 24 73 46 C70 34 60 28 50 28 C40 28 30 34 27 46 Z"
            fill="#D2D6DC"
          />
          <path d="M27 44 Q28 65 33 72 Q25 60 27 44 Z" fill="#BCC0C6" />
          <path d="M73 44 Q72 65 67 72 Q75 60 73 44 Z" fill="#BCC0C6" />
          {/* Eyes */}
          <ellipse cx="42" cy="52" rx="3.8" ry="4" fill="#3D4852" />
          <ellipse cx="58" cy="52" rx="3.8" ry="4" fill="#3D4852" />
          <circle cx="43.5" cy="50.5" r="1.3" fill="#FFFFFF" />
          <circle cx="59.5" cy="50.5" r="1.3" fill="#FFFFFF" />
          {/* Eyebrows */}
          <path d="M37 45 Q42 42 47 45" stroke="#8D95A0" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M53 45 Q58 42 63 45" stroke="#8D95A0" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Nose */}
          <path d="M50 51 Q52 58 48 59" stroke="#C98B70" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Smile */}
          <path d="M44 67 Q50 72 56 67" stroke="#BA4358" strokeWidth="2" fill="#DB687D" strokeLinecap="round" />
          {/* Cheeks */}
          <ellipse cx="37" cy="60" rx="3.5" ry="2" fill="#E8828E" opacity="0.35" />
          <ellipse cx="63" cy="60" rx="3.5" ry="2" fill="#E8828E" opacity="0.35" />
        </svg>
      );
    }

    // Default Avatar (South/User or fallback)
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
        <circle cx="50" cy="50" r="48" fill="#F4D8CD" />
        <ellipse cx="50" cy="52" rx="24" ry="26" fill="#FADBC8" />
        <path d="M26 44 C26 22 74 22 74 44 C74 30 65 24 50 24 C35 24 26 30 26 44 Z" fill="#4A3728" />
        <circle cx="42" cy="50" r="4" fill="#222222" />
        <circle cx="58" cy="50" r="4" fill="#222222" />
        <path d="M44 65 Q50 71 56 65" stroke="#D9534F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div
      className={`relative rounded-full p-1 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
        isTurn ? 'scale-105 ring-4 ring-[#4ade80] shadow-[0_0_16px_rgba(74,222,128,0.6)] animate-pulse' : ''
      } ${sizeClasses} ${className}`}
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#E5E7EB]">
        {renderAvatarGraphic()}
      </div>
    </div>
  );
};
