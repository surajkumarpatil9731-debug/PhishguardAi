
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from './types';
import { analyzeContent } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (inputText: string) => {
    if (!inputText.trim()) {
      setError("Please enter some content to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await analyzeContent(inputText);
      // Basic validation
      if (!Object.values(RiskLevel).includes(result.riskLevel)) {
        throw new Error("Received an invalid risk level from the AI.");
      }
      if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
        throw new Error("Received an invalid score from the AI.");
      }

      setCurrentResult(result);
      setAnalysisHistory(prev => [...prev, result]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <Header />
        <main>
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          
          {currentResult && (
            <div className="mt-8 animate-fade-in">
              <ResultDisplay result={currentResult} />
            </div>
          )}

          {analysisHistory.length > 0 && (
            <div className="mt-12 animate-fade-in">
              <Dashboard analysisHistory={analysisHistory} />
            </div>
          )}
        </main>
      </div>
       <footer className="w-full max-w-4xl mt-12 text-center text-slate-500 text-sm">
          <p>PhishGuard AI - Your First Line of Defense Against Phishing</p>
          <p className="mt-1">Powered by Google Gemini</p>
        </footer>
    </div>
  );
};

export default App;
