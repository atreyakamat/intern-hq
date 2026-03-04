import React from 'react';

/**
 * Score badge component — color-coded circle or pill.
 */
export default function ScoreBadge({ score, size = 'md' }) {
  const s = Number(score) || 0;

  let bg, text, ring;
  if (s >= 80) {
    bg = 'bg-emerald-50'; text = 'text-emerald-700'; ring = 'ring-emerald-200';
  } else if (s >= 60) {
    bg = 'bg-amber-50'; text = 'text-amber-700'; ring = 'ring-amber-200';
  } else if (s >= 40) {
    bg = 'bg-orange-50'; text = 'text-orange-700'; ring = 'ring-orange-200';
  } else {
    bg = 'bg-red-50'; text = 'text-red-700'; ring = 'ring-red-200';
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold ring-2 ${bg} ${text} ${ring} ${sizeClasses[size] || sizeClasses.md}`}
      title={`Score: ${s}`}
    >
      {s}
    </div>
  );
}
