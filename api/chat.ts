import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server API key missing' });
    return;
  }

  try {
    const { messages = [], systemPreamble = 'You are UniWay, a helpful assistant for Manipal University Jaipur. Keep answers concise.', model = 'gemini-2.5-flash' } = req.body || {};

    const contents = [
      { role: 'user', parts: [{ text: systemPreamble }] },
      ...messages.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    ];

    const genAI = new GoogleGenAI({ apiKey });
    const response = await genAI.models.generateContent({ model, contents });

    const text = (response && (response as any).text)
      || ((response as any)?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join('\n'))
      || '';

    res.status(200).json({ text });
  } catch (err: any) {
    console.error('Chat API error:', err?.message || err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
