import { useEffect, useState, useMemo } from "react";
import { DailyBoxOffice, BoxOfficeResponse } from "./types";
import { Header } from "./components/Header";
import { DashboardStats } from "./components/DashboardStats";
import { BoxOfficeList } from "./components/BoxOfficeList";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { Calendar, AlertCircle, RefreshCw, Star, Compass } from "lucide-react";

export default function App() {
  // 1. Core Date calculations
  const { todayStr, maxDateStr, defaultYesterdayStr } = useMemo(() => {
    const today = new Date();
    
    // Max date for KOBIS daily box office is yesterday since today is not complete
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDateString = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      todayStr: formatDateString(today),
      maxDateStr: formatDateString(yesterday),
      defaultYesterdayStr: formatDateString(yesterday),
    };
  }, []);

  // 2. State Hub
  const [date, setDate] = useState<string>(defaultYesterdayStr);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true; // Default dark
  });

  const [movieList, setMovieList] = useState<DailyBoxOffice[]>([]);
  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Dark / Light mode toggle handler
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 4. Load Box Office Data from Local Proxy API
  useEffect(() => {
    const fetchBoxOffice = async () => {
      setLoading(true);
      setError(null);
      
      // Convert date format from YYYY-MM-DD to YYYYMMDD
      const targetDt = date.replace(/-/g, "");
      
      try {
        const response = await fetch(`/api/boxoffice?targetDt=${targetDt}`);
        if (!response.ok) {
          throw new Error("서버와의 통신에 실패했습니다.");
        }
        
        const data: BoxOfficeResponse = await response.json();
        
        if (data.boxOfficeResult?.dailyBoxOfficeList) {
          setMovieList(data.boxOfficeResult.dailyBoxOfficeList);
        } else {
          setMovieList([]);
          setError("해당 날짜에 대한 순위 조회 결과가 존재하지 않습니다.");
        }
      } catch (err: any) {
        console.error("Failed to load box office list:", err);
        setError("영화인 진흥위원회 박스오피스 데이터를 불러오는데 실패하였습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchBoxOffice();
    }
  }, [date]);

  // 5. Short preset date selection helper
  const handleSelectPreset = (daysAgo: number) => {
    const today = new Date();
    const target = new Date(today);
    target.setDate(today.getDate() - daysAgo);
    
    // Format YYYY-MM-DD
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, "0");
    const day = String(target.getDate()).padStart(2, "0");
    const formatted = `${year}-${month}-${day}`;
    
    // Ensure selected date is before today
    if (formatted < todayStr) {
      setDate(formatted);
    }
  };

  // 6. Local search filtration (highly responsive)
  const filteredMovieList = useMemo(() => {
    if (!searchQuery.trim()) return movieList;
    const query = searchQuery.trim().toLowerCase();
    return movieList.filter((movie) =>
      movie.movieNm.toLowerCase().includes(query)
    );
  }, [movieList, searchQuery]);

  return (
    <div id="app-wrapper" className="min-h-screen bg-[#F9FBFC] dark:bg-cinema-black text-gray-950 dark:text-neutral-50 flex flex-col transition-colors duration-350">
      
      {/* 1. Interactive Navigation & Control Header */}
      <Header
        date={date}
        maxDate={maxDateStr}
        onDateChange={setDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* 2. Main Dashboard Panel */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick Presets Section */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 font-display flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> 빠른 기간 탐색:
          </span>
          <button
            id="preset-1"
            onClick={() => handleSelectPreset(1)}
            className={`px-3 py-1 text-xs font-semibold rounded-full duration-250 transition-all cursor-pointer ${
              date === defaultYesterdayStr
                ? "bg-gold-accent text-black shadow-md shadow-gold-accent/15"
                : "bg-white dark:bg-cinema-gray text-gray-650 dark:text-white/50 border border-gray-200 dark:border-white/5 hover:bg-gray-55 dark:hover:bg-[#1E1E22]"
            }`}
          >
            어제
          </button>
          <button
            id="preset-7"
            onClick={() => handleSelectPreset(7)}
            className={`px-3 py-1 text-xs font-semibold rounded-full duration-250 transition-all cursor-pointer ${
              // we can calculate 7 days ago string to highlight it if selected
              (() => {
                const someDate = new Date();
                someDate.setDate(someDate.getDate() - 7);
                const formatD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return date === formatD(someDate);
              })()
                ? "bg-gold-accent text-black shadow-md shadow-gold-accent/15"
                : "bg-white dark:bg-cinema-gray text-gray-650 dark:text-white/50 border border-gray-200 dark:border-white/5 hover:bg-gray-55 dark:hover:bg-[#1E1E22]"
            }`}
          >
            1주일 전
          </button>
          <button
            id="preset-30"
            onClick={() => handleSelectPreset(30)}
            className={`px-3 py-1 text-xs font-semibold rounded-full duration-250 transition-all cursor-pointer ${
              (() => {
                const someDate = new Date();
                someDate.setDate(someDate.getDate() - 30);
                const formatD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return date === formatD(someDate);
              })()
                ? "bg-gold-accent text-black shadow-md shadow-gold-accent/15"
                : "bg-white dark:bg-cinema-gray text-gray-650 dark:text-white/50 border border-gray-200 dark:border-white/5 hover:bg-gray-55 dark:hover:bg-[#1E1E22]"
            }`}
          >
            1달 전
          </button>
          <button
            id="preset-365"
            onClick={() => handleSelectPreset(365)}
            className={`px-3 py-1 text-xs font-semibold rounded-full duration-250 transition-all cursor-pointer ${
              (() => {
                const someDate = new Date();
                someDate.setDate(someDate.getDate() - 365);
                const formatD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return date === formatD(someDate);
              })()
                ? "bg-gold-accent text-black shadow-md shadow-gold-accent/15"
                : "bg-white dark:bg-cinema-gray text-gray-650 dark:text-white/50 border border-gray-200 dark:border-white/5 hover:bg-gray-55 dark:hover:bg-[#1E1E22]"
            }`}
          >
            1년 전 (역대 박스오피스)
          </button>
        </div>

        {/* 3. Dashboard Sum/Stats Section */}
        <DashboardStats movieList={movieList} selectedDate={date} />

        {/* 4. Main content Area (Loading / Error / List Grid) */}
        <div className="mt-6">
          {loading ? (
            // Animated Elegant Page Spinner Loader
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <RefreshCw className="w-9 h-9 text-gold-accent animate-spin mb-4" />
              <p className="text-sm font-semibold text-gray-500 dark:text-white/40">KOBIS 데이터베이스 실시간 조회 중...</p>
              <p className="text-xs text-gray-400 dark:text-white/25 mt-1">영화진흥위원회 통합전산망 OpenAPI API 원격 통신 중</p>
            </div>
          ) : error ? (
            // Error Indicator
            <div className="p-8 bg-red-50 dark:bg-red-950/20 text-center rounded-2xl border border-red-100 dark:border-red-900/40">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-1">데이터 탐색 장애 발생</h3>
              <p className="text-sm text-red-600 dark:text-red-300 max-w-md mx-auto">{error}</p>
              <button
                id="btn-retry-fetch"
                onClick={() => setDate(date)} // re-triggers effect
                className="mt-4 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm transition-all"
              >
                다시 시도하기
              </button>
            </div>
          ) : (
            // Loaded Box Office List Items
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-semibold text-gray-400 dark:text-white/30 font-mono">
                  조회결과: 일일 상위 {filteredMovieList.length}개 영화 정렬됨
                </span>
                
                {searchQuery && (
                  <button
                    id="btn-clear-search"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-gold-accent hover:text-gold-hover hover:underline font-bold"
                  >
                    필터 초기화
                  </button>
                )}
              </div>
              
              <BoxOfficeList
                movieList={filteredMovieList}
                viewMode={viewMode}
                onMovieClick={(movieCd) => setSelectedMovieCd(movieCd)}
              />
            </div>
          )}
        </div>

      </main>

      {/* 5. Cinematic Footer */}
      <footer className="border-t border-gray-150 dark:border-white/5 bg-white dark:bg-cinema-gray py-6 text-center text-xs text-gray-500 dark:text-white/30 font-sans mt-auto transition-colors duration-350">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 KOBIS Insight. All Rights Reserved.</p>
          <div className="flex gap-4 text-[11px] text-gray-400 dark:text-white/20">
            <span>제공: 영화진흥위원회 (KOBIS) 통합전산망</span>
            <span>•</span>
            <span>보안 포트: 3000 (Proxy Enabled)</span>
          </div>
        </div>
      </footer>

      {/* 6. Dynamic Detail Modal Popup Overlay */}
      <MovieDetailModal
        movieCd={selectedMovieCd}
        onClose={() => setSelectedMovieCd(null)}
      />

    </div>
  );
}
