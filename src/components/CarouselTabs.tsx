import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: number | string | React.ReactNode;
  icon?: React.ReactNode;
}

interface CarouselTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function CarouselTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: CarouselTabsProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, tabs]);

  // Auto-scroll active tab into view
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(160, el.clientWidth * 0.6);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className={`relative w-full max-w-full ${className}`}>
      {/* Mobile Swipe / Carousel Hint Banner */}
      <div className="flex sm:hidden items-center justify-between px-1 mb-1.5 text-[11px] text-zinc-500 font-medium">
        <span>Tabs Carousel ({activeIndex + 1}/{tabs.length})</span>
        <span className="text-[10px] text-zinc-400">Swipe or tap arrows</span>
      </div>

      <div className="relative flex items-center group w-full">
        {/* Left Carousel Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Scroll tabs left"
            className="absolute left-0 z-20 h-full px-1.5 flex items-center justify-center bg-gradient-to-r from-white via-white/95 to-transparent text-zinc-700 hover:text-zinc-950 transition-all rounded-l-xl focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 shadow-xs flex items-center justify-center hover:bg-zinc-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </div>
          </button>
        )}

        {/* Carousel Scrollable Tabs Bar */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 p-1 bg-zinc-100 border border-zinc-200 rounded-xl overflow-x-auto scroll-smooth w-full sm:w-fit no-scrollbar touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                data-active={isActive ? 'true' : 'false'}
                onClick={() => onChange(tab.id)}
                className={`shrink-0 px-3.5 sm:px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-zinc-950 font-semibold shadow-xs ring-1 ring-zinc-200/60'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                }`}
              >
                {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-mono tabular-nums ${
                      isActive
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Carousel Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Scroll tabs right"
            className="absolute right-0 z-20 h-full px-1.5 flex items-center justify-center bg-gradient-to-l from-white via-white/95 to-transparent text-zinc-700 hover:text-zinc-950 transition-all rounded-r-xl focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 shadow-xs flex items-center justify-center hover:bg-zinc-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
