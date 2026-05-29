import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

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
