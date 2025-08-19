/* Simple Express backend to proxy Gemini calls securely */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

function getApiKey() {
  return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
}

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(500).json({ error: 'Server API key missing. Set GEMINI_API_KEY in .env on the server.' });
    }

    const { messages = [], systemPreamble = 'You are UniWay, a helpful assistant for Manipal University Jaipur. Keep answers concise.', model = 'gemini-2.5-flash' } = req.body || {};

    const contents = [
      { role: 'user', parts: [{ text: systemPreamble }] },
      ...messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    ];

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({ model, contents });

    const text = (response && response.text) ||
      (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts.map(p => p.text).filter(Boolean).join('\n')) ||
      '';

    return res.json({ text });
  } catch (err) {
    console.error('Backend /api/chat error:', err);
    return res.status(500).json({ error: 'Failed to contact Gemini service.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
