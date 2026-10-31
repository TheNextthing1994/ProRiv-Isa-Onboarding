import React from 'react';
import { Send, Smartphone, CheckCheck, ExternalLink, BellRing } from 'lucide-react';
import type { Language } from '../types';

interface TelegramProjectChannelProps {
  language: Language;
}

export function TelegramProjectChannel({ language }: TelegramProjectChannelProps) {
  const ru = language === 'ru';
  const bilingual = language === 'bilingual';

  const t = (de: string, russian: string) => (ru ? russian : de);
  const dual = (de: string, russian: string) => (
    <>
      {ru ? russian : de}
      {bilingual && (
        <span className="block text-[0.82em] font-normal opacity-75 mt-0.5">{russian}</span>
      )}
    </>
  );

  return (
    <section
      className="space-y-6 rounded-3xl border border-white/[0.18] bg-[#161F2C]/75 backdrop-blur-xl shadow-2xl p-5 md:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]"
      data-testid="onboarding-telegram-channel"
    >
      {/* Header Banner - Luminous Glass with Telegram Accent */}
      <div className="relative overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-gradient-to-r from-[#16273B]/90 via-[#1C334E]/90 to-[#16283C]/90 p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.25)]">
        {/* Subtle Ambient Light Glow */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#2AABEE]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#2AABEE]/20 border border-[#2AABEE]/45 text-[#38BDF8] flex items-center justify-center shrink-0 shadow-lg shadow-[#2AABEE]/10">
              <Send className="w-6 h-6 rotate-12" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {dual(
                  'Telegram – Unser Hauptkanal für den direkten Austausch',
                  'Telegram — наш основной канал для оперативной связи'
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Core Advantage Card */}
      <div>
        <div className="rounded-2xl border border-white/[0.16] bg-[#141C26]/80 p-4.5 space-y-2.5 shadow-sm hover:border-white/35 transition-all">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">
            {dual('Screenshots & Preview-Links', 'Скриншоты и ссылки Preview')}
          </h4>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            {dual(
              'Sobald eine Funktion intern geprüft ist und für Isa in der Release Preview bereitsteht, schicken wir den direkten Link und Screenshots in den Chat.',
              'Как только функция проверена и готова в Release Preview, отправляем прямую ссылку и скриншоты в чат.'
            )}
          </p>
        </div>
      </div>

      {/* Realistic Exemplary Telegram Chat Preview */}
      <div className="rounded-2xl border border-white/[0.16] bg-[#121924]/85 p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2AABEE]/20 border border-[#2AABEE]/40 text-[#38BDF8] flex items-center justify-center">
              <BellRing className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">
              {t('Beispiel: So läuft die Abstimmung über Telegram', 'Пример: как проходит согласование в Telegram')}
            </span>
          </div>
          <span className="text-[11px] text-[#CBD5E1] font-mono">
            {t('Gruppe „ProRiv Isa & Devs“', 'Группа «ProRiv Isa & Devs»')}
          </span>
        </div>

        <div className="space-y-2.5 max-w-2xl mx-auto py-1">
          {/* Message 1: Isa */}
          <div className="flex justify-start">
            <div className="max-w-md rounded-2xl rounded-tl-sm bg-[#1E2938] border border-white/15 p-3 text-xs text-white shadow-sm space-y-1">
              <span className="block text-[10px] font-bold text-[#E8C9A2]">Isa</span>
              <p className="leading-relaxed">
                {t(
                  'Hallo Hasin, wie sieht der aktuelle Stand bei der Rapport-Erfassung aus?',
                  'Хьасин, привет! Как продвигается рапорт со стройплощадки?'
                )}
              </p>
              <span className="block text-[10px] text-[#CBD5E1] text-right font-mono">10:14</span>
            </div>
          </div>

          {/* Message 2: Hasin */}
          <div className="flex justify-end">
            <div className="max-w-md rounded-2xl rounded-tr-sm bg-[#22405E]/90 border border-[#38BDF8]/35 p-3 text-xs text-white shadow-sm space-y-1">
              <span className="block text-[10px] font-bold text-[#38BDF8]">Hasin (Architektur & Dev)</span>
              <p className="leading-relaxed">
                {t(
                  'Moin Isa! Wir haben die interne Prüfung für die Einzelerfassung abgeschlossen. Die Release Preview ist aktualisiert – Schamil kann den Ablauf jetzt testen.',
                  'Привет, Иса! Внутренняя проверка завершена, Release Preview обновлена. Шамиль может проверять.'
                )}
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-[#93C5FD] font-mono">
                <span>10:18</span>
                <CheckCheck className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Message 3: Ismail */}
          <div className="flex justify-end">
            <div className="max-w-md rounded-2xl rounded-tr-sm bg-[#22405E]/90 border border-[#38BDF8]/35 p-3 text-xs text-white shadow-sm space-y-1">
              <span className="block text-[10px] font-bold text-[#38BDF8]">Ismail (UI & Frontend)</span>
              <p className="leading-relaxed">
                {t(
                  'Hier ist auch der direkte Link zur mobilen Maske. Rückfragen klären wir direkt hier im Chat.',
                  'Вот прямая ссылка на мобильный интерфейс. Все вопросы обсуждаем прямо здесь в чате.'
                )}
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-[#93C5FD] font-mono">
                <span>10:20</span>
                <CheckCheck className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#CBD5E1]">
          <span>
            {t(
              'Persönlicher Austausch von Mensch zu Mensch. Keine unzuverlässigen Bots.',
              'Личный контакт напрямую с разработчиками. Без ненадежных ботов.'
            )}
          </span>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="telegram-channel-link"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white px-4 py-2 font-bold text-xs shadow-md transition-all border border-white/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('Telegram-Projektgruppe öffnen', 'Открыть группу в Telegram')}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>
    </section>
  );
}
