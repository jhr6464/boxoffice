import React from "react";
import { DailyBoxOffice } from "../types";
import { motion } from "motion/react";
import { Award, TrendingUp, Users, Calendar, ArrowUp, ArrowDown, Minus, Play } from "lucide-react";

interface BoxOfficeListProps {
  movieList: DailyBoxOffice[];
  viewMode: "card" | "list";
  onMovieClick: (movieCd: string) => void;
}

export const BoxOfficeList: React.FC<BoxOfficeListProps> = ({
  movieList,
  viewMode,
  onMovieClick,
}) => {
  // Helper to format large numbers with commas
  const formatNum = (numStr: string) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  // Helper to render Ranking Badges following Yellow/Gold cinema theme colors
  const renderRankBadge = (rank: string) => {
    switch (rank) {
      case "1":
        return (
          <div className="w-8 h-8 rounded-lg bg-gold-accent text-black flex items-center justify-center font-black shadow-lg shadow-gold-accent/20 font-mono text-base">
            1
          </div>
        );
      case "2":
        return (
          <div className="w-8 h-8 rounded-lg bg-gray-400 dark:bg-zinc-400 text-black flex items-center justify-center font-bold shadow-md shadow-gray-400/10 font-mono text-base">
            2
          </div>
        );
      case "3":
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-700/80 text-white flex items-center justify-center font-bold shadow-md shadow-amber-850/10 font-mono text-base">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-cinema-card text-gray-700 dark:text-white/60 flex items-center justify-center font-medium font-mono text-sm border border-gray-200 dark:border-white/5">
            {rank}
          </div>
        );
    }
  };

  // Helper to render Rank intensity change indicator
  const renderRankChange = (movie: DailyBoxOffice) => {
    if (movie.rankOldAndNew === "NEW") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-gold-accent/10 border border-gold-accent/30 text-gold-accent animate-pulse uppercase tracking-wide">
          NEW
        </span>
      );
    }

    const intenNum = parseInt(movie.rankInten, 10);
    if (isNaN(intenNum) || intenNum === 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-white/30 font-mono">
          <Minus className="w-3 h-3" /> 0
        </span>
      );
    } else if (intenNum > 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">
          <ArrowUp className="w-3 h-3" /> {intenNum}
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-0.5 text-xs text-blue-500 dark:text-blue-400 font-bold font-mono">
          <ArrowDown className="w-3 h-3" /> {Math.abs(intenNum)}
        </span>
      );
    }
  };

  if (movieList.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-cinema-gray border border-gray-150 dark:border-white/5 rounded-2xl shadow-sm">
        <FilmIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-white/10 mb-4" />
        <p className="text-gray-500 dark:text-white/40 font-sans text-sm">일치하는 영화 정보가 검색되지 않았습니다.</p>
        <p className="text-xs text-gray-400 dark:text-white/20 mt-1">영화 이름을 확인하시거나 다른 날짜를 지정해 보세요.</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 110 } }
  };

  return (
    <div>
      {viewMode === "card" ? (
        // CARD GRID VIEW
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {movieList.map((movie) => {
            const isFirst = movie.rank === "1";
            return (
              <motion.div
                key={movie.movieCd}
                variants={itemVariants}
                onClick={() => onMovieClick(movie.movieCd)}
                className={`group relative cursor-pointer bg-white dark:bg-cinema-gray rounded-2xl border transition-all duration-350 flex flex-col h-full active:scale-[0.98] overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-black/70 ${
                  isFirst
                    ? "border-gold-accent/20 dark:border-gold-accent/15 dark:bg-[#1E1E22]/50"
                    : "border-gray-150 dark:border-white/5 hover:border-gray-250 dark:hover:border-white/15"
                }`}
              >
                
                {/* Ranking Cover Card Header */}
                <div className="relative h-28 bg-gradient-to-br from-neutral-900 to-neutral-950 dark:from-cinema-card dark:to-neutral-950 p-4 flex flex-col justify-between select-none">
                  {/* Absolute subtle glowing grid backpattern */}
                  <div className="absolute inset-0 bg-grid opacity-5 mix-blend-overlay"></div>
                  
                  {/* Badges row */}
                  <div className="flex justify-between items-start z-10 w-full">
                    {renderRankBadge(movie.rank)}
                    <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                      {renderRankChange(movie)}
                    </div>
                  </div>

                  {/* Sales Share indicators */}
                  <div className="mt-auto z-10">
                    <div className="flex justify-between items-center text-[10px] text-gray-300 dark:text-white/40 font-medium">
                      <span>매출 점유율</span>
                      <span className="font-bold text-gold-accent">{movie.salesShare}%</span>
                    </div>
                    {/* Share Bar */}
                    <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-gold-accent h-full rounded-full group-hover:bg-gold-hover transition-colors"
                        style={{ width: `${movie.salesShare}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-[#131316]">
                  <div>
                    {/* Movie title */}
                    <h3 className="font-bold text-gray-950 dark:text-white/90 text-sm line-clamp-2 leading-snug group-hover:text-gold-accent dark:group-hover:text-gold-accent transition-colors">
                      {movie.movieNm}
                    </h3>
                    
                    {/* Release Date */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 mt-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-white/20" />
                      <span>{movie.openDt ? `${movie.openDt} 개봉` : "개봉 정보 없음"}</span>
                    </div>
                  </div>

                  {/* Summary Audiences */}
                  <div className="border-t border-gray-100 dark:border-white/[0.04] pt-3 mt-4 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-gray-500 dark:text-white/45">
                      <span className="flex items-center gap-1 text-gray-400 dark:text-white/30">
                        <Users className="w-3.5 h-3.5" /> 당일관객
                      </span>
                      <span className="font-bold text-gray-800 dark:text-white/80 font-mono">
                        {formatNum(movie.audiCnt)}명
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-400 dark:text-white/30 text-[11px]">
                      <span>누적 관객수</span>
                      <span className="font-semibold font-mono text-gray-650 dark:text-white/50">
                        {formatNum(movie.audiAcc)}명
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interaction indicator */}
                <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gold-accent hover:bg-gold-hover text-black p-2 rounded-full shadow-lg">
                  <Play className="w-3 h-3 fill-black stroke-black" />
                </span>

              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        // LIST TABLE VIEW
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-cinema-gray rounded-2xl border border-gray-150 dark:border-white/5 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-155 dark:border-white/[0.04] bg-gray-50 dark:bg-cinema-card/50 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/30 font-bold">
                  <th className="py-3.5 px-4 text-center w-16">순위</th>
                  <th className="py-3.5 px-4">영화제목</th>
                  <th className="py-3.5 px-4 text-center w-36">매출 점유율</th>
                  <th className="py-3.5 px-4 text-right">당일 관객수</th>
                  <th className="py-3.5 px-4 text-right">누적 관객수</th>
                  <th className="py-3.5 px-4 text-center w-32">개봉일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {movieList.map((movie) => {
                  const isFirst = movie.rank === "1";
                  return (
                    <motion.tr
                      key={movie.movieCd}
                      variants={itemVariants}
                      onClick={() => onMovieClick(movie.movieCd)}
                      className={`cursor-pointer transition-colors group ${
                        isFirst
                          ? "bg-gold-accent/[0.02] dark:bg-gold-accent/[0.01] hover:bg-gold-accent/[0.05] dark:hover:bg-gold-accent/[0.03]"
                          : "hover:bg-gold-accent/[0.03] dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {renderRankBadge(movie.rank)}
                          {renderRankChange(movie)}
                        </div>
                      </td>

                      {/* Movie Title */}
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white/90 text-sm sm:text-base group-hover:text-gold-accent dark:group-hover:text-gold-accent transition-colors">
                            {movie.movieNm}
                          </div>
                          <span className="inline-flex sm:hidden mt-1 text-[11px] text-gray-400 dark:text-white/30">
                            {movie.openDt ? `${movie.openDt} 개봉` : ""}
                          </span>
                        </div>
                      </td>

                      {/* Sales Share Bar & Percentage */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5 justify-center max-w-[130px] mx-auto sm:mx-0">
                          <div className="flex justify-between text-xs text-gray-450 dark:text-white/40 font-mono">
                            <span>{movie.salesShare}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-cinema-card h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gold-accent h-full rounded-full"
                              style={{ width: `${movie.salesShare}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Direct Ticket Audience Daily */}
                      <td className="py-4 px-4 text-right font-semibold text-gray-800 dark:text-white/80 font-mono text-sm sm:text-base">
                        {formatNum(movie.audiCnt)}명
                      </td>

                      {/* Accumulated Tickets */}
                      <td className="py-4 px-4 text-right text-gray-500 dark:text-white/40 font-mono text-xs sm:text-sm">
                        {formatNum(movie.audiAcc)}명
                      </td>

                      {/* Open Date */}
                      <td className="py-4 px-4 text-center text-xs sm:text-sm text-gray-400 dark:text-white/30 font-mono">
                        {movie.openDt || "연도 미표기"}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Subtle icon SVG component to stay self-contained
const FilmIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M17 3v18" />
    <path d="M3 7.5h4" />
    <path d="M3 12h18" />
    <path d="M3 16.5h4" />
    <path d="M17 7.5h4" />
    <path d="M17 16.5h4" />
  </svg>
);

