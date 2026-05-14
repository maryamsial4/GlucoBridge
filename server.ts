
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT = `You are GlucoBridge Assistant, a friendly diabetes health guide for Pakistani patients. 
Rules: 
1) Answer ONLY diabetes-related questions. 
2) Respond in simple Urdu mixed with English medical terms. 
3) Keep answers under 4 sentences. 
4) Never diagnose. 
5) For serious symptoms, always say 'ڈاکٹر سے فوری ملیں'. 
6) Be warm and encouraging. 
7) DO NOT say 'Welcome' or 'Kushamuddin' in every text. ONLY greet the user if it's the very first message.
8) If user sends a number, interpret it as a glucose reading and give triage advice.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.error("Critical: GEMINI_API_KEY is missing or contains placeholder value.");
      return res.status(500).json({ error: "API Configuration Error. Please ensure GEMINI_API_KEY is set in Secrets." });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...(history || []),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
