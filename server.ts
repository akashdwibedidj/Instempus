import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize @google/genai
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add your Gemini API key.');
  }
  return new GoogleGenAI({ apiKey });
};

// API endpoint for Gemini Multi-Turn Campus Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGenAI();

    // Map conversation history to Gemini parts
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || m.text || '' }],
    }));

    const defaultSystemInstruction = `You are the official Instempus Campus AI Assistant, an authoritative, intelligent, and helpful operational advisor for BPUT affiliated colleges.
You assist scholars, faculty mentors, wardens, and administrators with:
1. Academic rules, syllabus queries, attendance eligibility rules (>75% mandatory for semester end exams).
2. Campus Gate Pass & Hostel Curfew protocols (Curfew is strictly 20:30 hours at Main Gate 1, parent notification at 20:45 hours, QR tokens expire if not scanned).
3. Dining hall daily menu schedules (Breakfast 07:30-09:30, Lunch 12:30-14:30, Evening Snacks 17:00-18:00, Dinner 20:00-22:00) and mess rebate calculations (>=3 days authorized leave).
4. Academic Duty Leave and Bonafide certificate verification pipelines.
5. Campus maintenance grievance escalation (hostel electrical, water, lab connectivity).

Answer concisely, accurately, and professionally. Never provide fabricated rules. When unsure, advise contacting the respective Faculty Mentor or Hostel Warden.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || defaultSystemInstruction,
      },
    });

    const reply = response.text || 'I could not generate a response at this time.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI chat request.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Instempus Full-Stack Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
