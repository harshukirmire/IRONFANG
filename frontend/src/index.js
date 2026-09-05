import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import "@/index.css";
import App from "@/App";

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));

if (!PUBLISHABLE_KEY) {
  root.render(
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0E0E10', color: '#fff', fontFamily: 'sans-serif', padding: 24, textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>Clerk publishable key missing</h1>
        <p style={{ color: '#888899', maxWidth: 480 }}>
          Add <code>REACT_APP_CLERK_PUBLISHABLE_KEY</code> to <code>frontend/.env</code> and restart the frontend dev server.
        </p>
      </div>
    </div>,
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>,
  );
}
