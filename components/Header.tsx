
import React from 'react';
import ShieldIcon from './icons/ShieldIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-4">
        <ShieldIcon className="w-12 h-12 text-cyan-400" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          PhishGuard AI
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">
        Analyze URLs, emails, and messages to detect phishing threats in real-time.
      </p>
    </header>
  );
};

export default Header;
