import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CustomerOnboarding } from './components/CustomerOnboarding';
import { initializeDatabase } from './db/indexedDb';
import type { Language } from './types';
import './styles/main.css';

function Presentation() {
  const [lang, setLang] = useState<Language>(() => {
    const value = localStorage.getItem('isa_language');
    return value === 'de' || value === 'ru' || value === 'bilingual' ? value : 'ru';
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    initializeDatabase().then(() => setReady(true)).catch(() => setError(true));
  }, []);
  const setLanguage = (value: Language) => {
    localStorage.setItem('isa_language', value);
    setLang(value);
  };
  if (error) return <main role="alert" className="p-8 text-white">Browser-Speicher nicht verfügbar.</main>;
  if (!ready) return <main role="status" className="p-8 text-white">ProRiv wird geladen …</main>;
  return <CustomerOnboarding language={lang} onLanguageChange={setLanguage}
    onExit={() => {}} onOpenSenior={() => {}} standalone />;
}
createRoot(document.getElementById('root')!).render(<Presentation />);
