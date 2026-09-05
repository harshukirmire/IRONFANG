import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import AuthControls from '@/components/AuthControls';
import { API } from '../lib/api';

// Map scenario icons by index for visual richness
const scenarioIcons = [
  'local_fire_department',
  'favorite',
  'casino',
  'rocket_launch',
  'hive',
];

const getDifficultyBadge = (level) => {
  switch (level) {
    case 'ALPHA':
      return (
        <span className="px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-widest border border-secondary/50 text-secondary bg-secondary/10">
          Alpha
        </span>
      );
    case 'BETA':
      return (
        <span className="px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-widest bg-gunmetal/50 text-foreground border border-gunmetal">
          Beta
        </span>
      );
    case 'GAMMA':
      return (
        <span className="px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/40 shadow-crimson">
          Gamma
        </span>
      );
    default:
      return null;
  }
};

const Scenarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = location.state?.language || 'hi';
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScenarios = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/scenarios?lang=${language}`);
      setScenarios(response.data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast.error('Failed to load mission files');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute inset-0 grid-bg opacity-40"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin shadow-crimson"></div>
          <div className="text-lg font-display text-primary uppercase tracking-[0.3em] animate-flicker">
            LOADING MISSION FILES...
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
        <div className="absolute top-0 right-0 w-[35%] h-[35%] bg-primary/8 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-secondary/6 blur-[110px]"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>

      {/* ── Header ── */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gunmetal/60 px-6 md:px-20 py-4 bg-background/85 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 text-primary">
            {/* IRONFANG geometric logo */}
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="24,4 44,20 44,40 24,44 4,40 4,20" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4"/>
              <path d="M24 8L18 16L12 40L24 34L36 40L30 16L24 8Z" fill="currentColor" opacity="0.9"/>
              <path d="M24 14L20.5 20L19 34L24 31L29 34L27.5 20L24 14Z" fill="white" opacity="0.25"/>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-widest font-display uppercase">IRONFANG</h2>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate('/')}
            className="flex min-w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-sm h-9 px-4 glass-effect text-muted-foreground text-xs font-bold border border-gunmetal/60 hover:bg-white/5 transition-colors uppercase tracking-widest"
          >
            <span className="truncate">Home</span>
          </button>
          <AuthControls />
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 px-6 md:px-20 py-10 max-w-[1200px] mx-auto w-full">
        {/* Hero Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-3 py-1 rounded-sm mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Mission Select</span>
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-widest font-display mb-4 uppercase">
            SELECT <span className="text-primary italic">MISSION</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-normal leading-normal">
            Choose your crisis scenario, select difficulty, and engage. Every mission has a 3-minute timer. Every choice matters.
          </p>
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <div
              key={scenario.id}
              data-testid={`scenario-card-${scenario.id}`}
              className="group flex flex-col metal-panel rounded-sm overflow-hidden neon-border p-6 relative cursor-pointer"
              onClick={() => navigate(`/scenarios/${scenario.id}/setup`, { state: { language } })}
            >
              {/* Difficulty badges */}
              <div className="absolute top-3 right-3 z-10 flex gap-1">
                {scenario.difficulty_levels.map((level) => (
                  <React.Fragment key={level}>
                    {getDifficultyBadge(level)}
                  </React.Fragment>
                ))}
              </div>

              {/* Icon Area */}
              <div className="w-full aspect-square flex items-center justify-center mb-5 bg-background/40 rounded-sm pixel-bg border border-gunmetal/40 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                <span
                  className="material-symbols-outlined text-primary transition-transform group-hover:scale-110 relative z-10"
                  style={{ fontSize: '72px', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
                >
                  {scenarioIcons[index] || 'bolt'}
                </span>
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-secondary/40"></div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 mb-5">
                <h3 className="text-white text-xl font-bold uppercase font-display tracking-wider">{scenario.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{scenario.description}</p>
              </div>

              {/* CTA Button */}
              <button
                data-testid={`launch-btn-${scenario.id}`}
                className="w-full h-11 rounded-sm btn-ironfang font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 text-white transition-all"
              >
                Deploy <span className="material-symbols-outlined text-xs">bolt</span>
              </button>
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="hidden lg:flex flex-col bg-background/20 rounded-sm overflow-hidden border border-dashed border-gunmetal/40 p-6 items-center justify-center text-center opacity-40">
            <span className="material-symbols-outlined text-gunmetal mb-4" style={{ fontSize: '48px' }}>add_circle</span>
            <h3 className="text-muted-foreground text-lg font-bold uppercase font-display tracking-widest">New Mission</h3>
            <p className="text-muted-foreground text-xs italic mt-1">Coming soon...</p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 flex flex-col gap-6 px-10 py-12 text-center bg-background border-t border-gunmetal/40">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <button type="button" className="text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" onClick={() => toast.info('Intel: coming soon')}>Intel</button>
          <button type="button" className="text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" onClick={() => toast.info('Twitter: coming soon')}>Twitter</button>
          <button type="button" className="text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" onClick={() => toast.info('Discord: coming soon')}>Discord</button>
          <button type="button" className="text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" onClick={() => toast.info('Docs: coming soon')}>Docs</button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="h-px w-16 bg-primary/30"></div>
          <p className="text-gunmetal text-xs font-bold uppercase tracking-wider">© 2026 IRONFANG AI. NO FINANCIAL ADVICE. JUST COMBAT.</p>
        </div>
      </footer>
    </div>
  );
};

export default Scenarios;
