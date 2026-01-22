'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  '#0066FF', // Primary blue
  '#00D4FF', // Cyan accent
  '#00C853', // Success green
  '#FFB300', // Amber
  '#FF6B6B', // Coral
  '#A855F7', // Purple
];

export default function Confetti({
  isActive,
  duration = 5000,
  particleCount = 100,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, duration]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: -20,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
              initial={{
                y: -20,
                x: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 100,
                x: (Math.random() - 0.5) * 200,
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Burst effect for micro-celebrations
export function ConfettiBurst({
  isActive,
  x = 50,
  y = 50,
}: {
  isActive: boolean;
  x?: number;
  y?: number;
}) {
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: ConfettiPiece[] = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: 0,
        rotation: (i / 20) * 360,
        size: 6 + Math.random() * 4,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div
          className="fixed pointer-events-none z-50"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {particles.map((particle) => {
            const angle = (particle.rotation * Math.PI) / 180;
            const distance = 50 + Math.random() * 100;

            return (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: '50%',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
