import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const HOST = "0.0.0.0";

  // Use the API key from environment variable
  const apiKey = process.env.KOBIS_API_KEY || "eb0be4777cca45c4a4721184703294f6";

  app.use(express.json());

  // API 1: Daily Box Office List proxy
  app.get("/api/boxoffice", async (req, res) => {
    try {
      const { targetDt } = req.query;
      if (!targetDt) {
        return res.status(400).json({ error: "targetDt parameter is required (format: YYYYMMDD)" });
      }

      const url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${targetDt}`;
      console.log(`Fetching box office for date ${targetDt}...`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching daily box office:", error);
      res.status(500).json({ error: "Failed to fetch daily box office list", details: error.message });
    }
  });

  // API 2: Movie Details search proxy
  app.get("/api/movieinfo", async (req, res) => {
    try {
      const { movieCd } = req.query;
      if (!movieCd) {
        return res.status(400).json({ error: "movieCd parameter is required" });
      }

      const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${movieCd}`;
      console.log(`Fetching movie info for code ${movieCd}...`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API responded with status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching movie info:", error);
      res.status(500).json({ error: "Failed to fetch movie details", details: error.message });
    }
  });

  // API 3: Gemini Movie Review Generator proxy
  app.post("/api/generate-review", async (req, res) => {
    try {
      const { movieNm, genres, keywords } = req.body;
      if (!movieNm || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "필수 정보(영화명, 키워드)가 누락되었습니다." });
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(500).json({ error: "Gemini API key가 설정되지 않았습니다. 관리자 제어판의 Settings > Secrets를 확인하십시오." });
      }

      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const userPrompt = `영화 "${movieNm}" (장르: ${genres || "알수없음"})에 대한 감상평을 작성해줘. 
꼭 포함해야 할 3가지 키워드: [${keywords.filter(Boolean).join(", ")}].
이 키워드들을 자연스럽게 녹여내서 독창적이고 마음에 와닿는 감상평을 3~4문장 분량의 한국어로 정성스럽게 작성해줘. 
문맥이 자연스럽고 영화 매니아처럼 성설하고 매력 넘치게 적어줘.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "너는 관객의 마음을 움직이는 전문적인 영화 평론가이자 감성적인 영화 칼럼니스트야. 키워드를 녹여 매끄럽고 영화의 감성이 잘 묻어나는 명품 감상평을 작성해줘.",
          temperature: 0.8,
        },
      });

      const review = response.text || "감상평을 생성할 수 없습니다.";
      res.json({ review });
    } catch (error: any) {
      console.error("Error generating review:", error);
      res.status(500).json({ error: "감상평 생성 도중 오류가 발생했습니다.", details: error.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files from dist directory...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
