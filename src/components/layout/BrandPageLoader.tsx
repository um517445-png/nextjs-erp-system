"use client";

import React from 'react';

export function BrandPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090D16]/95 dark:bg-[#090D16]/95 backdrop-blur-md transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-24 h-24 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin transition-all" />
        
        {/* Inner brand emblem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold text-xl tracking-wider">
            V
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2">
        <span className="text-lg font-bold tracking-wide text-slate-100 dark:text-slate-100">
          Vorder <span className="text-amber-400">ERP</span>
        </span>
        <span className="text-xs text-slate-400 font-medium tracking-widest animate-pulse">
          جاري تحميل المنصة الذكية...
        </span>
      </div>
    </div>
  );
}
