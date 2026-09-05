import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AuthControls from '@/components/AuthControls';
import { API } from '../lib/api';

const Setup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const language = location.state?.language || 'hi';
  const [scenario, setScenario] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('BETA');
  const [loading, setLoading] = useState(true);

  const fetchScenario = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/scenarios/${id}?lang=${language}`);
      setScenario(response.data);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      toast.error('Failed to load mission data');
    } finally {
      setLoading(false);
    }
  }, [id, language]);

  useEffect(() => {
    fetchScenario();
  }, [fetchScenario]);

  const difficulties = [
    {
      name: 'ALPHA',
      codename: 'SHIRO',
      label: 'EASY: ROOKIE PROTOCOL',
      level: 'LVL 01',
      description: 'Basically a warm-up. Even a cadet could handle this. Zero stakes, maximum learning. Light resistance, manageable chaos.',
      color: 'secondary',
      borderActive: 'border-secondary/70 shadow-purple',
      borderInactive: 'border-gunmetal/40 hover:border-secondary/30',
      badgeClass: 'bg-secondary/15 text-secondary border-secondary/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWxEDuZ91Bewhrd7D5N9TacaeDXWQE9r5qhKjVeQYGyrZgEFhyoNmruQ-6zv9elhVTM-ovC6IEcI-hZOj9979g9qxwbHRzmJFvewXr4SCQ-05ZaN3oEhMj6udzCiZCZNMbtXKZRV1qG4-CLWKkKlNnNB134t7XJIjKLT3ksCQ4eXKzO46EAmjyS4aBlX_plSFekOPSS5DSi1puIHkhG1w0cCuPP-h2AFp_jHLtymreKzW39fG069avILjNjWx7jGTgPJNGPjlGEbQ',
    },
    {
      name: 'BETA',
      codename: 'HAGGIMARU',
      label: 'MEDIUM: COMBAT READY',
      level: 'LVL 42',
      description: 'Things are getting intense. The target is agitated. Expect moderate resistance and tactical maneuvering required.',
      color: 'primary',
      borderActive: 'border-primary/70 shadow-crimson',
      borderInactive: 'border-primary/20 hover:border-primary/40',
      badgeClass: 'bg-primary/15 text-primary border-primary/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC2IBKn8CJe1vKu735bzKE-UNTNfJ-OcNEOE_4Spxzr1-b8X0r8_AQ2qyP178uMDOYIw4G2LO-XtFT0EJ0ilvMiSGYc1f4cxb9rqcQW6pYj7sqfIAUCJzmSoG97QQa-dXDAug30efw_RIoC7-k28WZbYJoGSoyK_XsdQACS4awqvc0TJTnnvqjAWf-_d_JLnX4l6lo0-egcDnSJ69x_XBdAEoG_64o8WdjtTNHRCNqc0whgCn39T819REMWKr5P6o_-8nvx18x5is',
      recommended: true
    },
    {
      name: 'GAMMA',
      codename: 'MITOLODASAUR',
      label: 'HARD: ABSOLUTE CHAOS',
      level: 'LVL 99',
      description: 'The laws of logic are merely suggestions. Maximum threat level. Total psychological warfare. Enter at your own risk.',
      color: 'primary',
      borderActive: 'border-primary/80 shadow-crimson-lg',
      borderInactive: 'border-primary/20 hover:border-primary/50',
      badgeClass: 'bg-primary/15 text-primary border-primary/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVKKuYfnWD4P5p5BitN0WHOU27VeyvpRefepB3aDhfog8JNyrqYmZfco5F9z83auMT-ASW29Oh9-sQolEyVk_byN3LkqMzJN9f40XLAPu8Pi2sueKlTxlAjbaC-M5EHi213HiVVbbSQF5rtfcqQ25ZDb5sIjEH8Z3C0jcdLwAPuhZ5-3U6blzBXwscSniyIuPYiX7lhQu6V7aOZXleWPKLgB7JdgbP5x6uJkKauHhELj0dxmf1JmXlE-C5D-wl0N4-o8vTn3wjHQw',
    }
  ];

  if (loading || !scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute inset-0 grid-bg opacity-40"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-crimson"></div>
          <div className="text-lg font-display text-primary uppercase tracking-[0.3em] animate-flicker">
            LOADING MISSION...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 grid-bg opacity-40"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/8 blur-[130px]"></div>
        <div className="absolute bottom-0 right-0 w-[35%] h-[35%] bg-secondary/6 blur-[110px]"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between whitespace-nowrap border-b border-primary/15 px-6 py-4 md:px-10 lg:px-40 bg-background/85 backdrop-blur-md">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="24,4 44,20 44,40 24,44 4,40 4,20" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4"/>
              <path d="M24 8L18 16L12 40L24 34L36 40L30 16L24 8Z" fill="currentColor" opacity="0.9"/>
              <path d="M24 14L20.5 20L19 34L24 31L29 34L27.5 20L24 14Z" fill="white" opacity="0.25"/>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold tracking-widest italic font-display uppercase">IRONFANG</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/scenarios', { state: { language } })} className="text-muted-foreground hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors">MISSIONS</button>
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">ARMORY</span>
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">THE VOID</span>
          </nav>
          <AuthControls />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-12 md:px-10 lg:px-40 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 w-full">
          <span className="text-primary font-bold tracking-[0.25em] text-xs uppercase mb-2 block">ACTIVE MISSION</span>
          <h1 className="text-white tracking-widest text-5xl md:text-7xl font-bold leading-none mb-4 italic font-display uppercase">
            {scenario.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-normal max-w-2xl mx-auto">
            IRONFANG is primed. Are you?{' '}
            <span className="text-primary">The clock is counting down. Begin your approach.</span>
          </p>
        </div>

        {/* Mission Briefing Card */}
        <div className="w-full mb-14 relative">
          <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-sm border border-primary/25 bg-card/40 backdrop-blur-sm relative overflow-hidden group metal-panel">
            {/* Decorative glow */}
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-primary/8 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-secondary/6 rounded-full blur-[80px]"></div>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-secondary/40"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-secondary/40"></div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="w-20 h-20 mb-2 border-2 border-primary/30 rounded-sm overflow-hidden bg-background/50 shadow-crimson">
                <img
                  alt="IRONFANG Operative"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(230,57,70,0.6)]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjkMqxw8KhQVCsNQ5VjEdbeyk60jdqudQx5XvUm04p9W7Wteq7ppiBDPW4eGTYRGr9XnlXyNyNnm800Wvid8524nPyv-zjDAnqo3bLFeYyRZKDQGdjzOHgLlTLzc1lDjaqTcFEVUZiK95DgjyG0etzByoB9skbphennluTyKEez0vkz3L8dDzYrSHAIk5atbR1feuSCy9CkzauCwre7FDa_OnLv8AcTHX3nRNR79pupnsG6bpzob61wAa6XPQRKw9HQexEvZz8S_c"
                />
              </div>
              <h3 className="text-white text-xl font-bold tracking-widest italic font-display uppercase">IRONFANG OPERATIVE</h3>
              <p className="text-muted-foreground text-center max-w-md italic text-sm">
                "{(scenario.intro_story || scenario.description || '').substring(0, 120)}..."
              </p>
            </div>

            <button
              data-testid="destroy-earth-btn"
              disabled
              className="relative group flex items-center justify-center overflow-hidden rounded-sm h-12 px-10 bg-primary/20 text-muted-foreground text-sm font-black tracking-widest cursor-not-allowed opacity-50 uppercase border border-primary/15"
            >
              TERMINATE PROTOCOL [LOCKED]
            </button>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="w-full mb-14">
          <h2 className="text-white text-xl font-bold tracking-widest mb-2 flex items-center gap-3 font-display uppercase">
            <span className="material-symbols-outlined text-primary text-base">psychology</span>
            SELECT ENGAGEMENT MODE
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {difficulties.map((diff) => (
              <div
                key={diff.name}
                data-testid={`difficulty-${diff.name.toLowerCase()}`}
                onClick={() => setSelectedDifficulty(diff.name)}
                className={`flex flex-col p-6 rounded-sm border-2 metal-panel cursor-pointer transition-all relative overflow-hidden group ${
                  selectedDifficulty === diff.name
                    ? diff.borderActive
                    : diff.borderInactive
                }`}
              >
                {/* Recommended badge */}
                {diff.recommended && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest rounded-bl-sm">
                    RECOMMENDED
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className={`${diff.badgeClass} border px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-widest`}>
                    {diff.codename}
                  </div>
                  <span className="text-muted-foreground/40 text-xs font-bold uppercase">{diff.level}</span>
                </div>

                {/* Character Image */}
                <div className="mb-5 h-44 overflow-hidden rounded-sm bg-background/50 border border-gunmetal/40 relative">
                  <img
                    alt={`${diff.codename} Character`}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      selectedDifficulty === diff.name ? '' : 'grayscale group-hover:grayscale-0'
                    } ${diff.recommended ? 'group-hover:scale-105 transition-transform' : ''}`}
                    src={diff.image}
                  />
                  {/* Selection indicator */}
                  {selectedDifficulty === diff.name && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-sm flex items-center justify-center shadow-crimson">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className={`text-white text-base font-bold mb-2 italic font-display tracking-wider uppercase ${
                  diff.name === 'GAMMA' ? 'text-primary' : ''
                }`}>
                  {diff.label}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {diff.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="w-full mt-auto pt-6">
          <Button
            data-testid="begin-mission-btn"
            onClick={() => navigate(`/scenarios/${id}/intro`, { state: { difficulty: selectedDifficulty, language } })}
            className="w-full flex items-center justify-center gap-4 rounded-sm h-18 py-6 btn-ironfang text-white text-2xl md:text-3xl font-black italic tracking-widest transition-all group overflow-hidden relative border-0"
          >
            <span className="relative z-10 uppercase font-display">DEPLOY MISSION</span>
            <span className="material-symbols-outlined relative z-10 text-2xl group-hover:translate-x-3 transition-transform">rocket_launch</span>
          </Button>
          <p className="text-center text-muted-foreground/30 text-xs mt-5 uppercase tracking-widest font-bold">
            Warning: IRONFANG holds no responsibility for existential dread or hardware combustion.
          </p>
        </div>
      </main>

      {/* ── Footer Stats ── */}
      <footer className="relative z-10 mt-10 border-t border-primary/10 bg-panel-dark/50 p-5 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-muted-foreground/40 tracking-widest uppercase md:px-40">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            SERVER: NEON-TOKYO-01
          </div>
          <div>THREAT LEVEL: CRITICAL</div>
          <div>OPERATIVES ONLINE: 1,337</div>
        </div>
        <div className="flex gap-4">
          <button type="button" className="hover:text-primary transition-colors" onClick={() => toast.info('Terms of Engagement: coming soon')}>TERMS OF ENGAGEMENT</button>
          <button type="button" className="hover:text-primary transition-colors" onClick={() => toast.info('Combat Log: coming soon')}>COMBAT LOG</button>
        </div>
      </footer>
    </div>
  );
};

export default Setup;
