import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Landing from './pages/Landing';
import Scenarios from './pages/Scenarios';
import Setup from './pages/Setup';
import Intro from './pages/Intro';
import Chat from './pages/Chat';
import HowItWorks from './pages/HowItWorks';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-background noise-bg">
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/scenarios/:id/setup" element={<Setup />} />
          <Route path="/scenarios/:id/intro" element={<Intro />} />
          <Route path="/scenarios/:id/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
