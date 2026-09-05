import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthControls from '@/components/AuthControls';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      icon: 'login',
      title: 'AUTHENTICATE',
      description: 'One click, you are in. Clerk handles authentication — Sign In or Sign Up. No crypto, no staking. Just your identity clearance.',
      color: 'text-primary',
      bgColor: 'bg-primary/15',
      borderColor: 'border-primary/25',
    },
    {
      number: '02',
      icon: 'sports_esports',
      title: 'CHOOSE MISSION',
      description: '8 real-life crisis scenarios — exams, relatives, chai drama, group projects, broken phones. Each has its own threat level.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/15',
      borderColor: 'border-secondary/25',
    },
    {
      number: '03',
      icon: 'forum',
      title: 'ENGAGE (3 MIN)',
      description: "You have 3 minutes to convince IRONFANG to stand down. Hinglish or English — their response matches your channel.",
      color: 'text-accent',
      bgColor: 'bg-accent/15',
      borderColor: 'border-accent/25',
    },
    {
      number: '04',
      icon: 'emoji_events',
      title: 'WIN OR FALL',
      description: "Convince IRONFANG = mission success and bragging rights. Fail = they roast you in fluent desi Hinglish. Either way, legendary content.",
      color: 'text-primary',
      bgColor: 'bg-primary/15',
      borderColor: 'border-primary/25',
    },
  ];

  const features = [
    { icon: 'psychology', title: 'GEMINI AI BRAIN', description: "IRONFANG runs on Google Gemini — fast, dangerous, and unpredictable. Smart fallback responses when the API rests." },
    { icon: 'language', title: 'DUAL CHANNEL', description: "Operate in English or Hinglish. Full desi combat energy on both channels." },
    { icon: 'timer', title: '3-MINUTE MISSIONS', description: "Every session is a tight 3-minute sprint. No grinding. Pure high-stakes engagement." },
    { icon: 'sentiment_very_dissatisfied', title: 'DYNAMIC MOOD INTEL', description: "IRONFANG's mood shifts: FURIOUS → CONSIDERING → SAD → CONVINCED. Your words are your weapons." },
    { icon: 'theater_comedy', title: '8 LIVE CRISES', description: "Exam panic, rishtedar dread, bestie drama, bad chai, extreme diets — all scenarios from real life." },
    { icon: 'volunteer_activism', title: 'TACTICAL HINTS', description: "Stuck on mission? A Helper AI drops tactical hints every 3 turns to guide your strategy." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 grid-bg opacity-50"></div>
        <div className="absolute inset-0 noise-bg"></div>
        <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[40%] h-[40%] bg-secondary/8 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>

      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-gunmetal/60 px-6 md:px-20 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-br from-deep-crimson to-bright-crimson flex items-center justify-center border border-primary/30 rounded-sm group-hover:scale-110 transition-transform shadow-crimson">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L8 8L4 20L12 16L20 20L16 8L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-base font-bold tracking-widest text-primary font-display uppercase">IRONFANG</span>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate('/')} className="glass-effect px-5 py-2 rounded-sm text-xs font-bold hover:bg-white/5 transition-colors uppercase tracking-widest text-muted-foreground border border-gunmetal/60">Home</button>
          <button onClick={() => navigate('/')} className="btn-ironfang text-white px-5 py-2 rounded-sm font-bold text-xs transition-all uppercase tracking-widest">Play Now</button>
          <AuthControls />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 px-6 md:px-20 py-16 md:py-20 max-w-6xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-sm mb-8">
          <span className="material-symbols-outlined text-sm">school</span>
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Mission Intel</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase font-display mb-6 glitch-text text-foreground" data-text="HOW IT WORKS">
          HOW IT WORKS
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Authenticate. Pick a crisis. Talk IRONFANG down.{' '}
          <span className="text-primary font-bold">No stakes. Just combat and chaos.</span>
        </p>
      </section>

      {/* ── Steps ── */}
      <section className="relative z-10 px-6 md:px-20 max-w-6xl mx-auto w-full mb-24">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col md:flex-row items-start gap-8 p-8 rounded-sm metal-panel border border-gunmetal/60 hover:border-primary/30 transition-all group ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="shrink-0">
                <div className="text-7xl md:text-8xl font-black text-primary/8 leading-none group-hover:text-primary/15 transition-colors font-display">{step.number}</div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-sm ${step.bgColor} border ${step.borderColor} flex items-center justify-center ${step.color}`}>
                    <span className="material-symbols-outlined text-sm">{step.icon}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase font-display tracking-widest">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 px-6 md:px-20 max-w-6xl mx-auto w-full mb-24">
        <h2 className="text-3xl md:text-4xl font-black tracking-widest font-display mb-2 text-center uppercase">
          COMBAT <span className="text-primary italic">CAPABILITIES</span>
        </h2>
        <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent mb-12 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div key={index} className="metal-panel border border-gunmetal/60 p-6 rounded-sm hover:border-primary/30 transition-all group corner-accent">
              <div className="w-10 h-10 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">{feature.icon}</span>
              </div>
              <h4 className="text-sm font-bold uppercase font-display mb-2 tracking-widest">{feature.title}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 px-6 md:px-20 max-w-6xl mx-auto w-full mb-24">
        <div className="rounded-sm p-12 relative overflow-hidden text-center border border-primary/30"
          style={{ background: 'linear-gradient(135deg, #8B1E2D 0%, #E63946 55%, #8B5CF6 100%)' }}>
          <div className="absolute inset-0 noise-bg opacity-30"></div>
          <div className="absolute inset-0 grid-bg opacity-20"></div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest italic relative z-10 mb-6 font-display uppercase">READY, OPERATIVE?</h2>
          <p className="text-white/80 text-sm mb-10 max-w-xl mx-auto relative z-10 uppercase tracking-wider">
            IRONFANG is waiting with their latest dramatic crisis. 3 minutes on the clock.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-primary px-12 py-5 rounded-sm font-black text-lg hover:bg-foreground hover:text-background transition-all shadow-2xl active:scale-95 relative z-10 uppercase tracking-widest"
          >
            ⚔ ENTER THE ARENA
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-gunmetal/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-black tracking-widest text-primary font-display uppercase">IRONFANG</span>
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Dark Combat AI</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Just vibes. No financial advice. No blockchain. Just chaos and chai.
          </p>
          <div className="flex items-center gap-2 text-secondary text-xs font-black bg-secondary/10 px-3 py-1 rounded-sm uppercase border border-secondary/20">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
            Systems Online
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
