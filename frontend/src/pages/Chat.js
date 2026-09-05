import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, Settings } from 'lucide-react';
import AuthControls from '@/components/AuthControls';
import { API } from '../lib/api';

const GAME_DURATION = 180; // 3 minutes — every second counts, operative

const PITBULL_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA58JduzYPjHhhRvQTt9yHdV07HmSXRoH7PLbJcbPmUFnUxXIv1umMPmdbQBMAxsDUcYhmQjgYGdUXgZ-KFKVvpeVS3QwrpLGdt3LvztBAzE7NCpjSbeCguB3fZfpGXrqtcntqO_JsfasoUv09IGHx2ELBGm1CAXxVA7yR18HXBkIzUVL0E1vC0fi0lCs6x_L0sKExjGjDPlxz661GYlm7R3btBVxZ1ojodWFEggbYXXu1ybdm_Ov37mKTuHmGAsqn0hy6PjXY7Qp8';
const USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0IIzqdo32YljczlrYGDIwDX4z8coh2uF2r-4VyIeXFf2wAdRiii6mNT3CHeS7vv1XdEugGymz-5UPB0EYHhIdlAUN0BPIeesC8BMrpb7mwYFnhcROmVzcwwvXjx6hGGxeCRZiQ0G-W_LdN_BQ4d0S2M1i1Ykaa5OVrY5zoo6wu4f-fDoikPYCGOlVkSsx1Om5Az7igs_slryHlYwa3lIR4WWKYEwz2OWzuTk-fdBpynb-PIsSrVRLhGC2O1q9NmUBMrUJJ3sAl9s';

const moodLabels = {
  FURIOUS:     { label: "⚡ THREAT: CRITICAL",        color: "text-primary" },
  CONSIDERING: { label: "🔍 THREAT: WAVERING",        color: "text-yellow-400" },
  SAD:         { label: "💧 THREAT: COMPROMISED",     color: "text-blue-400" },
  CONVINCED:   { label: "✓ THREAT: NEUTRALIZED",      color: "text-secondary" },
  UNHINGED:    { label: "☠ THREAT: MAXIMUM",         color: "text-primary" },
};

const winMessages = [
  "MISSION COMPLETE. You actually talked them down. Operative level: Elite. 🔥",
  "Target neutralized. Well played, operative. IRONFANG is... impressed. Grudgingly.",
  "Aye aye aye! You convinced the most stubborn target in the arena. Respect. ⚔"
];
const lossMessages = [
  "💀 MISSION FAILED. IRONFANG roasted you. Better prep next time, operative.",
  "Time's up. Target unswayed. Dust yourself off and re-engage. 😂",
  "GG. IRONFANG remains undefeated. The fang stays sharp. 🏆"
];

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty || 'BETA';
  const language = location.state?.language || 'hi';

  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [pitbullMood, setPitbullMood] = useState('FURIOUS');
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [ending, setEnding] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(true);
  const timerRef = useRef(null);
  const gameResolvedRef = useRef(false);

  useEffect(() => {
    if (!gameActive || showEnding) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameActive, showEnding]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  const getTimerColor = () => timeLeft <= 15 ? 'text-primary' : timeLeft <= 30 ? 'text-yellow-400' : 'text-secondary';
  const getTimerBarWidth = () => `${(timeLeft / GAME_DURATION) * 100}%`;
  const getTimerBarColor = () => timeLeft <= 15 ? 'bg-primary shadow-crimson' : timeLeft <= 30 ? 'bg-yellow-400' : 'bg-secondary shadow-purple';

  const handleGameEnd = useCallback((result, title) => {
    if (gameResolvedRef.current) return;
    gameResolvedRef.current = true;
    setGameActive(false);
    clearInterval(timerRef.current);

    const msgs = result === 'win' ? winMessages : lossMessages;
    const finalMsg = msgs[Math.floor(Math.random() * msgs.length)];

    setEnding({
      type: result === 'win' ? 'success' : 'failure',
      result,
      title: title || (result === 'win' ? '⚔ MISSION COMPLETE' : '💀 MISSION FAILED'),
      message: finalMsg,
    });
    setShowEnding(true);
  }, []);

  const fetchScenario = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/scenarios/${id}?lang=${language}`);
      setScenario(response.data);
      const initialMessage = {
        id: 'initial',
        role: 'pitbull',
        content: response.data.pitbull_personality[difficulty],
        mood: 'FURIOUS',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      toast.error('Failed to load scenario');
    }
  }, [difficulty, id, language]);

  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (gameResolvedRef.current || !gameActive) return;
    if (turnCount >= 3 && pitbullMood === 'CONVINCED') {
      handleGameEnd('win', '⚔ MISSION COMPLETE');
    } else if (pitbullMood === 'FURIOUS' && turnCount >= 10) {
      handleGameEnd('loss', '💀 TARGET UNMOVED');
    }
  }, [turnCount, pitbullMood, gameActive, handleGameEnd]);

  useEffect(() => {
    if (timeLeft === 0 && gameActive && !gameResolvedRef.current) {
      handleGameEnd('loss', '⏰ TIME EXPIRED');
    }
  }, [timeLeft, gameActive, handleGameEnd]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !gameActive) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        scenario_id: id,
        difficulty: difficulty,
        user_message: inputMessage,
        chat_history: messages,
        language: language
      });

      const pitbullMessage = {
        id: `pitbull-${Date.now()}`,
        role: 'pitbull',
        content: response.data.pitbull_message,
        mood: response.data.pitbull_mood,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, pitbullMessage]);
      setPitbullMood(response.data.pitbull_mood);
      setTurnCount(response.data.turn_count);

      if (response.data.helper_message) {
        setTimeout(() => {
          const helperMessage = {
            id: `helper-${Date.now()}`,
            role: 'helper',
            content: response.data.helper_message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, helperMessage]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('IRONFANG signal lost. Reconnecting...');
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodDisplay = (mood) => moodLabels[mood] || moodLabels.FURIOUS;

  // ── Loading screen ──
  if (!scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute inset-0 grid-bg opacity-40"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-crimson"></div>
          <div className="text-lg font-display text-primary uppercase tracking-[0.3em] animate-flicker">
            ESTABLISHING LINK...
          </div>
        </div>
      </div>
    );
  }

  // ── Ending screen ──
  if (showEnding && ending) {
    const isWin = ending.type === 'success';
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative bg-background">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 grid-bg opacity-50"></div>
          <div className="absolute inset-0 noise-bg"></div>
          <div className={`absolute top-1/3 left-1/3 w-[40%] h-[40%] ${isWin ? 'bg-secondary/15' : 'bg-primary/15'} blur-[130px] rounded-full`}></div>
          <div className="absolute inset-0 vignette"></div>
        </div>
        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          {/* Icon */}
          <div className={`w-20 h-20 mx-auto rounded-sm flex items-center justify-center border-2 ${isWin ? 'bg-secondary/15 border-secondary/40 shadow-purple' : 'bg-primary/15 border-primary/40 shadow-crimson'}`}>
            <span className="text-5xl">{isWin ? '⚔' : '💀'}</span>
          </div>

          {/* Title */}
          <h1
            data-testid="ending-title"
            className={`text-4xl md:text-5xl font-display font-black uppercase tracking-widest ${isWin ? 'text-secondary' : 'text-primary'}`}
          >
            {ending.title}
          </h1>

          {/* Corner decorations */}
          <div className={`metal-panel rounded-sm p-6 border ${isWin ? 'border-secondary/25' : 'border-primary/25'} corner-accent`}>
            <p data-testid="ending-message" className="text-base text-foreground/85 font-mono leading-relaxed">
              {ending.message}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              data-testid="play-again-btn"
              onClick={() => navigate('/scenarios', { state: { language } })}
              className="btn-ironfang text-white font-display uppercase font-bold px-12 py-4 rounded-sm border-0 tracking-widest"
            >
              {isWin ? '⚔ NEW MISSION' : '↺ RE-ENGAGE'}
            </Button>
            <p className="text-xs text-muted-foreground/50 font-mono">
              Turns: {turnCount} · Final threat: {getMoodDisplay(pitbullMood).label} · Time remaining: {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main game UI ──
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* ── Header HUD ── */}
      <header className="flex h-18 items-center justify-between border-b border-gunmetal/60 px-4 md:px-6 bg-panel-dark/80 backdrop-blur-md z-10 shrink-0 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-deep-crimson to-bright-crimson rounded-sm border border-primary/30 shadow-crimson">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L8 8L4 20L12 16L20 20L16 8L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-sm md:text-base font-bold tracking-widest uppercase italic font-display text-foreground" data-testid="active-mission-title">
            IRONFANG
          </h2>
        </div>

        {/* Timer HUD */}
        <div className="flex-1 max-w-2xl px-4 md:px-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">timer</span>
              COMBAT TIMER
            </span>
            <span data-testid="timer-display" className={`text-base font-mono font-black ${getTimerColor()} ${timeLeft <= 15 ? 'animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-2 w-full rounded-sm bg-gunmetal/60 overflow-hidden border border-gunmetal/40">
            <div className={`h-full ${getTimerBarColor()} transition-all duration-1000 rounded-sm`} style={{ width: getTimerBarWidth() }}></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button className="bg-gunmetal/50 hover:bg-gunmetal p-2 rounded-sm transition-colors border border-gunmetal/60">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
          <AuthControls />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-64 border-r border-gunmetal/60 bg-panel-dark/60 p-5 flex flex-col gap-6 hidden lg:flex">
          {/* Active Mission */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.25em]">Active Mission</h3>
            <div className="p-4 rounded-sm bg-primary/8 border border-primary/20 group">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-sm group-hover:scale-110 transition-transform">bolt</span>
                <span className="font-bold text-foreground text-xs">{scenario.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{scenario.description}</p>
            </div>
          </div>

          {/* Threat Level */}
          <div className="space-y-3">
            <h3 className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.25em]">Threat Intel</h3>
            <div className="flex items-center gap-3 p-4 rounded-sm bg-gunmetal/30 border border-gunmetal/50">
              <div className="flex flex-col">
                <span data-testid="ai-mood" className={`text-xs font-bold uppercase tracking-wider ${getMoodDisplay(pitbullMood).color}`}>
                  {getMoodDisplay(pitbullMood).label}
                </span>
                <span className="text-[10px] text-primary/70 font-mono mt-0.5">AGITATION: {Math.min(turnCount * 10, 98)}%</span>
              </div>
            </div>
          </div>

          {/* Mood bar */}
          <div className="space-y-2">
            <h3 className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.25em]">Neutralization Progress</h3>
            <div className="h-2 rounded-sm bg-gunmetal/50 overflow-hidden border border-gunmetal/40">
              <div
                className={`h-full transition-all duration-500 rounded-sm ${
                  pitbullMood === 'CONVINCED' ? 'bg-secondary shadow-purple' :
                  pitbullMood === 'SAD' ? 'bg-blue-400' :
                  pitbullMood === 'CONSIDERING' ? 'bg-yellow-400' : 'bg-primary shadow-crimson'
                }`}
                style={{ width: pitbullMood === 'CONVINCED' ? '100%' : pitbullMood === 'SAD' ? '70%' : pitbullMood === 'CONSIDERING' ? '40%' : '15%' }}
              ></div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="mt-auto space-y-3 pt-5 border-t border-gunmetal/40">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <span className="material-symbols-outlined text-xs">translate</span>
              <span className="text-[10px] font-mono uppercase">
                CHAN: {language === 'hi' ? '🇮🇳 HINGLISH' : '🇺🇸 ENGLISH'}
              </span>
            </div>
            <button
              data-testid="terminate-session-btn"
              onClick={() => {
                if (!gameResolvedRef.current) {
                  handleGameEnd('loss', '❌ ABANDONED');
                } else {
                  navigate('/scenarios', { state: { language } });
                }
              }}
              className="w-full py-2.5 rounded-sm bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase transition-all tracking-widest border border-primary/20"
            >
              Abort Mission
            </button>
          </div>
        </aside>

        {/* ── Main Chat Area ── */}
        <main className="flex-1 flex flex-col bg-background relative">

          {/* Critical time warning */}
          {timeLeft <= 15 && timeLeft > 0 && gameActive && (
            <div className="absolute top-0 left-0 right-0 bg-primary/90 backdrop-blur-sm text-white py-2 text-center z-20 animate-pulse border-b border-primary/50">
              <span className="font-display font-bold uppercase tracking-widest text-xs">
                ⚠ CRITICAL — {formatTime(timeLeft)} REMAINING ⚠
              </span>
            </div>
          )}

          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-5" data-testid="chat-messages-container">
            {messages.map((message) => (
              <div key={message.id} data-testid={`message-${message.role}`}>

                {/* AI / IRONFANG messages */}
                {message.role !== 'user' && (
                  <div className="flex items-end gap-3 max-w-[88%]">
                    <div
                      className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 border overflow-hidden ${
                        message.role === 'helper'
                          ? 'border-secondary/50 bg-secondary/15'
                          : 'border-primary/50 shadow-crimson'
                      }`}
                      style={message.role === 'pitbull' ? { backgroundImage: `url('${PITBULL_AVATAR}')`, backgroundSize: 'cover' } : {}}
                    >
                      {message.role === 'helper' && <span className="text-secondary text-xs">💡</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-1 ${message.role === 'helper' ? 'text-secondary' : 'text-primary'}`}>
                        {message.role === 'helper' ? 'TACTICAL AI' : 'IRONFANG ⚡'}
                      </span>
                      <div className={`${message.role === 'helper' ? 'chat-bubble-helper' : 'chat-bubble-pitbull'} px-5 py-4 shadow-xl`}>
                        <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap text-foreground/90">
                          {message.content}
                        </p>
                        {message.mood && (
                          <div className="mt-2 pt-2 border-t border-gunmetal/40">
                            <span className={`text-[10px] font-display uppercase tracking-widest ${getMoodDisplay(message.mood).color}`}>
                              {getMoodDisplay(message.mood).label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* User messages */}
                {message.role === 'user' && (
                  <div className="flex items-end gap-3 flex-row-reverse">
                    <div className="w-9 h-9 rounded-sm flex items-center justify-center border-2 border-secondary/50 shrink-0 overflow-hidden" style={{ backgroundImage: `url('${USER_AVATAR}')`, backgroundSize: 'cover' }}></div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] px-1">OPERATIVE</span>
                      <div className="chat-bubble-user px-5 py-4 shadow-xl">
                        <p className="text-sm leading-relaxed text-foreground/90">{message.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-3 max-w-[88%]">
                <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0 border border-primary/50 overflow-hidden shadow-crimson" style={{ backgroundImage: `url('${PITBULL_AVATAR}')`, backgroundSize: 'cover' }}></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] px-1">IRONFANG ⚡</span>
                  <div className="chat-bubble-pitbull px-5 py-4 shadow-xl">
                    <div className="flex space-x-1.5 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.12s' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.24s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Bar ── */}
          <div className="p-4 md:p-5 bg-panel-dark/70 backdrop-blur-xl border-t border-gunmetal/60">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
              <div className="flex-1 relative group">
                <input
                  data-testid="chat-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading || !gameActive}
                  className="w-full bg-gunmetal/40 border border-gunmetal/60 focus:border-primary/60 focus:ring-0 focus:outline-none rounded-sm px-5 py-3.5 text-foreground placeholder-muted-foreground/50 transition-all font-mono text-sm disabled:opacity-40 shadow-inner"
                  placeholder={
                    gameActive
                      ? (language === 'hi'
                          ? 'IRONFANG ko convince karo... Hinglish mein bol ⚡'
                          : 'Engage IRONFANG... English or Hinglish ⚡')
                      : 'Mission over...'
                  }
                  type="text"
                />
                {/* Focus glow */}
                <div className="absolute inset-0 rounded-sm pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" style={{ boxShadow: '0 0 0 1px rgba(230,57,70,0.4)' }}></div>
              </div>
              <button
                data-testid="send-btn"
                type="submit"
                disabled={isLoading || !inputMessage.trim() || !gameActive}
                className="btn-ironfang font-bold h-[52px] px-7 rounded-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none border-0"
              >
                <span className="text-xs uppercase tracking-widest hidden sm:inline text-white">Send</span>
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

          {/* ── Status Bar ── */}
          <div className="px-5 py-2 bg-panel-dark/40 flex justify-between items-center border-t border-gunmetal/30">
            <div className="flex gap-5">
              <span className="text-[9px] text-muted-foreground/50 font-mono tracking-tight">TURN {turnCount}/10</span>
              <span className="text-[9px] text-muted-foreground/50 font-mono tracking-tight">CHAN: {language.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
              <span className="text-[9px] text-primary font-bold uppercase tracking-widest">IRONFANG Active</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
