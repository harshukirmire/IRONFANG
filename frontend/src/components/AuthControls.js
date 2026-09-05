import React from 'react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

const AuthControls = ({ variant = 'nav' }) => {
  const isLanding = variant === 'landing';

  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            data-testid="clerk-signin-btn"
            className={
              isLanding
                ? 'btn-ironfang text-white px-5 py-2 rounded-sm font-bold text-xs transition-all uppercase tracking-widest shadow-crimson border-0'
                : 'btn-ironfang text-white px-4 py-2 rounded-sm font-bold text-xs transition-all uppercase tracking-widest border-0'
            }
          >
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            data-testid="clerk-signup-btn"
            className="glass-effect hover:bg-white/8 text-muted-foreground hover:text-foreground px-4 py-2 rounded-sm font-bold text-xs transition-all uppercase tracking-widest border border-gunmetal/60"
          >
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton afterSignOutUrl="/" />
      </Show>
    </div>
  );
};

export default AuthControls;
