import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, ArrowLeft, Mic, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! I am the UniWay assistant. Ask me about MUJ.' },
  ]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // @ts-ignore - vendor prefix
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      // Prefer final when available, else interim
      setText((prev) => (finalText ? (prev ? `${prev} ${finalText}` : finalText) : interim));
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      try { recognition.stop(); } catch {}
    };
  }, []);

  const toggleMic = () => {
    if (!speechSupported) return;
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isListening) {
      try { recognition.stop(); } catch {}
      setIsListening(false);
    } else {
      try { recognition.start(); setIsListening(true); } catch {}
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    const userText = text;
    setText('');
    setError(null);
    setMessages((m) => [...m, { role: 'user', text: userText }]);
    try {
      setLoading(true);
      const systemPreamble = 'You are UniWay, a helpful assistant for Manipal University Jaipur. Keep answers concise.';
      // Call backend only
      const backendRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPreamble,
          model: 'gemini-2.5-flash',
          messages: [
            ...messages,
            { role: 'user', text: userText },
          ],
        }),
      });
      if (!backendRes.ok) {
        const err = await backendRes.json().catch(() => ({}));
        throw new Error(err?.error || 'Backend error');
      }
      const json = await backendRes.json();
      const botText = json?.text || 'Sorry, I could not generate a response.';
      setMessages((m) => [...m, { role: 'bot', text: botText }]);
    } catch (e: any) {
      console.error(e);
      setError('Failed to contact AI service.');
      setMessages((m) => [...m, { role: 'bot', text: 'There was an error reaching the AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">AI Chatbot</h1>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-xs text-red-600">{error}</div>
            )}
          </div>
          <div className="border-t border-border p-3 flex gap-2 items-center">
            <Input placeholder="Ask about MUJ..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !loading && send()} />
            <Button type="button" variant={isListening ? 'destructive' : 'secondary'} onClick={toggleMic} disabled={!speechSupported || loading} title={speechSupported ? (isListening ? 'Stop listening' : 'Start voice input') : 'Voice input not supported on this browser'}>
              {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button onClick={send} disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {!speechSupported && (
            <div className="px-3 pb-3 text-[11px] text-muted-foreground">Voice input isn’t supported in this browser. Try Chrome on desktop or Android.</div>
          )}
        </div>
        {/* Backend-only: no API key input on client */}
      </div>
    </div>
  );
};

export default ChatbotPage;
