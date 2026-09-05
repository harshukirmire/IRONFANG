import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@clerk/react';
import AuthControls from '@/components/AuthControls';
import { toast } from 'sonner';

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [showLangPopup, setShowLangPopup] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const comingSoon = (label) => toast.info(`${label}: coming soon`);
  const displayName =
    user?.firstName || user?.primaryEmailAddress?.emailAddress || 'Operative';

  const handleStart = () => {
    if (!isLoaded || !isSignedIn) {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 3000);
      return;
    }
    setShowLangPopup(true);
  };

  const selectLanguage = (lang) => {
    setShowLangPopup(false);
    navigate('/scenarios', { state: { language: lang } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-background">

      {/* ── Atmospheric Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-60"></div>
        {/* Noise */}
        <div className="absolute inset-0 noise-bg"></div>
        {/* Crimson ambient glow — top left */}
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/12 blur-[140px] rounded-full"></div>
        {/* Purple ambient glow — bottom right */}
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-secondary/10 blur-[130px] rounded-full"></div>
        {/* Center deep red */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full"></div>
        {/* Vignette */}
        <div className="absolute inset-0 vignette"></div>
        {/* Scan line */}
        <div className="absolute inset-0 scan-overlay overflow-hidden opacity-40"></div>
      </div>

      {/* ══════════════════════════════════════
          HEADER / NAV
      ══════════════════════════════════════ */}
      <header className="w-full max-w-6xl px-6 py-6 relative z-10">
        <nav className="flex items-center justify-between glass-effect px-6 py-3 rounded-sm border border-gunmetal/80">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-deep-crimson to-bright-crimson flex items-center justify-center shadow-crimson group-hover:scale-110 transition-transform border border-primary/30 rounded-sm">
              {/* Fang icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L8 8L4 20L12 16L20 20L16 8L12 2Z" fill="currentColor" opacity="0.9"/>
                <path d="M12 6L9.5 11L8 18L12 15.5L16 18L14.5 11L12 6Z" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-widest text-primary font-display uppercase">IRONFANG</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            <button type="button" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors" onClick={() => navigate('/')}>Home</button>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/how-it-works')}>Intel</span>
            <button type="button" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors" onClick={() => comingSoon('Arena')}>Arena</button>
          </div>

          <AuthControls variant="landing" />
        </nav>
      </header>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <main className="w-full max-w-6xl px-6 flex flex-col items-center text-center pt-12 md:pt-20 relative z-10">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Combat System — Online</span>
        </div>

        {/* Main Title */}
        <div className="relative mb-6">
          <h1
            className="text-8xl md:text-[10rem] font-black tracking-[0.05em] uppercase glitch-text font-display leading-none"
            data-text="IRONFANG"
            data-testid="landing-title"
          >
            IRONFANG
          </h1>
          {/* Decorative corner tag */}
          <div className="absolute -top-3 -right-2 md:-top-4 md:-right-4 rotate-3 bg-primary text-white px-3 py-0.5 font-black rounded-sm text-xs md:text-sm shadow-crimson uppercase tracking-widest">
            AI COMBAT
          </div>
        </div>

        {/* Sub-title */}
        <p className="text-base md:text-xl max-w-2xl text-muted-foreground font-medium mb-3 leading-relaxed">
          A sentient street-level operative with <span className="text-primary font-bold">iron-clad opinions</span>.{' '}
          Talk them down before they make their next dramatic move.
        </p>
        <p className="text-xs text-secondary/70 uppercase tracking-widest mb-12 font-bold">Dark · Futuristic · Bilingual</p>

        {/* Auth Status Cards */}
        {!isSignedIn && (
          <div className="metal-panel rounded-sm p-4 max-w-xl mx-auto mb-8 border border-primary/20">
            <p className="font-display text-xs text-primary uppercase tracking-[0.2em]">
              ⚡ Authentication Required — Access Denied
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in or Sign up to enter the IRONFANG arena
            </p>
          </div>
        )}

        {isSignedIn && (
          <div className="metal-panel rounded-sm border border-secondary/20 p-4 max-w-xl mx-auto mb-8">
            <p className="font-display text-xs text-secondary uppercase tracking-[0.2em]">
              ✓ Identity Verified — Access Granted
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Operative: {displayName} · Ready for combat
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full justify-center">
          <div className="relative">
            <Button
              data-testid="start-interrogation-btn"
              onClick={handleStart}
              className={`btn-ironfang text-base font-bold px-12 py-6 rounded-sm tracking-widest uppercase transition-all ${
                isSignedIn
                  ? 'opacity-100 cursor-pointer'
                  : 'opacity-60 cursor-not-allowed bg-gunmetal border-gunmetal shadow-none hover:shadow-none'
              }`}
              style={isSignedIn ? {} : { background: '#2A2F3A', boxShadow: 'none' }}
            >
              {isSignedIn ? '⚔ ENTER ARENA' : '🔒 SIGN IN TO PLAY'}
            </Button>

            {showAuthWarning && (
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <p className="font-display text-xs text-primary uppercase tracking-widest animate-bounce">
                  ⚠ AUTHENTICATION REQUIRED ⚠
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/how-it-works')}
            data-testid="how-it-works-btn"
            className="glass-effect text-base font-bold px-10 py-5 rounded-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-gunmetal/60 uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <span className="material-symbols-outlined text-sm">info</span>
            INTEL
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-32">
          {/* Card 1 */}
          <div className="metal-panel p-6 rounded-sm flex flex-col items-start gap-3 hover:border-primary/40 transition-colors group corner-accent border border-gunmetal/60">
            <div className="w-10 h-10 rounded-sm bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-sm">shield</span>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-1">Target Status</p>
              <h3 className="text-2xl font-black font-display tracking-wider">UNHINGED</h3>
              <p className="text-primary text-xs font-medium mt-1">Threat level: Critical</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="metal-panel p-6 rounded-sm flex flex-col items-start gap-3 hover:border-secondary/40 transition-colors group corner-accent border border-gunmetal/60">
            <div className="w-10 h-10 rounded-sm bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/20">
              <span className="material-symbols-outlined text-sm">psychology</span>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-1">Combat Mode</p>
              <h3 className="text-2xl font-black font-display tracking-wider">FURIOUS</h3>
              <p className="text-secondary text-xs font-medium mt-1">Requires de-escalation</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="metal-panel p-6 rounded-sm flex flex-col items-start gap-3 hover:border-primary/40 transition-colors group corner-accent border border-gunmetal/60">
            <div className="w-10 h-10 rounded-sm bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-1">Active Missions</p>
              <h3 className="text-2xl font-black font-display tracking-wider">8 CRISES</h3>
              <p className="text-primary text-xs font-medium mt-1">All from real life</p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="w-full text-left mb-32">
          <h2 className="text-4xl font-black mb-2 tracking-widest font-display uppercase text-foreground">
            MISSION <span className="text-primary">BRIEFING</span>
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent mb-12"></div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <div className="text-7xl font-black text-primary/8 font-display">01</div>
              <h4 className="text-xl font-bold flex items-center gap-3 font-display uppercase tracking-widest">
                <span className="material-symbols-outlined text-primary text-base">login</span>
                AUTHENTICATE
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Clerk Sign In / Sign Up. One click. No staking. No crypto. Just proof you are who you say you are.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-7xl font-black text-primary/8 font-display">02</div>
              <h4 className="text-xl font-bold flex items-center gap-3 font-display uppercase tracking-widest">
                <span className="material-symbols-outlined text-primary text-base">forum</span>
                ENGAGE (3 MIN)
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You have 3 minutes to convince IRONFANG to stand down. Hinglish or English — your call, operative.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-7xl font-black text-primary/8 font-display">03</div>
              <h4 className="text-xl font-bold flex items-center gap-3 font-display uppercase tracking-widest">
                <span className="material-symbols-outlined text-primary text-base">emoji_events</span>
                WIN OR FALL
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Convince them = mission complete. Fail = IRONFANG roasts you in fluent Hinglish. Either way, legendary content.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <div className="w-full rounded-sm p-12 mb-32 relative overflow-hidden flex flex-col items-center justify-center text-center border border-primary/30"
          style={{ background: 'linear-gradient(135deg, #8B1E2D 0%, #E63946 60%, #8B5CF6 100%)' }}>
          {/* Noise overlay */}
          <div className="absolute inset-0 noise-bg opacity-30"></div>
          <div className="absolute inset-0 grid-bg opacity-20"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-widest italic relative z-10 font-display uppercase">
            READY FOR COMBAT?
          </h2>
          <p className="text-white/80 text-sm mb-10 max-w-xl relative z-10 uppercase tracking-wider">
            IRONFANG is waiting with their latest dramatic move. 3 minutes on the clock.
          </p>
          <button
            onClick={handleStart}
            data-testid="enter-arena-btn"
            className="bg-white text-primary px-12 py-5 rounded-sm font-black text-xl hover:bg-foreground hover:text-background transition-all shadow-2xl active:scale-95 relative z-10 uppercase tracking-widest"
          >
            ⚔ ENTER THE ARENA
          </button>
        </div>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="w-full border-t border-gunmetal/60 py-10 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-widest text-primary font-display">IRONFANG</span>
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">© 2026 DARK COMBAT AI</span>
          </div>
          <div className="flex items-center gap-2 text-secondary text-xs font-black bg-secondary/10 px-3 py-1 rounded-sm uppercase border border-secondary/20">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
            Systems Online
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          LANGUAGE POPUP
      ══════════════════════════════════════ */}
      {showLangPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full mx-4">
            <button
              onClick={() => setShowLangPopup(false)}
              data-testid="lang-close-btn"
              className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-white font-bold text-sm flex items-center justify-center rounded-sm border border-primary/50 hover:bg-deep-crimson z-10 transition-colors"
            >
              ✕
            </button>

            <div className="metal-panel border border-primary/30 rounded-sm p-8 space-y-6 shadow-crimson-lg">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-primary/15 border border-primary/30 rounded-sm flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                    <path d="M12 2L8 8L4 20L12 16L20 20L16 8L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-black uppercase text-foreground tracking-widest">
                  SELECT <span className="text-primary">DIALECT</span>
                </h2>
                <p className="text-xs text-muted-foreground font-display uppercase tracking-[0.2em]">
                  IRONFANG speaks both. Choose your channel.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  data-testid="lang-en"
                  onClick={() => selectLanguage('en')}
                  className="bg-background/60 border border-gunmetal hover:border-primary rounded-sm p-5 transition-all group cursor-pointer text-left hover:shadow-crimson"
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl group-hover:scale-110 transition-transform">🇺🇸</div>
                    <div className="font-display text-sm font-bold uppercase text-primary tracking-widest">
                      ENGLISH
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Street-smart operative, English channel. Hard mode energy.
                    </p>
                  </div>
                </button>

                <button
                  data-testid="lang-hi"
                  onClick={() => selectLanguage('hi')}
                  className="bg-background/60 border border-gunmetal hover:border-secondary rounded-sm p-5 transition-all group cursor-pointer text-left hover:shadow-purple"
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl group-hover:scale-110 transition-transform">🇮🇳</div>
                    <div className="font-display text-sm font-bold uppercase text-secondary tracking-widest">
                      HINGLISH
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full desi mode. Yaar, bhai, abey — pura package.
                    </p>
                  </div>
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground font-display uppercase tracking-[0.2em]">
                ⚡ IRONFANG WILL RESPOND IN YOUR CHOSEN CHANNEL ⚡
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
