import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API } from '../lib/api';

const Intro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || 'BETA';
  const language = location.state?.language || 'hi';

  const [scenario, setScenario] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchScenario = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/scenarios/${id}?lang=${language}`);
      setScenario(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      toast.error('Failed to load mission briefing');
    }
  }, [id, language]);

  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  useEffect(() => {
    if (!scenario) return;
    const fullText = scenario.intro_story;
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 28);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [scenario, currentIndex]);

  const skipIntro = () => {
    if (scenario) {
      setDisplayedText(scenario.intro_story);
      setCurrentIndex(scenario.intro_story.length);
      setIsComplete(true);
    }
  };

  const handleEnterChat = () => {
    navigate(`/scenarios/${id}/chat`, { state: { difficulty, language } });
  };

  if (loading || !scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute inset-0 grid-bg opacity-40"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-crimson"></div>
          <div className="text-lg font-display text-primary uppercase tracking-[0.3em] animate-flicker">
            INITIALIZING...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-background">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 grid-bg opacity-50"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-primary/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30%] h-[30%] bg-secondary/8 blur-[110px] rounded-full"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-10">
        {/* Header block */}
        <div className="space-y-4">
          {/* IRONFANG icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-sm bg-primary/15 border-2 border-primary/40 flex items-center justify-center shadow-crimson">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M12 2L8 8L4 20L12 16L20 20L16 8L12 2Z" fill="currentColor" opacity="0.9"/>
              <path d="M12 6L9.5 11L8 18L12 15.5L16 18L14.5 11L12 6Z" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-5 py-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em]">IRONFANG • {difficulty} MODE</span>
          </div>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
        </div>

        {/* Mission Briefing Terminal */}
        <div className="metal-panel rounded-sm border border-primary/25 p-8 min-h-[200px] relative corner-accent shadow-crimson">
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gunmetal/60">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            <div className="w-2 h-2 rounded-full bg-secondary/60"></div>
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
            <span className="text-xs text-muted-foreground/50 font-mono uppercase tracking-widest ml-2">MISSION BRIEFING — ENCRYPTED</span>
          </div>
          <p className="text-foreground/85 font-mono text-sm leading-relaxed text-left" data-testid="intro-story">
            {displayedText}
            {!isComplete && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse rounded-sm"></span>}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          {isComplete ? (
            <Button
              data-testid="enter-chat-btn"
              onClick={handleEnterChat}
              className="btn-ironfang text-white text-base px-16 py-6 uppercase font-bold tracking-widest rounded-sm transition-all font-display border-0"
            >
              ⚔ ENGAGE TARGET
            </Button>
          ) : (
            <Button
              data-testid="skip-intro-btn"
              onClick={skipIntro}
              variant="outline"
              className="bg-transparent border border-gunmetal/60 text-muted-foreground hover:bg-white/5 hover:text-white font-display uppercase rounded-sm text-xs tracking-widest px-8 py-3"
            >
              SKIP BRIEFING »
            </Button>
          )}
          <p className="text-xs text-muted-foreground/40 uppercase tracking-widest">
            Channel: {language === 'hi' ? '🇮🇳 HINGLISH' : '🇺🇸 ENGLISH'} · Mode: {difficulty}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
