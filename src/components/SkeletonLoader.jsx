import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonLoader({ className = '', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`bg-[var(--border)] rounded-md ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader 
          key={i} 
          className="h-4 w-full" 
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonBubble({ isUser = false }) {
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-4 rounded-2xl max-w-[80%] flex flex-col gap-2 ${isUser ? 'bg-[var(--primary)] text-white rounded-tr-sm' : 'bg-[var(--surface)] border border-[var(--border)] rounded-tl-sm'}`}>
        <SkeletonLoader className={`h-4 w-32 ${isUser ? 'bg-white/20' : 'bg-[var(--border)]'}`} />
        <SkeletonLoader className={`h-4 w-24 ${isUser ? 'bg-white/20' : 'bg-[var(--border)]'}`} />
      </div>
    </div>
  );
}
