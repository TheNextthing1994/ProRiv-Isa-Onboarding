import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Globe2,
  Info,
  LockKeyhole,
  MessageCircle,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound
} from 'lucide-react';
import type { Language } from '../types';

const HUB_URL = 'https://gen-lang-client-0888260919.web.app/';

type View = 'client' | 'developer';
type Area = 'overview' | 'chat' | 'tests' | 'decisions' | 'access' | 'internal';

interface AreaDescription {
  id: Area;
  icon: React.ElementType;
  accent: string;
  badgeDe: string;
  badgeRu: string;
  badgeColor: string;
  titleDe: string;
  titleRu: string;
  subtitleDe: string;
  subtitleRu: string;
  clientDetailDe: string;
  clientDetailRu: string;
  devDetailDe: string;
  devDetailRu: string;
}

const areas: AreaDescription[] = [
  {
    id: 'overview',
    icon: Monitor,
    accent: 'from-sky-500 to-blue-600',
    badgeDe: 'Dashboard',
    badgeRu: 'Обзор',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    titleDe: 'Projektübersicht',
    titleRu: 'Обзор проекта',
    subtitleDe: 'Zentrale Steuerzentrale & Status',
    subtitleRu: 'Центральная панель и статус',
    clientDetailDe: 'Isa sieht aktuelle Testaufgaben, offene Entscheidungen und einen Release-Preview-Link nur dann, wenn er tatsächlich vom Admin eingetragen wurde.',
    clientDetailRu: 'Иса видит задания на тестирование, открытые решения и ссылку на Preview только после её публикации администратором.',
    devDetailDe: 'Entwickler sehen dieselben kundenseitigen Aufgaben und Entscheidungen. Interne Entwicklungsaufgaben bleiben separat.',
    devDetailRu: 'Разработчики видят те же клиентские задачи и решения; внутренние задачи остаются отдельно.'
  },
  {
    id: 'chat',
    icon: MessageSquare,
    accent: 'from-cyan-500 to-teal-600',
    badgeDe: 'Kommunikation',
    badgeRu: 'Общение',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    titleDe: 'Projekt-Chat',
    titleRu: 'Чат проекта',
    subtitleDe: 'Direkter Kanal zwischen Isa & Team',
    subtitleRu: 'Прямой канал связи с командой',
    clientDetailDe: 'Isa schreibt eine Nachricht an das Projektteam. Alle berechtigten Teilnehmer sehen die Nachricht in Echtzeit.',
    clientDetailRu: 'Иса пишет сообщение команде проекта. Допущенные участники видят его в реальном времени.',
    devDetailDe: 'Das Entwicklerteam kann im selben Chat antworten. Ein Bug gehört anschließend zur jeweiligen Testaufgabe, damit er nicht im Verlauf verschwindet.',
    devDetailRu: 'Команда разработчиков отвечает в общем чате. Ошибку затем связывают с заданием, чтобы она не потерялась.'
  },
  {
    id: 'tests',
    icon: ClipboardCheck,
    accent: 'from-violet-500 to-purple-600',
    badgeDe: 'Release Preview',
    badgeRu: 'Тестовая версия',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    titleDe: 'Testaufgaben & Feedback',
    titleRu: 'Задания и отзывы',
    subtitleDe: 'Strukturiertes Testen der App',
    subtitleRu: 'Тестирование функций приложения',
    clientDetailDe: 'Wenn eine App-Version später freigegeben ist, öffnet Isa eine konkrete Testaufgabe und schreibt seine Beobachtung direkt dazu. Heute ist noch keine App-Testversion bestätigt.',
    clientDetailRu: 'Когда будет выпущена тестовая версия приложения, Иса откроет задание и оставит отзыв прямо в нём. Сейчас подтверждённой версии пока нет.',
    devDetailDe: 'Entwickler veröffentlichen Testaufgaben, lesen zugeordnetes Feedback und ändern nach Prüfung den Aufgabenstatus. Kein erfundener Release-Link.',
    devDetailRu: 'Разработчики публикуют задания, читают привязанные отзывы и после проверки меняют статус. Никакой вымышленной ссылки на релиз.'
  },
  {
    id: 'decisions',
    icon: CheckCheck,
    accent: 'from-amber-500 to-orange-600',
    badgeDe: 'Abstimmung',
    badgeRu: 'Согласование',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    titleDe: 'Entscheidungen',
    titleRu: 'Решения',
    subtitleDe: 'Gemeinsam fixierte Beschlüsse',
    subtitleRu: 'Зафиксированные договоренности',
    clientDetailDe: 'Isa oder ein berechtigtes Mitglied seines Teams beantwortet eine offene Fachfrage verbindlich im Hub.',
    clientDetailRu: 'Иса или уполномоченный участник его команды отвечает на открытый вопрос в Hub.',
    devDetailDe: 'Das Entwicklerteam stellt klare fachliche Fragen. Die Kundenantwort bleibt an der Frage dokumentiert.',
    devDetailRu: 'Разработчики задают конкретные вопросы. Ответ заказчика остаётся привязан к вопросу.'
  },
  {
    id: 'access',
    icon: UsersRound,
    accent: 'from-emerald-500 to-teal-700',
    badgeDe: 'Admin-Prüfung',
    badgeRu: 'Проверка прав',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    titleDe: 'Einladung & Zugang',
    titleRu: 'Приглашение и доступ',
    subtitleDe: 'Passwortloser Login für Isa',
    subtitleRu: 'Вход без пароля для Исы',
    clientDetailDe: 'Hasin trägt Isas Namen, E-Mail und Kundenrolle im echten Hub ein. Isa erhält einen persönlichen passwortlosen Link, meldet sich selbst an und testet zunächst den Chat.',
    clientDetailRu: 'Хьасин вводит имя, почту и роль заказчика в настоящем Hub. Иса получает личную ссылку без пароля, входит сам и сначала проверяет чат.',
    devDetailDe: 'Nur der berechtigte Hauptadministrator verwaltet Einladungen. Live geprüft ist der Admin-Login; die echte erste Kundeneinladung muss noch abgenommen werden.',
    devDetailRu: 'Приглашениями управляет только уполномоченный главный администратор. Вход администратора проверен; первое приглашение заказчика ещё нужно испытать.'
  },
  {
    id: 'internal',
    icon: LockKeyhole,
    accent: 'from-rose-500 to-red-700',
    badgeDe: 'Geschützt',
    badgeRu: 'Закрыто',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    titleDe: 'Interner Entwicklerbereich',
    titleRu: 'Внутренний раздел',
    subtitleDe: 'Stunden & Team-Organisation',
    subtitleRu: 'Учёт времени и задачи',
    clientDetailDe: 'Dieser Bereich ist für Kunden nicht zugänglich. Interne Stunden und Entwicklungsaufgaben sind durch Datenbankregeln geschützt.',
    clientDetailRu: 'Клиенты не имеют доступа к этой области. Время и внутренние задачи защищены правилами базы данных.',
    devDetailDe: 'Hasin, Ismail und Amruddy nutzen hier ihre interne Aufgabenorganisation, Zeiterfassung und Rückfragen; diese Daten werden nicht automatisch an Isa veröffentlicht.',
    devDetailRu: 'Хьасин, Исмаил и Амрудди используют внутренние задачи, учёт времени и вопросы; эти данные не передаются Исе автоматически.'
  }
];

export function ProRivHubCenter({ language }: { language: Language }) {
  const [view, setView] = useState<View>('client');
  const [selected, setSelected] = useState<Area>('chat');

  const ru = language === 'ru';
  const bilingual = language === 'bilingual';

  // Dual language helper
  const dual = (de: React.ReactNode, russian: React.ReactNode) => {
    if (ru) return russian;
    if (bilingual) {
      return (
        <>
          <span>{de}</span>
          <span className="block text-[0.88em] opacity-75 font-normal mt-0.5">{russian}</span>
        </>
      );
    }
    return de;
  };

  const currentArea = areas.find((x) => x.id === selected) || areas[0];
  const isDevView = view === 'developer';

  // Visible cards based on active view
  const visibleCards = areas.filter(
    (area) => area.id !== 'internal' || isDevView
  );

  return (
    <section
      data-testid="onboarding-hub-center"
      className="rounded-3xl border border-white/[0.18] bg-[#161F2C]/75 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
    >
      {/* Cinematic Luminous Top Bar */}
      <div className="border-b border-white/[0.16] bg-gradient-to-r from-[#17202D] via-[#202B3C] to-[#17202D] px-5 py-4 sm:px-7 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#232E3E] text-white border border-white/20 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#E8C9A2]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  ProRiv Hub
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#263344] text-white border border-white/15">
                  <Globe2 className="w-3.5 h-3.5 text-[#CBD5E1]" />
                  {dual('Firebase Hosting (PR #2)', 'Firebase Hosting (PR #2 развёрнут)')}
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5">
                {dual(
                  'Zentraler Treffpunkt für Isa und das Projektteam',
                  'Единое пространство для Исы и команды проекта'
                )}
              </p>
            </div>
          </div>

          {/* Perspective Switcher (Explanation of Roles) */}
          <div className="flex items-center gap-1 bg-[#121924]/90 backdrop-blur-md p-1 rounded-2xl border border-white/18 shadow-inner">
            <span className="text-[11px] font-medium text-[#CBD5E1] px-2 hidden sm:inline">
              {dual('Rollenansicht:', 'Вид ролей:')}
            </span>
            <button
              type="button"
              aria-pressed={view === 'client'}
              onClick={() => {
                setView('client');
                if (selected === 'internal') setSelected('chat');
              }}
              className={
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-white/50 ' +
                (view === 'client'
                  ? 'bg-[#F1F0EE] text-[#10141A] shadow-md font-extrabold ring-1 ring-white/60'
                  : 'text-[#CBD5E1] hover:text-white')
              }
            >
              <UserCheck className="w-3.5 h-3.5" />
              {ru ? 'Заказчик' : 'Kunde'}
            </button>
            <button
              type="button"
              aria-pressed={view === 'developer'}
              onClick={() => setView('developer')}
              className={
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-white/50 ' +
                (view === 'developer'
                  ? 'bg-[#F1F0EE] text-[#10141A] shadow-md font-extrabold ring-1 ring-white/60'
                  : 'text-[#CBD5E1] hover:text-white')
              }
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {ru ? 'Разработчик' : 'Entwickler'}
            </button>
          </div>
        </div>

        {/* Responsible Team Strip in Header */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-[#CBD5E1] text-[11px] font-medium">
              {dual('Zuständiges Projektteam:', 'Ответственная команда:')}
            </span>
            <div className="flex items-center -space-x-2 overflow-hidden">
              <img
                src="/assets/aistudio/image_fef92dbe.png"
                alt="Hasin"
                title="Hasin"
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#10141A] object-cover"
              />
              <img
                src="/assets/aistudio/image_14e6391c.png"
                alt="Ismail"
                title="Ismail"
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#10141A] object-cover"
              />
              <div
                title="Amruddy"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3B485A] ring-2 ring-[#10141A] text-[10px] font-bold text-white"
              >
                A
              </div>
            </div>
            <span className="text-[11px] text-white font-semibold ml-1">
              {ru ? 'Хьасин, Исмаил, Амрудди' : bilingual ? 'Hasin, Ismail, Amruddy (Хьасин, Исмаил, Амрудди)' : 'Hasin, Ismail, Amruddy'}
            </span>
          </div>

          <div className="text-[11px] text-[#CBD5E1]">
            {view === 'client' ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {dual(
                  'Erklärung Kunden-Sicht: Zeigt nur freigegebene Aufgaben und Feedback für Isa',
                  'Вид заказчика: отображаются только задачи и отзывы для Исы'
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#E8C9A2]">
                <LockKeyhole className="w-3.5 h-3.5 shrink-0" />
                {dual(
                  'Erklärung Entwickler-Sicht: Zeigt zusätzlich den geschützten internen Bereich',
                  'Вид разработчика: показывает также закрытый внутренний раздел'
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Guided Stripe-Style Grid + Detail Cockpit */}
      <div className="p-5 sm:p-7 space-y-6 bg-[#121924]/50 backdrop-blur-sm">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-5 items-start">
          {/* Left Column: Stripe Card Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                {dual('Funktionen im ProRiv Hub', 'Функции ProRiv Hub')}
              </span>
              <span className="text-xs text-[#94A3B8] font-medium">
                {dual('Klick zur Erklärung & Vorschau', 'Нажмите для пояснения')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="hub-map">
              {visibleCards.map((item) => {
                const Icon = item.icon;
                const isSelected = selected === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={'hub-area-' + item.id}
                    aria-pressed={isSelected}
                    onClick={() => setSelected(item.id)}
                    className={
                      'group relative rounded-2xl border text-left p-4 transition-all duration-200 motion-reduce:transition-none flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-white/50 ' +
                      (isSelected
                        ? 'bg-[#2A374A]/95 border-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_12px_28px_rgba(0,0,0,0.35)] ring-2 ring-white/30 translate-y-[-2px] text-white'
                        : 'bg-[#161F2C]/75 border-white/[0.14] hover:border-white/35 hover:bg-[#202B3B]/85 text-[#E2E8F0]')
                    }
                  >
                    <div>
                      {/* Top row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className={
                            'w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 motion-reduce:transform-none border ' +
                            (isSelected
                              ? 'bg-[#F1F0EE] text-[#10141A] shadow-md border-transparent'
                              : 'bg-white/10 text-white border-white/15 group-hover:bg-white/15')
                          }
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border ' +
                            (isSelected
                              ? 'bg-[#F1F0EE] text-[#10141A] font-extrabold border-white/60 shadow-xs'
                              : 'bg-[#202B3A] text-[#CBD5E1] border-white/10')
                          }
                        >
                          {dual(item.badgeDe, item.badgeRu)}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className={'font-bold text-sm transition-colors ' + (isSelected ? 'text-white' : 'text-[#F1F5F9] group-hover:text-white')}>
                        {dual(item.titleDe, item.titleRu)}
                      </h4>
                      <p className={'text-xs mt-1 line-clamp-2 leading-relaxed ' + (isSelected ? 'text-slate-200' : 'text-[#94A3B8]')}>
                        {dual(item.subtitleDe, item.subtitleRu)}
                      </p>
                    </div>

                    {/* Bottom Indicator */}
                    <div className={'mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-medium transition-colors ' +
                      (isSelected ? 'border-white/20 text-white font-bold' : 'border-white/10 text-[#CBD5E1] group-hover:text-white')}>
                      <span>{isSelected ? dual('Ausgewählt', 'Выбрано') : dual('Details & Ablauf', 'Пояснение')}</span>
                      <ArrowRight
                        className={
                          'w-3.5 h-3.5 transition-transform motion-reduce:transform-none ' +
                          (isSelected
                            ? 'text-white translate-x-1'
                            : 'group-hover:translate-x-1')
                        }
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: High-Fidelity Detail & Preview Pane */}
          <div
            data-testid="hub-area-detail"
            className="rounded-2xl border border-white/[0.18] bg-[#182332]/85 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col justify-between text-white ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
          >
            {/* Smooth cross-fade container */}
            <div
              key={`${selected}-${view}`}
              className="transition-opacity duration-200 ease-out motion-reduce:transition-none"
            >
              {/* Header of Detail Pane */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#253243] border border-white/20 text-[#F1F0EE] shadow-sm">
                    {React.createElement(currentArea.icon, { className: 'w-5 h-5 text-[#F1F0EE]' })}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1]">
                      {dual('Funktionsmodul', 'Модуль системы')}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {dual(currentArea.titleDe, currentArea.titleRu)}
                    </h4>
                  </div>
                </div>

                <span
                  className={
                    'text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-[#222E3E] text-white border-white/15'
                  }
                >
                  {view === 'client'
                    ? dual('Rolle: Kunde', 'Роль: Заказчик')
                    : dual('Rolle: Entwickler', 'Роль: Разработчик')}
                </span>
              </div>

              {/* Explanatory Description */}
              <div className="py-4">
                <p className="text-sm text-slate-100 leading-relaxed font-normal">
                  {view === 'client'
                    ? dual(currentArea.clientDetailDe, currentArea.clientDetailRu)
                    : dual(currentArea.devDetailDe, currentArea.devDetailRu)}
                </p>
              </div>

              {/* Schematic Micro-Preview (Clearly labeled as schematic example) */}
              <div className="rounded-2xl border border-white/[0.16] bg-[#121924]/90 p-4 my-1 text-white">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1] mb-2.5">
                  <span className="flex items-center gap-1.5 text-white">
                    <Info className="w-3.5 h-3.5 text-[#E8C9A2]" />
                    {dual('Schematische Vorschau (Funktionsbeispiel)', 'Схематичный пример интерфейса')}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-normal lowercase">
                    {dual('nicht live', 'иллюстрация')}
                  </span>
                </div>

                {currentArea.id === 'chat' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#2E3C4E] text-white flex items-center justify-center text-[9px] font-bold">
                        I
                      </div>
                      <div className="bg-[#1C2635] border border-white/15 rounded-xl p-2.5 max-w-[85%] text-white shadow-sm">
                        <span className="font-semibold text-[#E8C9A2] block text-[11px]">
                          {dual('Isa (Kundenrolle · Beispiel):', 'Иса (роль заказчика · пример):')}
                        </span>
                        {dual(
                          'Hier können Rückfragen direkt im gemeinsamen Projekt-Chat ausgetauscht werden.',
                          'Здесь можно задавать вопросы и отвечать напрямую в общем чате проекта.'
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 justify-end">
                      <div className="bg-[#2B394D] border border-white/20 text-white rounded-xl p-2.5 max-w-[85%] shadow-sm">
                        <span className="font-semibold block text-[11px] text-[#F1F0EE]">
                          {dual('Hasin / Entwicklerteam (Beispiel):', 'Хьасин / команда (пример):')}
                        </span>
                        {dual(
                          'Das Entwicklerteam antwortet hier zeitnah und ordnet Fehler der passenden Testaufgabe zu.',
                          'Команда разработчиков оперативно отвечает и привязывает ошибки к задаче тестирования.'
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentArea.id === 'tests' && (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1C2635] border border-white/15">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                        <span className="font-medium text-white">
                          {dual('Musteraufgabe: Einzelrapport Arbeiter prüfen', 'Пример: Проверка рапорта работника')}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                        {dual('In Vorbereitung', 'В подготовке')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] italic px-1 pt-1 leading-relaxed">
                      {dual(
                        'Hinweis: Feedback wird direkt einer freigegebenen Testaufgabe zugeordnet, sobald die erste Version fertig ist.',
                        'Отзывы привязываются сразу к задаче, как только тестовая версия будет готова.'
                      )}
                    </p>
                  </div>
                )}

                {currentArea.id === 'decisions' && (
                  <div className="p-2.5 rounded-xl bg-[#1C2635] border border-white/15 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        {dual('Entscheidungspunkt (Muster): Zuständigkeit für Abnahmetests', 'Пример вопроса: Ответственные за тестирование')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1]">
                      {dual(
                        'Wird während des Termins gemeinsam besprochen und anschließend als verbindlicher Beschluss markiert.',
                        'Обсуждается на встрече и затем фиксируется как обязательное решение.'
                      )}
                    </p>
                  </div>
                )}

                {currentArea.id === 'access' && (
                  <div className="p-2.5 rounded-xl bg-[#1C2635] border border-white/15 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        {dual('Passwortloser Einladungslink', 'Личная ссылка для входа')}
                      </p>
                      <p className="text-[11px] text-[#CBD5E1]">
                        {dual('E-Mail-Adresse von Isa · Rolle: Kunde', 'Адрес электронной почты Исы · Роль: Заказчик')}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-white/15 text-white font-bold text-[10px] border border-white/20">
                      {dual('Musterablauf', 'Пример')}
                    </span>
                  </div>
                )}

                {currentArea.id === 'overview' && (
                  <div className="p-2.5 rounded-xl bg-[#1C2635] border border-white/15 text-xs space-y-1.5">
                    <div className="flex justify-between text-[#CBD5E1]">
                      <span>{dual('Bereitstellung:', 'Развёртывание:')}</span>
                      <strong className="text-white">Firebase Hosting</strong>
                    </div>
                    <div className="flex justify-between text-[#CBD5E1]">
                      <span>{dual('Vorgesehene Rollen:', 'Предусмотренные роли:')}</span>
                      <strong className="text-white font-bold">{dual('Kunde & Entwickler', 'Заказчик и разработчики')}</strong>
                    </div>
                  </div>
                )}

                {currentArea.id === 'internal' && (
                  <div className="p-2.5 rounded-xl bg-[#1C2635] border border-rose-500/35 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-300">
                      <LockKeyhole className="w-3.5 h-3.5 text-rose-400" />
                      <span>
                        {dual('Geschützter Entwickler-Workspace', 'Закрытый раздел разработчиков')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                      {dual(
                        'Interne Aufgabenorganisation und Zeiterfassung des Entwicklerteams (Hasin, Ismail, Amruddy).',
                        'Внутренняя организация задач и учёт времени разработчиков (Хьасин, Исмаил, Амрудди).'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Hub Call-to-Action Link */}
            <div className="border-t border-white/15 pt-5 mt-5">
              <a
                href={HUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hub-live-link"
                className="group w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#F1F0EE] text-[#10141A] px-5 py-3.5 text-sm font-extrabold hover:bg-white shadow-[0_4px_20px_rgba(255,255,255,0.18),0_4px_16px_rgba(0,0,0,0.35)] border border-white/80 transition-all focus-visible:outline-2 focus-visible:outline-white/50"
              >
                <span>{dual('Echten ProRiv Hub öffnen', 'Открыть настоящий ProRiv Hub')}</span>
                <ExternalLink className="w-4 h-4 text-[#10141A] group-hover:translate-x-0.5 transition-transform" />
              </a>
              <div className="flex flex-wrap items-center justify-between text-xs text-[#CBD5E1] mt-2.5 px-1 gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E8C9A2]" />
                  {dual('Hosting auf Firebase bereitgestellt', 'Хостинг развёрнут на Firebase')}
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  {dual('Admin-Login verifiziert; Kunden-Einladung wird vor Ort getestet', 'Вход администратора проверен; приглашение заказчика тестируется на встрече')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Notice Card */}
        <div className="rounded-2xl border border-white/[0.16] bg-[#161F2C]/75 backdrop-blur-md p-4 flex items-center justify-between gap-4 text-xs shadow-xs text-[#CBD5E1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-white border border-white/15 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <p className="text-[#CBD5E1] text-xs leading-relaxed">
              {dual(
                'Telegram kann für schnelle Benachrichtigungen bleiben; verbindliches Testfeedback und Entscheidungen werden im Hub dokumentiert. Eine Telegram-Integration ist aktuell nicht eingebaut.',
                'Telegram может остаться для быстрых уведомлений; отзывы по тестам и решения фиксируются в Hub. Интеграции Telegram пока нет.'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
