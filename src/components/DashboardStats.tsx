import React from "react";
import { DailyBoxOffice } from "../types";
import { TrendingUp, Users, Presentation, CalendarDays, Award } from "lucide-react";

interface DashboardStatsProps {
  movieList: DailyBoxOffice[];
  selectedDate: string; // YYYY-MM-DD
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ movieList, selectedDate }) => {
  // Helper to format number
  const formatNum = (numStr: string) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  // Safe arithmetic helpers
  const totalAudi = movieList.reduce((acc, cur) => acc + (parseInt(cur.audiCnt, 10) || 0), 0);
  const totalSales = movieList.reduce((acc, cur) => acc + (parseInt(cur.salesAmt, 10) || 0), 0);
  const topMovie = movieList.length > 0 ? movieList[0] : null;

  // Render Korean date with Day of the Week
  const formatKoreanDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일 (${dayNames[d.getDay()]}요일)`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      {/* Selected Date Card */}
      <div className="bg-white dark:bg-suit-plum/50 p-5 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <div className="p-3 bg-suit-lavender dark:bg-suit-plum text-suit-rose-medium dark:text-suit-cyan rounded-xl">
          <CalendarDays className="w-5.5 h-5.5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-widest font-display">박스오피스 일자</p>
          <p className="text-sm font-bold text-gray-800 dark:text-neutral-100 mt-1">{formatKoreanDate(selectedDate)}</p>
          <p className="text-[10px] text-gray-400 dark:text-suit-rose-light/40 mt-0.5">실시간 DB 동기화</p>
        </div>
      </div>

      {/* Top Ranked Movie */}
      <div className="bg-white dark:bg-suit-plum/50 p-5 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ring-1 ring-transparent dark:hover:ring-suit-cyan/20">
        <div className="p-3 bg-suit-rose-light/20 text-suit-rose-medium dark:text-suit-cyan rounded-xl">
          <Award className="w-5.5 h-5.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-widest font-display">오늘의 1위 영화</p>
          <p className="text-sm font-bold text-gray-900 dark:text-neutral-100 mt-1 truncate" title={topMovie?.movieNm || "정보 없음"}>
            {topMovie ? topMovie.movieNm : "데이터 없음"}
          </p>
          {topMovie && (
            <p className="text-[10px] text-suit-rose-medium dark:text-suit-cyan mt-0.5 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 animate-pulse" />
              매출 점유율 {topMovie.salesShare}% 
            </p>
          )}
        </div>
      </div>

      {/* Total Audience Count */}
      <div className="bg-white dark:bg-suit-plum/50 p-5 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <div className="p-3 bg-suit-cyan/20 dark:bg-suit-cyan/10 text-suit-rose-medium dark:text-suit-cyan rounded-xl">
          <Users className="w-5.5 h-5.5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-widest font-display">관객 수 (Top10)</p>
          <p className="text-lg font-bold text-gray-800 dark:text-neutral-100 mt-0.5">{totalAudi > 0 ? `${formatNum(totalAudi.toString())} 명` : "집계 중"}</p>
          <p className="text-[10px] text-gray-400 dark:text-suit-rose-light/40 mt-0.5">상위 10개 실시간 합산</p>
        </div>
      </div>

      {/* Total Sales Revenue */}
      <div className="bg-white dark:bg-suit-plum/50 p-5 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <div className="p-3 bg-suit-lavender/50 dark:bg-suit-lavender/10 text-suit-rose-medium dark:text-suit-lavender rounded-xl">
          <Presentation className="w-5.5 h-5.5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-widest font-display">누적 매출 (Top10)</p>
          <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-neutral-100 mt-0.5">
            {totalSales > 0 ? `₩${formatNum(totalSales.toString())}` : "집계 중"}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-suit-rose-light/40 mt-0.5">상위 10개 통합 매출액</p>
        </div>
      </div>

    </div>
  );
};
