import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function SlaBadge({ type = 'Sociopragmatics', explanation = 'This identifies how social context influences meaning.' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTheme = (type) => {
    switch (type) {
      case 'Sociopragmatics':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-600';
      case 'excellent':
        return 'bg-[var(--primary-light)] border-[var(--primary-dim)] text-[var(--primary)]';
      case 'good':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
    }
  };

  const themeClass = getTheme(type);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`inline-flex flex-col items-start bg-[var(--surface-2)] ${themeClass} border rounded-2xl px-3 py-1.5 cursor-pointer transition-all duration-300 max-w-sm mt-2 shadow-sm hover:scale-[1.02]`}
    >
      <div className="flex items-center gap-1.5 drop-shadow-sm">
        <Sparkles className="w-3.5 h-3.5 opacity-90" />
        <span className="text-[11px] font-bold tracking-widest uppercase">{type}</span>
      </div>
      
      {isExpanded && (
        <div className="text-[11px] opacity-90 mt-1.5 pb-0.5 leading-relaxed animate-fadeIn font-medium">
          {explanation}
        </div>
      )}
    </div>
  );
}
