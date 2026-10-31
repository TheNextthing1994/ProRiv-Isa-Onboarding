/**
 * Standalone entry point for Isa's customer onboarding.
 * Reuses the canonical CustomerOnboarding component and same-origin IndexedDB.
 * The research/workshop App is deliberately not imported.
 */
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CustomerOnboarding } from './components/CustomerOnboarding';
import { initializeDatabase } from './db/indexedDb';
import type { Language } from './types';
import './index.css';

function getInitialLanguage(): Language {
  const saved = localStorage.getItem('isa_language');
  return saved === 'de' || saved === 'ru' || saved === 'bilingual' ? saved : 'ru';
}

function StandaloneOnboarding() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let mounted = true;
    initializeDatabase()
      .then(() => { if (mounted) setStatus('ready'); })
      .catch(error => {
        console.error('Cannot initialize standalone ProRiv onboarding', error);
        if (mounted) setStatus('error');
      });
    return () => { mounted = false; };
  }, []);

  const handleLanguageChange = (next: Language) => {
    localStorage.setItem('isa_language', next);
    setLanguage(next);
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-[#101928] text-slate-100 flex items-center justify-center px-6">
        <p role="status" className="text-sm text-slate-300">
          {language === 'ru' ? 'Загрузка презентации ProRiv…' : 'ProRiv-Präsentation wird geladen…'}
        </p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen bg-[#101928] text-slate-100 flex items-center justify-center px-6">
        <div role="alert" className="max-w-lg rounded-2xl border border-rose-400/40 bg-slate-900 p-7">
          <h1 className="text-lg font-semibold">{language === 'ru' ? 'Не удалось открыть презентацию' : 'Präsentation konnte nicht geladen werden'}</h1>
          <p className="mt-2 text-sm text-slate-300">{language === 'ru'
            ? 'Проверьте хранилище браузера и перезагрузите страницу. Данные не были перезаписаны.'
            : 'Bitte Browser-Speicher prüfen und Seite neu laden. Vorhandene Notizen wurden nicht überschrieben.'}</p>
          <button className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm" onClick={() => window.location.reload()}>
            {language === 'ru' ? 'Повторить' : 'Neu laden'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <CustomerOnboarding
      language={language}
      onLanguageChange={handleLanguageChange}
      onExit={() => {}}
      onOpenSenior={() => {}}
      standalone
    />
  );
}

createRoot(document.getElementById('root')!).render(<StandaloneOnboarding />);
