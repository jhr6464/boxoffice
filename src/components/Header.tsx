import React from "react";
import { Sun, Moon, Calendar, Search, Film, Grid, List } from "lucide-react";

interface HeaderProps {
  date: string; // YYYY-MM-DD
  maxDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "card" | "list";
  onViewModeChange: (mode: "card" | "list") => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  date,
  maxDate,
  onDateChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-150 dark:border-white/5 bg-white/95 dark:bg-cinema-gray/95 backdrop-blur-md transition-colors duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gold-accent rounded-xl text-black shadow-lg shadow-gold-accent/10 active:scale-95 transition-transform flex items-center justify-center font-black">
              <Film className="w-5.5 h-5.5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 dark:text-neutral-50 font-display">
                일일 박스오피스 <span className="text-gold-accent text-sm font-semibold align-super ml-1">KOBIS Insight</span>
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-white/40 tracking-wider font-sans mt-0.5">
                KOBIS OpenAPI를 활용한 국내 박스오피스 실시간 데이터 분석
              </p>
            </div>
          </div>

          {/* Controls Container */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-white/30">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search-input"
                type="text"
                placeholder="영화 제목 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-cinema-card text-gray-950 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-accent dark:focus:ring-gold-accent focus:border-gold-accent dark:focus:border-gold-accent transition-all font-sans"
              />
            </div>

            {/* Date Picker */}
            <div className="relative flex items-center bg-gray-50 dark:bg-[#1E1E22] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-gold-accent dark:focus-within:ring-gold-accent transition-all">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-white/30 mr-2" />
              <input
                id="date-picker-input"
                type="date"
                value={date}
                max={maxDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-700 dark:text-white/80 focus:outline-none focus:ring-0 p-0 text-center w-32 cursor-pointer dark:[color-scheme:dark]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-cinema-card p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
              <button
                id="btn-view-card"
                onClick={() => onViewModeChange("card")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "card"
                    ? "bg-white dark:bg-[#2A2A30] text-gold-accent dark:text-white shadow-sm font-bold"
                    : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                }`}
                title="카드 그리드 뷰"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-list"
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-[#2A2A30] text-gold-accent dark:text-white shadow-sm font-bold"
                    : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                }`}
                title="리스트 뷰"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              id="btn-toggle-theme"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-cinema-card text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-[#2A2A30] hover:text-gray-700 dark:hover:text-white/80 transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
