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
    <header className="sticky top-0 z-40 w-full border-b border-gray-150 dark:border-white/5 bg-white/95 dark:bg-suit-plum/95 backdrop-blur-md transition-colors duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-suit-rose-medium dark:bg-suit-cyan text-suit-plum rounded-xl shadow-lg shadow-suit-rose-medium/10 dark:shadow-suit-cyan/5 active:scale-95 transition-transform flex items-center justify-center font-black">
              <Film className="w-5.5 h-5.5 text-suit-plum stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 dark:text-suit-pink-white font-display">
                일일 박스오피스 <span className="text-suit-rose-medium dark:text-suit-cyan text-sm font-semibold align-super ml-1">KOBIS Insight</span>
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-suit-lavender/60 tracking-wider font-sans mt-0.5">
                KOBIS OpenAPI를 활용한 국내 박스오피스 실시간 데이터 분석
              </p>
            </div>
          </div>

          {/* Controls Container */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-suit-lavender/40">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search-input"
                type="text"
                placeholder="영화 제목 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-suit-plum/40 text-gray-950 dark:text-suit-pink-white placeholder-gray-400 dark:placeholder-suit-lavender/30 focus:outline-none focus:ring-2 focus:ring-suit-rose-medium dark:focus:ring-suit-cyan focus:border-suit-rose-medium dark:focus:border-suit-cyan transition-all font-sans"
              />
            </div>

            {/* Date Picker */}
            <div className="relative flex items-center bg-gray-50 dark:bg-suit-plum/40 border border-gray-200 dark:border-white/5 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-suit-rose-medium dark:focus-within:ring-suit-cyan transition-all">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-suit-lavender/40 mr-2" />
              <input
                id="date-picker-input"
                type="date"
                value={date}
                max={maxDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-gray-700 dark:text-suit-pink-white/80 focus:outline-none focus:ring-0 p-0 text-center w-32 cursor-pointer dark:[color-scheme:dark]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-suit-plum/60 p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
              <button
                id="btn-view-card"
                onClick={() => onViewModeChange("card")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "card"
                    ? "bg-white dark:bg-suit-plum text-suit-rose-medium dark:text-suit-cyan shadow-sm font-bold"
                    : "text-gray-500 dark:text-suit-lavender/40 hover:text-gray-700 dark:hover:text-suit-lavender/80"
                }`}
                title="카드 그리드 뷰"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-list"
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-suit-plum text-suit-rose-medium dark:text-suit-cyan shadow-sm font-bold"
                    : "text-gray-500 dark:text-suit-lavender/40 hover:text-gray-700 dark:hover:text-suit-lavender/80"
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
              className="p-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-suit-plum/40 text-gray-500 dark:text-suit-lavender/40 hover:bg-gray-50 dark:hover:bg-suit-plum/70 hover:text-gray-700 dark:hover:text-suit-pink-white transition-all shadow-sm cursor-pointer"
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
