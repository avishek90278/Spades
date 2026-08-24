import React from 'react';
import { motion } from 'motion/react';

interface SpadesBrokenBannerProps {
  show: boolean;
}

export const SpadesBrokenBanner: React.FC<SpadesBrokenBannerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center select-none overflow-hidden">
      {/* Golden radial background flare */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.85, 0.85, 0], scale: [0.5, 1.2, 1.25, 1.4] }}
        transition={{ duration: 1.8, times: [0, 0.2, 0.8, 1] }}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-radial from-[#FACC15]/40 via-[#CA8A04]/15 to-transparent blur-xl"
      />

      {/* Main Callout Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -4, y: 10 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.6, 1.08, 1.02, 1.15],
          rotate: [-4, -2, -2, -1],
          y: [10, -4, -4, -14],
        }}
        transition={{ duration: 1.9, times: [0, 0.18, 0.82, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Glow behind text */}
        <div className="absolute inset-0 filter blur-md opacity-80 select-none">
          <span
            className="text-4xl sm:text-6xl font-black italic tracking-wide text-[#EAB308]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: '0 0 20px #FACC15, 0 0 40px #EAB308',
            }}
          >
            Spades Broken
          </span>
        </div>

        {/* Crisp Foreground Golden Script */}
        <span
          className="relative text-4xl sm:text-6xl font-black italic tracking-wide select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            background: 'linear-gradient(180deg, #FFFBEB 0%, #FEF08A 25%, #FACC15 50%, #CA8A04 85%, #854D0E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))',
          }}
        >
          Spades Broken
        </span>

        {/* Small floating sparkles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-3 -right-4 text-[#FEF08A] text-xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-2 -left-4 text-[#FACC15] text-lg"
        >
          ✨
        </motion.div>
      </motion.div>
    </div>
  );
};
