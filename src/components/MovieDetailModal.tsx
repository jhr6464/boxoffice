import React, { useEffect, useState } from "react";
import { MovieInfo, MovieInfoResponse } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Globe, Calendar, Award, Palette, User, Building, Users, Sparkles, Copy, Check, MessageSquare, RefreshCw } from "lucide-react";

interface MovieDetailModalProps {
  movieCd: string | null;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movieCd, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<MovieInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Review Generator states
  const [keyword1, setKeyword1] = useState("");
  const [keyword2, setKeyword2] = useState("");
  const [keyword3, setKeyword3] = useState("");
  const [generating, setGenerating] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset inputs and results when film changes or modal reopens
    setKeyword1("");
    setKeyword2("");
    setKeyword3("");
    setReviewResult(null);
    setGenError(null);
    setCopied(false);
  }, [movieCd]);

  const handleGenerateReview = async () => {
    if (!movie) return;
    if (!keyword1.trim() && !keyword2.trim() && !keyword3.trim()) {
      setGenError("최소 하나 이상의 키워드를 입력해 주세요.");
      return;
    }

    setGenerating(true);
    setGenError(null);
    setReviewResult(null);

    const activeKeywords = [keyword1, keyword2, keyword3]
      .map(k => k.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieNm: movie.movieNm,
          genres: movie.genres?.map(g => g.genreNm).join(", ") || "",
          keywords: activeKeywords,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "감상평 생성에 실패했습니다.");
      }

      const data = await response.json();
      setReviewResult(data.review);
    } catch (err: any) {
      console.error(err);
      setGenError(err.message || "감상평을 생성하는 도중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyReview = () => {
    if (!reviewResult) return;
    navigator.clipboard.writeText(reviewResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!movieCd) return;

    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/movieinfo?movieCd=${movieCd}`);
        if (!response.ok) {
          throw new Error("영화 상세 정보를 가져오는 데 실패했습니다.");
        }
        const data: MovieInfoResponse = await response.json();
        
        if (data.movieInfoResult?.movieInfo) {
          setMovie(data.movieInfoResult.movieInfo);
        } else {
          throw new Error("영화 정보가 존재하지 않습니다.");
        }
      } catch (err: any) {
        console.error("Failed to fetch movie details:", err);
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieCd]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (movieCd) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [movieCd]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!movieCd) return null;

  // Grade badge color helper
  const getGradeBadgeColor = (grade: string) => {
    if (grade.includes("전체")) return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border border-green-200 dark:border-green-800";
    if (grade.includes("12")) return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
    if (grade.includes("15")) return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    if (grade.includes("18") || grade.includes("청소년")) return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800";
    return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md"
        />

        {/* Modal Dialog Body */}
        <motion.div
           initial={{ y: 50, opacity: 0, scale: 0.95 }}
           animate={{ y: 0, opacity: 1, scale: 1 }}
           exit={{ y: 50, opacity: 0, scale: 0.95 }}
           transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
           className="relative w-full max-w-3xl bg-white dark:bg-suit-plum rounded-2xl border border-gray-150 dark:border-white/5 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Close button inside modal wrapper */}
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/10"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Hero Design with Film illustration */}
          <div className="relative h-44 sm:h-56 bg-slate-900 flex-shrink-0 flex items-end p-6 select-none overflow-hidden">
            {/* The beautiful generated cinema banner image as real background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/src/assets/images/cinema_banner_1780020654706.png')` }}>
              {/* Fallback gradient if image fails to load */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
            </div>

            {/* Typography content at the bottom of the hero banner */}
            {!loading && movie && (
              <div className="relative z-10 w-full">
                {/* Watch grade check */}
                {movie.audits && movie.audits.length > 0 && (
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md mb-2 ${getGradeBadgeColor(movie.audits[0].watchGradeNm)}`}>
                    {movie.audits[0].watchGradeNm}
                  </span>
                )}
                
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight line-clamp-1 font-display">
                  {movie.movieNm}
                </h2>
                
                {movie.movieNmEn && (
                  <p className="text-sm text-neutral-300 font-sans tracking-wide mt-1 line-clamp-1 italic">
                    {movie.movieNmEn}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Modal Main Content Container with scrollbar */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-gray-800 dark:text-neutral-200">
            {loading ? (
              // Loading Skeleton loader
              <div className="space-y-6 animate-pulse py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 dark:bg-suit-plum/40 rounded-xl"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-105 dark:bg-suit-plum/40 rounded-md w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-16 bg-gray-100 dark:bg-suit-plum/40 rounded-xl"></div>
                  <div className="h-16 bg-gray-100 dark:bg-suit-plum/40 rounded-xl"></div>
                  <div className="h-16 bg-gray-100 dark:bg-suit-plum/40 rounded-xl"></div>
                </div>
              </div>
            ) : error ? (
              // Error layout
              <div className="text-center py-12">
                <p className="text-red-500 font-semibold mb-2">영화 정보를 로드할 수 없습니다.</p>
                <p className="text-sm text-gray-500 dark:text-white/40">{error}</p>
                <button
                  id="error-close-modal"
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-suit-rose-medium dark:bg-suit-cyan text-suit-plum font-semibold text-sm rounded-lg hover:opacity-90 transition-colors cursor-pointer"
                >
                  확인
                </button>
              </div>
            ) : movie ? (
              // Standard information segments
              <div className="space-y-6">
                
                {/* Meta Attributes Quick Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* Runtime */}
                  <div className="bg-gray-50 dark:bg-suit-plum/40 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-suit-rose-medium dark:text-suit-cyan" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-suit-lavender/40 uppercase font-mono font-semibold">상영 시간</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-neutral-200 mt-0.5">{movie.showTm ? `${movie.showTm}분` : "정보 없음"}</p>
                    </div>
                  </div>

                  {/* Open Date */}
                  <div className="bg-gray-50 dark:bg-suit-plum/40 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-suit-rose-medium dark:text-suit-cyan" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-suit-lavender/40 uppercase font-mono font-semibold">개봉 연도</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-neutral-200 mt-0.5">
                        {movie.openDt ? `${movie.openDt.substring(0, 4)}년` : `${movie.prdtYear}년`}
                      </p>
                    </div>
                  </div>

                  {/* Nations */}
                  <div className="bg-gray-50 dark:bg-suit-plum/40 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <Globe className="w-5 h-5 text-suit-rose-medium dark:text-suit-cyan" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-suit-lavender/40 uppercase font-mono font-semibold">제작 국가</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-neutral-200 mt-0.5 truncate" title={movie.nations.map((n) => n.nationNm).join(", ")}>
                        {movie.nations.length > 0 ? movie.nations[0].nationNm : "정보 없음"}
                      </p>
                    </div>
                  </div>

                  {/* Production Status */}
                  <div className="bg-gray-50 dark:bg-suit-plum/40 p-3 rounded-xl border border-gray-150 dark:border-white/5 flex items-center gap-3">
                    <Award className="w-5 h-5 text-suit-rose-medium dark:text-suit-cyan" />
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-suit-lavender/40 uppercase font-mono font-semibold">제작 분야</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-neutral-200 mt-0.5">{movie.typeNm || "장편영화"}</p>
                    </div>
                  </div>

                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-gray-400 dark:text-suit-lavender/30" /> 장르 카테고리
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.genres && movie.genres.length > 0 ? (
                      movie.genres.map((g, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-suit-plum/40 text-gray-700 dark:text-suit-pink-white/70 rounded-lg text-xs font-medium border border-gray-250 dark:border-white/5">
                          {g.genreNm}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-white/40">등록된 장르가 없습니다.</span>
                    )}
                  </div>
                </div>

                {/* Directors */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-wider font-mono mb-2.5 flex items-center gap-1.5 border-b border-gray-100 dark:border-white/5 pb-1.5">
                    <User className="w-4 h-4 text-gray-400 dark:text-suit-lavender/30" /> 감독 (Directors)
                  </h3>
                  {movie.directors && movie.directors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {movie.directors.map((d, i) => (
                        <div key={i} className="flex flex-col bg-gray-55 dark:bg-suit-plum/45 px-4 py-2.5 rounded-lg border border-gray-100 dark:border-white/5">
                          <span className="text-sm font-bold text-gray-900 dark:text-suit-pink-white/80">{d.peopleNm}</span>
                          {d.peopleNmEn && <span className="text-xs text-gray-410 dark:text-suit-lavender/45 font-mono italic mt-0.5">{d.peopleNmEn}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-white/40">등록된 감독 정보가 없습니다.</p>
                  )}
                </div>

                {/* Leading Actors */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-wider font-mono mb-2.5 flex items-center gap-1.5 border-b border-gray-100 dark:border-white/5 pb-1.5">
                    <Users className="w-4 h-4 text-gray-400 dark:text-suit-lavender/30" /> 주요 출연 배우 (Actors)
                  </h3>
                  {movie.actors && movie.actors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {movie.actors.slice(0, 12).map((a, i) => (
                        <div key={i} className="bg-gray-50/30 dark:bg-suit-plum/30 p-2 rounded-lg border border-gray-100 dark:border-white/5 text-xs">
                          <p className="font-bold text-gray-900 dark:text-suit-pink-white/80 truncate">{a.peopleNm}</p>
                          {a.cast ? (
                            <p className="text-suit-rose-medium dark:text-suit-cyan mt-0.5 font-bold truncate font-sans">역: {a.cast}</p>
                          ) : (
                            a.peopleNmEn && <p className="text-gray-400 dark:text-suit-lavender/40 mt-0.5 truncate font-mono italic">{a.peopleNmEn}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-white/40">등록된 출연배우 정보가 없습니다.</p>
                  )}
                </div>

                {/* Companies: Production & Distributors */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 dark:text-suit-lavender/40 uppercase tracking-wider font-mono mb-2.5 flex items-center gap-1.5 border-b border-gray-100 dark:border-white/5 pb-1.5">
                    <Building className="w-4 h-4 text-gray-400 dark:text-suit-lavender/30" /> 참여 영화 기업 (Companies)
                  </h3>
                  {movie.companys && movie.companys.length > 0 ? (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {movie.companys.slice(0, 5).map((c, i) => (
                        <div key={i} className="px-3 py-1.5 bg-gray-50/50 dark:bg-suit-plum/40 rounded-lg border border-gray-150 dark:border-white/5">
                          <span className="font-semibold text-gray-800 dark:text-suit-pink-white/80">{c.companyNm}</span>
                          <span className="text-gray-400 dark:text-suit-lavender/30 ml-1.5 text-[10px] bg-gray-100 dark:bg-suit-plum/60 px-1 py-0.5 rounded">
                            {c.companyPartNm}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-white/40">등록된 기업 정보가 없습니다.</p>
                  )}
                </div>

                {/* AI Review Generator Section */}
                <div className="bg-gradient-to-br from-suit-rose-light/[0.12] to-suit-lavender/[0.15] dark:from-suit-plum/70 dark:to-suit-plum/45 p-5 rounded-2xl border border-suit-rose-light/25 dark:border-suit-cyan/15 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-suit-pink-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-suit-rose-medium dark:text-suit-cyan" />
                      AI 키워드 감상평 생성기
                    </h3>
                    <span className="text-[10px] font-mono text-suit-rose-medium dark:text-suit-cyan/70 font-semibold uppercase bg-suit-rose-light/20 dark:bg-suit-cyan/10 px-2 py-0.5 rounded-full border border-suit-rose-light/30 dark:border-suit-cyan/20">
                      Powered by Gemini
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-suit-lavender/60">
                    영화의 분위기나 느낌에 어울리는 대표 키워드 3개를 입력하시면, 인공지능 평론가가 자연스럽게 녹아든 맞춤 감상평을 작성해 드립니다.
                  </p>

                  {/* 3 Input Fields Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="키워드 1 (예: 감동)"
                        value={keyword1}
                        onChange={(e) => setKeyword1(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white dark:bg-suit-plum/60 text-gray-900 dark:text-neutral-200 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-suit-rose-medium/50 dark:focus:ring-suit-cyan/50 focus:border-suit-rose-medium dark:focus:border-suit-cyan transition-all"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="키워드 2 (예: 눈물)"
                        value={keyword2}
                        onChange={(e) => setKeyword2(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white dark:bg-suit-plum/60 text-gray-900 dark:text-neutral-200 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-suit-rose-medium/50 dark:focus:ring-suit-cyan/50 focus:border-suit-rose-medium dark:focus:border-suit-cyan transition-all"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="키워드 3 (예: 인생작)"
                        value={keyword3}
                        onChange={(e) => setKeyword3(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white dark:bg-suit-plum/60 text-gray-900 dark:text-neutral-200 border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-suit-rose-medium/50 dark:focus:ring-suit-cyan/50 focus:border-suit-rose-medium dark:focus:border-suit-cyan transition-all"
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleGenerateReview}
                      disabled={generating || (!keyword1.trim() && !keyword2.trim() && !keyword3.trim())}
                      className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        generating 
                          ? "bg-gray-200 dark:bg-suit-plum/80 text-gray-400 cursor-wait"
                          : (!keyword1.trim() && !keyword2.trim() && !keyword3.trim())
                          ? "bg-gray-100 dark:bg-suit-plum/30 text-gray-400 cursor-not-allowed border border-dashed border-gray-200 dark:border-white/5"
                          : "bg-suit-rose-medium text-suit-plum hover:bg-suit-rose-medium/90 dark:bg-suit-cyan dark:text-suit-plum dark:hover:bg-suit-cyan/90 shadow-sm hover:shadow active:scale-95"
                      }`}
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          감상평 생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          AI 감상평 생성
                        </>
                      )}
                    </button>
                  </div>

                  {/* Gen Error Indicator */}
                  {genError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">
                      {genError}
                    </div>
                  )}

                  {/* Result Showcase Card */}
                  <AnimatePresence>
                    {reviewResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-white/75 dark:bg-suit-plum/40 border border-suit-rose-light/30 dark:border-suit-cyan/15 rounded-xl shadow-inner relative flex flex-col gap-3 group/card"
                      >
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-suit-rose-medium/60 dark:text-suit-cyan/60 flex-shrink-0 mt-0.5" />
                          <div className="text-xs sm:text-sm text-gray-800 dark:text-suit-pink-white/95 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                            "{reviewResult}"
                          </div>
                        </div>

                        {/* Copy button */}
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={handleCopyReview}
                            className="text-[11px] font-semibold text-suit-rose-medium dark:text-suit-cyan hover:opacity-80 flex items-center gap-1 cursor-pointer bg-suit-rose-light/20 dark:bg-suit-cyan/10 px-2.5 py-1 rounded-lg border border-suit-rose-light/30 dark:border-suit-cyan/20 duration-200 active:scale-95"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3" />
                                복사 완료!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                감상평 복사하기
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-150 dark:border-white/5 bg-gray-50 dark:bg-suit-plum/80 px-6 py-4 flex justify-between items-center text-xs text-gray-400 dark:text-suit-lavender/40">
            <span>영화코드: {movieCd}</span>
            <span>제공: 영화진흥위원회 통합전산망 (KOBIS)</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
