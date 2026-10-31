import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpenCheck, CalendarDays, Check, CheckCircle2,
  ChevronDown, ChevronRight, ClipboardCheck, CloudDownload, Download, ExternalLink,
  FileJson, FileText, FolderLock, GitBranch, MessageSquare, Save,
  ShieldAlert, User, UsersRound
} from 'lucide-react';
import { Language, WorkshopNotes } from '../types';
import { ACCOUNT_TYPES, LEGACY_ONBOARDING_QUESTIONS, ONBOARDING_STATIONS, ONBOARDING_WORK_STATION_COUNT, Translated } from '../data/customerOnboarding';
import { loadCustomerOnboarding, loadWorkshopNotes, saveCustomerOnboarding, exportStateAsJson } from '../db/indexedDb';
import {
  CustomerOnboardingState, OnboardingAnswer, OnboardingAccount,
  emptyAccount, emptyAnswer, emptyOnboarding, onboardingActionItems, onboardingMarkdown
} from '../utils/customerOnboarding';
import { WORKSHOP_STEPS } from '../data/workshopContent';
import { ProRivProjectRoadmapPremium } from './ProRivProjectRoadmapPremium';
import '../styles/proriv-presentation.css';
import '../styles/proriv-optical-glass.css';
import { ProRivHubCenter } from './ProRivHubCenter';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onExit: () => void;
  onOpenSenior: () => void;
  standalone?: boolean;
}
type SaveState = 'loading'|'ready'|'saving'|'saved'|'error';
const evidenceClass = {
  canon:'border-emerald-200 bg-emerald-50/70 text-emerald-900',
  team:'border-indigo-200 bg-indigo-50/65 text-indigo-950',
  open:'border-amber-200 bg-amber-50/70 text-amber-950'
};
const links: Record<string,string[]> = {
  project:['work','time','pricing'], hub:['customer','approval'],
  accounts:['export'],finish:[]
};
function download(name:string,content:string,type:string) {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const anchor=document.createElement('a'); anchor.href=url;anchor.download=name;
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export const CustomerOnboarding:React.FC<Props> = ({language,onLanguageChange,onExit,onOpenSenior,standalone=false}) => {
  const [stationIndex,setStationIndex]=useState(0);
  const [state,setState]=useState<CustomerOnboardingState>(emptyOnboarding);
  const [saveState,setSaveState]=useState<SaveState>('loading');
  const [loadFailure,setLoadFailure]=useState(false);
  const [workshopNotes,setWorkshopNotes]=useState<WorkshopNotes>({});
  const [downloadError,setDownloadError]=useState('');
  const bilingual=language==='bilingual';
  const lang = language==='ru' ? 'ru':'de';
  const t=(de:string,ru:string)=>language==='ru'?ru:de;
  const dual=(value:Translated)=> <>{value[lang]}{bilingual && <span className="block mt-1 text-[0.93em] opacity-70 leading-relaxed">{value.ru}</span>}</>;

  useEffect(()=>{
    let mounted=true;
    Promise.all([loadCustomerOnboarding(),loadWorkshopNotes()]).then(([saved,previous])=>{
      if (!mounted)return;
      setState(saved);setWorkshopNotes(previous);setSaveState('ready');
    }).catch(error=>{
      console.error('Cannot load onboarding notes',error);
      if(mounted){setLoadFailure(true);setSaveState('error');}
    });
    return ()=>{mounted=false;};
  },[]);

  // Autosave to the same IndexedDB used by the Workshop. The database module
  // writes a synchronous browser draft first, then serializes IDB commits.
  useEffect(()=>{
    if(saveState==='loading'||loadFailure) return;
    const id=window.setTimeout(async()=>{
      setSaveState('saving');
      try {await saveCustomerOnboarding(state);setSaveState('saved');}
      catch(error){console.error('Onboarding autosave failed',error);setSaveState('error');}
    },550);
    return ()=>window.clearTimeout(id);
  },[state,loadFailure]);

  const station=ONBOARDING_STATIONS[stationIndex];
  const answered=Object.values(state.answers).filter(a=>a.answer.trim()).length;
  const openItems=onboardingActionItems(state);
  const existingNotes=useMemo(()=>{
    const ids=station.id==='finish'?WORKSHOP_STEPS.map(s=>s.id):links[station.id]||[];
    return WORKSHOP_STEPS.filter(s=>ids.includes(s.id)&&workshopNotes[s.id]?.answer?.trim());
  },[station.id,workshopNotes]);
  const changeAnswer=(id:string,patch:Partial<OnboardingAnswer>)=>{
    setState(prev=>{
      const before=prev.answers[id]||emptyAnswer();
      const next={...before,...patch,updatedAt:new Date().toISOString()};
      if (before.status==='confirmed' && 'answer' in patch && patch.answer !==before.answer)
        next.status='open'; // an edited answer is no longer Isa-approved
      if (next.status==='confirmed' && !next.answer.trim()) next.status='open';
      return {...prev, answers:{...prev.answers,[id]:next}};
    });
    setSaveState('ready');
  };
  const changeAccount=(id:string,patch:Partial<OnboardingAccount>)=>{
    setState(prev=>({...prev,accounts:{...prev.accounts,[id]:{...(prev.accounts[id]||emptyAccount()),...patch}}}));
    setSaveState('ready');
  };
  const setMeetingNotes=(value:string)=>{setState(prev=>({...prev,meetingNotes:value}));setSaveState('ready');};

  // A facilitator can leave immediately after typing; commit the latest draft first.
  const leaveSafely = async (destination: () => void) => {
    if (saveState === 'loading' || loadFailure) return;
    try {
      await saveCustomerOnboarding(state);
      destination();
    } catch (error) {
      console.error('Failed to save before leaving onboarding', error);
      setSaveState('error');
      setDownloadError(t('Speichern vor dem Verlassen fehlgeschlagen. Bitte zuerst das Protokoll und die JSON-Sicherung herunterladen.',
        'Не удалось сохранить перед выходом. Сначала скачайте протокол и JSON-копию.'));
    }
  };

  const exportFile=async (kind:'md'|'json'|'all')=>{
    setDownloadError('');
    if (saveState==='loading'||loadFailure) return;
    try {
      // Commit pending edits so the full archive includes the current state.
      await saveCustomerOnboarding(state);
      const stamp='2026-10-31';
      if(kind==='md') download('ProRiv_Isa_Onboarding_'+stamp+'.md',onboardingMarkdown(state,lang),'text/markdown;charset=utf-8');
      if(kind==='json') download('ProRiv_Isa_Onboarding_'+stamp+'.json',JSON.stringify(state,null,2),'application/json');
      if(kind==='all') download('ProRiv_Eventstorming_Backup_'+stamp+'.json',await exportStateAsJson(),'application/json');
      setSaveState('saved');
    } catch(err){
      console.error('Onboarding export failure',err);
      // A local MD/JSON file is still possible if the browser's DB becomes unwritable.
      if (kind==='md') download('ProRiv_Isa_Onboarding_NOTIZEN_'+Date.now()+'.md',onboardingMarkdown(state,lang),'text/markdown;charset=utf-8');
      if (kind==='json') download('ProRiv_Isa_Onboarding_NOTIZEN_'+Date.now()+'.json',JSON.stringify(state,null,2),'application/json');
      setDownloadError(t('Datenbank-Sicherung fehlgeschlagen. Prüfe die heruntergeladene Datei. Für das Gesamtbackup zuerst die Browser-Speicherung reparieren.',
        'Не удалось сохранить базу. Проверьте загруженный файл. Для полной копии устраните ошибку хранения.'));
      setSaveState('error');
    }
  };

  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const node=e.target as HTMLElement|null;
      if(node?.closest('input,textarea,select,button,[contenteditable="true"]')||e.altKey||e.ctrlKey||e.metaKey) return;
      if(e.key==='ArrowRight'){setStationIndex(x=>Math.min(ONBOARDING_STATIONS.length-1,x+1));}
      if(e.key==='ArrowLeft'){setStationIndex(x=>Math.max(0,x-1));}
    };
    window.addEventListener('keydown',handler);
    return ()=>window.removeEventListener('keydown',handler);
  },[]);
  const next=(direction:number)=>{setStationIndex(x=>Math.max(0,Math.min(ONBOARDING_STATIONS.length-1,x+direction)));window.scrollTo({top:0,behavior:'smooth'});};

  if(loadFailure) return <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-slate-100">
    <div role="alert" className="max-w-lg border border-rose-500/50 p-8 rounded-2xl bg-slate-900">
      <ShieldAlert className="w-9 h-9 text-rose-300 mb-4"/>
      <h1 className="text-xl font-semibold mb-3">{t('Onboarding-Daten konnten nicht geladen werden','Не удалось загрузить данные онбординга')}</h1>
      <p className="text-sm text-slate-300 mb-5">{t('Bearbeitung ist blockiert, um vorhandene Notizen nicht zu überschreiben. Öffne die Anwendung im ursprünglichen Browser oder lade eine Sicherung.','Редактирование заблокировано, чтобы не перезаписать заметки. Откройте исходный браузер или восстановите копию.')}</p>
      <button className="bg-cyan-600 px-5 py-2 rounded-lg" onClick={()=>window.location.reload()}>{t('Erneut laden','Повторить')}</button>
    </div>
  </main>;

  return <div className="pr-onboarding relative min-h-screen text-[#EEF0F2] overflow-x-hidden selection:bg-[#e3bb6b]/20 selection:text-white">
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
      <img src="/assets/proriv_mountain_background_16x9.webp" alt="" className="w-full h-full object-cover object-center"/>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e1725]/18 via-transparent to-[#0d1522]/8"/>
    </div>
    <div className="pr-present-shell">
      <aside className="pr-present-sidebar" aria-label={t('Stationen','Этапы')}>
        <div className="pr-logo" aria-label="ProRiv">
          <span className="pr-logo-mark" aria-hidden="true">≋</span>
          <div><strong>ProRiv</strong><small>{t('ISA · PROJEKT','ПРОЕКТ ИСЫ')}</small></div>
        </div>
        <nav className="pr-present-nav" aria-label={t('Stationen','Этапы')}>
          {ONBOARDING_STATIONS.map((item,i)=>{
            const Icon=item.id==='project'?CalendarDays:item.id==='hub'?MessageSquare:item.id==='accounts'?FolderLock:CheckCircle2;
            return <button type="button" key={item.id} data-testid={'station-nav-'+item.id} aria-current={stationIndex===i?'step':undefined}
              onClick={()=>{setStationIndex(i);window.scrollTo({top:0,behavior:'smooth'})}}>
              <Icon size={21}/><span className="pr-nav-name">{dual(item.title)}</span>
            </button>;
          })}
        </nav>
        <div className="pr-present-sidebar-footer">
          <div className="pr-present-toolbar" role="group" aria-label={t('Sprache','Язык')}>
            {(['de','ru','bilingual'] as Language[]).map(code=><button type="button" key={code} onClick={()=>onLanguageChange(code)}
              aria-pressed={language===code}>{code==='bilingual'?'DE+RU':code.toUpperCase()}</button>)}
          </div>
          <p className="pr-present-secondary">
            {saveState==='saving'?<Save size={16}/>:saveState==='error'?<ShieldAlert size={16}/>:<CheckCircle2 size={16}/>}
            {saveState==='loading'?t('Lade Daten','Загрузка'):saveState==='saving'?t('Speichert lokal','Сохранение'):saveState==='saved'?t('Lokal gesichert','Сохранено локально'):saveState==='error'?t('Speicherfehler','Ошибка сохранения'):t('Notizen lokal','Локальные заметки')}
          </p>
          {!standalone && <button className="pr-present-secondary text-left" type="button" onClick={()=>void leaveSafely(onOpenSenior)}>
            <BookOpenCheck size={16}/>{t('Senior-Präsentation','Презентация сеньора')}
          </button>}
          <button className="pr-present-secondary text-left" type="button" onClick={()=>void exportFile('md')} disabled={saveState==='loading'}>
            <Download size={16}/>{t('Protokoll sichern','Скачать протокол')}
          </button>
          {!standalone && <button className="pr-present-secondary text-left" type="button" onClick={()=>void leaveSafely(onExit)}>
            <ArrowLeft size={16}/>{t('Präsentation verlassen','Выйти из презентации')}
          </button>}
        </div>
      </aside>
        <main className="pr-present-main">
          <h1 className="sr-only">{t('Kunden-Onboarding · 31.10.2026','Онбординг заказчика · 31.10.2026')}</h1>
          <section className={station.id==='project'?'pr-project-section':'pr-other-section'}>
            {station.id==='project'?
              <div className="pr-project-head">
                <div className="min-w-0"><p className="pr-eyebrow">{t('PROJEKT ISA','ПРОЕКТ ИСЫ')}</p>
                  <h2>{dual(station.title)}</h2>
                  <p className="pr-project-subtitle">{dual(station.purpose)}</p>
                </div>
                <div className="pr-project-claim">{t('Gemeinsam von Idee zu Wirkung.','Вместе от идеи к результату.')}</div>
              </div>
              :<div className="pr-other-head">
                <p className="pr-eyebrow">{station.id==='finish'?t('ABSCHLUSS','ЗАВЕРШЕНИЕ'):t('STATION','ЭТАП')+' '+(stationIndex+1)+' / '+ONBOARDING_WORK_STATION_COUNT}</p>
                <h2>{dual(station.title)}</h2>
                <p>{dual(station.purpose)}</p>
              </div>}

          {station.id==='hub' && <div className="p-5 md:p-7 space-y-6" data-testid="onboarding-hub-visual">
            <ProRivHubCenter language={language} />
            <details data-testid="onboarding-team-accordion" className="group rounded-3xl border border-white/[0.18] bg-[#161F2C]/75 backdrop-blur-xl shadow-2xl overflow-hidden transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3 p-4 sm:px-6 sm:py-5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#F1F0EE] transition-colors">
                <div className="flex items-center gap-3.5">
                  <span className="p-2.5 rounded-2xl bg-[#222C3A] text-white shadow-xs border border-white/15">
                    <UsersRound className="w-5 h-5" aria-hidden="true"/>
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="block text-sm font-bold text-white tracking-tight">
                        {t('Unser Entwicklungsteam','Наша команда разработчиков')}
                      </span>
                      <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white border border-white/20">
                        {t('Projektteam · 3 Entwickler', 'Команда проекта · 3 разработчика')}
                      </span>
                    </div>
                    <span className="block text-xs text-[#CBD5E1] mt-0.5">
                      {t('Hasin · Ismail · Amruddy', 'Хьасин · Исмаил · Амрудди')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 group-hover:border-white/35 transition-colors">
                  <span className="hidden sm:inline">{t('Team ansehen','Посмотреть команду')}</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"/>
                </div>
              </summary>
              <div className="p-5 sm:p-6 border-t border-white/[0.14] bg-[#121924]/80 backdrop-blur-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Hasin */}
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#202938]/90 border border-white/[0.18] shadow-md hover:border-white/45 transition-all duration-200 group">
                    <div className="relative mb-3">
                      <img
                        src="/assets/aistudio/image_fef92dbe.png"
                        alt={t('Hasin', 'Хьасин')}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#10141A] flex items-center justify-center shadow-xs" title={t('Aktiv im Projekt', 'Активен в проекте')}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{t('Hasin', 'Хьасин')}</span>
                    {bilingual && <span className="text-xs font-medium text-[#CBD5E1] mt-0.5">Хьасин</span>}
                    <span className="text-[11px] font-medium text-[#CBD5E1] mt-1">{t('Architektur & Umsetzung', 'Архитектура и разработка')}</span>
                  </div>

                  {/* Ismail */}
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#202938]/90 border border-white/[0.18] shadow-md hover:border-white/45 transition-all duration-200 group">
                    <div className="relative mb-3">
                      <img
                        src="/assets/aistudio/image_14e6391c.png"
                        alt={t('Ismail', 'Исмаил')}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#10141A] flex items-center justify-center shadow-xs" title={t('Aktiv im Projekt', 'Активен в проекте')}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{t('Ismail', 'Исмаил')}</span>
                    {bilingual && <span className="text-xs font-medium text-[#CBD5E1] mt-0.5">Исмаил</span>}
                    <span className="text-[11px] font-medium text-[#CBD5E1] mt-1">{t('Frontend & UI-Design', 'Фронтенд и дизайн')}</span>
                  </div>

                  {/* Amruddy */}
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#202938]/90 border border-white/[0.18] shadow-md hover:border-white/45 transition-all duration-200 group">
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full bg-[#2E3B4D] text-white flex flex-col items-center justify-center border-2 border-white/40 shadow-md group-hover:scale-105 transition-transform duration-200">
                        <User className="w-9 h-9 text-white/90" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#10141A] flex items-center justify-center shadow-xs" title={t('Aktiv im Projekt', 'Активен в проекте')}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">{t('Amruddy', 'Амрудди')}</span>
                    {bilingual && <span className="text-xs font-medium text-[#CBD5E1] mt-0.5">Амрудди</span>}
                    <span className="text-[11px] font-medium text-[#CBD5E1] mt-1">{t('Integration & Logik', 'Интеграция и логика')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-[#CBD5E1]">
                  <p>{t('Kundenseite: Isa und sein Team.', 'Со стороны заказчика: Иса и его команда.')}</p>
                </div>
              </div>
            </details>
          </div>}
          {station.id==='project' ? <div data-testid="onboarding-project-visual">
            <ProRivProjectRoadmapPremium language={language} answers={Object.fromEntries(Object.entries(state.answers).map(([id,a])=>[id,a.answer]))} onAnswerChange={(id,answer)=>changeAnswer(id,{answer})} disabled={saveState==='loading'}/>

          </div> : (station.id==='hub'||station.id==='finish') ? null :
          <div className="p-5 md:p-6">
            <h3 className="uppercase text-[10px] text-[#CBD5E1] font-bold tracking-[0.2em] mb-3">{t('Was wir erklären','Что мы объясняем')}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {station.points.map(point=><div key={point.id} className={'border border-white/[0.16] rounded-2xl p-4 bg-[#141C26]/80 backdrop-blur-md text-[#EEF0F2]'}>
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-2 text-[#CBD5E1]">
                  {point.evidence==='canon'?t('Kanonische Grundlage','Основа по канону'):
                    point.evidence==='team'?t('Teamplan · nicht bestätigt','План команды · не подтверждён'):
                    t('Noch offen','Открытый вопрос')}
                </div>
                <p className="text-sm leading-relaxed font-semibold text-white">{dual(point.text)}</p>
                <p className="text-[10px] opacity-75 mt-2 text-[#94A3B8]">{point.source}</p>
              </div>)}
            </div>
          </div>}
        </section>

        {existingNotes.length>0 && <details className="rounded-3xl bg-[#161F2C]/75 backdrop-blur-xl border border-white/[0.18] px-5 py-4 shadow-xl">
          <summary className="cursor-pointer text-sm font-semibold text-white hover:text-white">
            {t('Bestehende Workshop-Antworten als Referenz','Ранее записанные ответы для справки')} ({existingNotes.length})
          </summary>
          <p className="text-xs text-amber-300 mt-3">{t('Historische Antworten nur zum Abgleich; sie bestätigen keine heutige Kundenentscheidung.','Прежние ответы только для сопоставления, не для автоматического подтверждения сегодня.')}</p>
          <div className="mt-3 space-y-2">
            {existingNotes.map(step=><div key={step.id} className="bg-[#141C26]/80 rounded-xl p-3.5 border border-white/15">
              <p className="text-xs font-semibold text-white">{language==='ru'?step.titleRu:step.title}</p>
              <p className="text-sm mt-1 text-[#EEF0F2]">{workshopNotes[step.id].answer}</p>
              <p className="text-[11px] mt-1 text-[#94A3B8]">{workshopNotes[step.id].isaConfirmed?t('Historisch als Isa-bestätigt markiert; bitte erneut abgleichen','Ранее отмечено как подтверждённое Исой; проверить'):t('Historische Notiz, nicht bestätigt','Прежняя заметка, не подтверждено')}</p>
            </div>)}
          </div>
        </details>}

        {/* Section 2: Question and meeting notes - Luminous & high contrast */}
        {station.id!=='project' && station.questions.length>0 && <section className="rounded-3xl border border-white/[0.18] bg-[#161F2C]/75 backdrop-blur-xl shadow-2xl p-5 md:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#F1F0EE]"/>
                {t('Fragen und Gesprächsnotizen','Вопросы и заметки')}
              </h3>
              <p className="text-xs text-[#CBD5E1] mt-1">{t('Antworten direkt während des Gesprächs festhalten. Keine zusätzlichen Status- oder Terminformulare.', 'Записывайте ответы прямо во время встречи, без лишних статусов и форм.')}</p>
            </div>
            <span className="text-xs text-white bg-white/10 border border-white/20 rounded-full px-3 py-1 font-bold shrink-0">
              {station.questions.length} {t('Fragen','вопросов')}
            </span>
          </div>
          <div className="space-y-3.5">
            {station.questions.map((q,i)=>{
              const a=state.answers[q.id]||emptyAnswer();
              return <div key={q.id} className="border border-white/[0.16] rounded-2xl bg-[#141C26]/80 backdrop-blur-md p-4 sm:p-5 hover:border-white/30 transition-all">
                <label className="block text-sm font-semibold text-white">
                  <span className="text-[#94A3B8] font-mono mr-2">{String(i+1).padStart(2,'0')}</span>{dual(q.prompt)}
                  <textarea rows={2} value={a.answer} maxLength={10000}
                    placeholder={t('Antwort aus dem Gespräch …','Ответ со встречи …')}
                    disabled={saveState==='loading'} onChange={e=>changeAnswer(q.id,{answer:e.target.value})}
                    className="block mt-3 w-full min-h-[75px] p-3.5 rounded-xl border border-white/20 bg-[#1E2837]/90 text-white placeholder:text-[#64748B] text-sm font-normal resize-y focus:bg-[#243142] focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 transition-all"/>
                </label>
                <label className="block mt-3 max-w-sm text-xs font-medium text-[#CBD5E1]">{t('Verantwortlicher (optional)','Ответственный (необязательно)')}
                  <input value={a.owner} onChange={e=>changeAnswer(q.id,{owner:e.target.value})}
                    placeholder={t('Name bei Bedarf','Имя при необходимости')}
                    className="block mt-1 p-2.5 w-full rounded-xl bg-[#1E2837]/90 border border-white/20 text-white placeholder:text-[#64748B] text-sm font-normal focus:bg-[#243142] focus:outline-none focus:ring-2 focus:ring-white/50"/>
                </label>
              </div>;
            })}
          </div>
        </section>}

        {station.id==='accounts' && <section className="rounded-3xl border border-white/[0.18] bg-[#161F2C]/75 backdrop-blur-xl shadow-2xl p-5 md:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10 mb-4">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <FolderLock className="w-5 h-5"/>
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{t('Konten und Zuständigkeiten','Аккаунты и ответственные')}</h3>
              <p className="text-xs text-amber-300 font-medium mt-0.5">{t('Keine Passwörter, API-Schlüssel, Tokens oder Recovery-Codes hier eintragen.','Не вводите сюда пароли, API-ключи, токены и коды восстановления.')}</p>
            </div>
          </div>
          <div className="space-y-4">
            {ACCOUNT_TYPES.map(account=>{
              const a=state.accounts[account.id]||emptyAccount();
              return <div key={account.id} className="border border-white/[0.16] rounded-2xl p-5 space-y-3.5 bg-[#141C26]/80 backdrop-blur-md">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F1F0EE]" />
                    {account.name}
                  </h4>
                  <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">{dual(account.reason)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="text-xs font-semibold text-[#CBD5E1]">{t('Bereits vorhanden?','Уже есть?')}
                    <select value={a.exists} onChange={e=>changeAccount(account.id,{exists:e.target.value as OnboardingAccount['exists']})}
                      className="block mt-1 p-2.5 w-full border border-white/20 rounded-xl bg-[#1E2837]/90 text-white font-normal text-sm focus:outline-none focus:ring-2 focus:ring-white/50">
                      <option value="unknown" className="bg-[#10141A] text-white">{t('Noch ungeklärt','Неизвестно')}</option>
                      <option value="yes" className="bg-[#10141A] text-white">{t('Ja','Да')}</option>
                      <option value="no" className="bg-[#10141A] text-white">{t('Nein','Нет')}</option>
                    </select>
                  </label>
                  {([
                    ['owner',t('Eigentümer','Владелец')],
                    ['setupBy',t('Wer richtet es ein?','Кто настраивает?')],
                    ['access',t('Wer braucht Zugriff?','Кому нужен доступ?')],
                    ['followUp',t('Offene Aufgabe','Следующее действие')]
                  ] as const).map(([key,label])=><label key={key} className={'text-xs font-semibold text-[#CBD5E1] '+(key==='followUp'?'md:col-span-2':'')}>
                    {label}<input value={a[key]} onChange={e=>changeAccount(account.id,{[key]:e.target.value})}
                      placeholder="—" className="block mt-1 p-2.5 w-full border border-white/20 rounded-xl bg-[#1E2837]/90 text-white font-normal text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-white/50"/>
                  </label>)}
                  <label className="text-xs font-semibold text-[#CBD5E1]">{t('Frist','Срок')}
                    <input type="date" value={a.dueDate} onChange={e=>changeAccount(account.id,{dueDate:e.target.value})}
                      className="block mt-1 p-2.5 w-full border border-white/20 rounded-xl bg-[#1E2837]/90 text-white font-normal text-sm focus:outline-none focus:ring-2 focus:ring-white/50"/>
                  </label>
                </div>
              </div>;
            })}
          </div>
        </section>}

        {station.id==='finish' && <section className="rounded-3xl border border-white/[0.12] bg-[#14181F]/75 backdrop-blur-xl shadow-2xl p-5 md:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-[#EEF0F2]">{t('Abschlussübersicht','Итоговая сводка')}</h3>
              <p className="text-xs text-[#B8BCC1] mt-0.5">{answered} {t('festgehaltene Antworten','записанных ответов')}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#EEF0F2] text-xs font-semibold">
              {t('Verbindliche Grundlage', 'Основа договорённостей')}
            </span>
          </div>

          <div className="space-y-2">{ONBOARDING_STATIONS.flatMap(group=>group.questions.filter(q=>state.answers[q.id]?.answer.trim()).map(q=><div key={q.id} className="rounded-2xl border border-white/10 px-4 py-3.5 bg-[#10141A]/60 backdrop-blur-md"><p className="text-xs font-semibold text-[#EEF0F2]">{dual(q.prompt)}</p><p className="text-sm mt-1 text-[#EEF0F2] whitespace-pre-wrap">{state.answers[q.id].answer}</p></div>))}</div>
          {LEGACY_ONBOARDING_QUESTIONS.some(q=>state.answers[q.id]?.answer.trim()) && <details className="rounded-2xl border border-white/10 bg-[#10141A]/60 p-4">
            <summary className="text-sm font-semibold text-slate-300 cursor-pointer">{t('Gesicherte Antworten aus früherer Fassung','Сохранённые ответы из прежней версии')}</summary>
            <div className="mt-3 space-y-2">{LEGACY_ONBOARDING_QUESTIONS.filter(q=>state.answers[q.id]?.answer.trim()).map(q=><div key={q.id} className="rounded-xl border border-white/10 bg-[#1D232B]/80 p-3"><p className="text-xs font-semibold text-slate-400">{dual(q.label)}</p><p className="text-sm text-slate-200 whitespace-pre-wrap mt-1">{state.answers[q.id].answer}</p></div>)}</div>
          </details>}
          <div className="rounded-2xl border border-white/10 bg-[#10141A]/60 backdrop-blur-md p-5 space-y-3" data-testid="finish-accounts-summary">
            <h4 className="font-bold text-sm text-[#EEF0F2]">{t('Plattformkonten – gesammelter Stand','Платформенные аккаунты — общий статус')}</h4>
            {ACCOUNT_TYPES.map(account=>{
              const a=state.accounts[account.id]||emptyAccount();
              return <div key={account.id} className="flex flex-wrap justify-between gap-2 text-xs border-t border-white/10 pt-2.5"><span className="font-semibold text-slate-200">{account.name}</span><span className="text-slate-400">{a.owner.trim()||t('Eigentümer offen','Владелец не назначен')} · {a.exists==='yes'?t('vorhanden','есть'):a.exists==='no'?t('noch nicht vorhanden','пока нет'):t('ungeklärt','неизвестно')}</span></div>;
            })}
          </div>
          <h4 className="font-bold text-sm text-[#EEF0F2] pt-2">{t('Zuständigkeiten und Konten-Folgepunkte','Ответственные и вопросы по аккаунтам')}</h4>
          {openItems.length===0?<p className="bg-[#10141A]/60 rounded-2xl border border-white/10 p-4 text-sm text-slate-400">{t('Noch keine Verantwortlichkeiten oder Aufgaben erfasst.','Пока нет записанных задач и ответственных.')}</p>:
            <div className="space-y-2">{openItems.map(item=><div key={item.id} className="border border-white/10 rounded-2xl px-4 py-3 bg-[#10141A]/60 text-sm">
              <p className="font-semibold text-slate-200">{dual(item.title)}</p><p className="text-xs text-slate-400 mt-1">
                {item.answer.owner||t('Verantwortlicher nicht eingetragen','Ответственный не указан')}
                {item.answer.nextStep.trim() ? ' · '+item.answer.nextStep : ''}
                {item.answer.dueDate.trim() ? ' · '+item.answer.dueDate : ''}</p>
            </div>)}</div>}
          <label className="block text-xs font-semibold text-slate-300 pt-1">{t('Weitere Notizen / benötigte Unterlagen','Дополнительные заметки / документы')}
            <textarea rows={4} value={state.meetingNotes} onChange={e=>setMeetingNotes(e.target.value)}
              className="block mt-2 p-3.5 w-full rounded-2xl border border-white/15 bg-[#1D232B]/90 text-[#EEF0F2] font-normal text-sm focus:outline-none focus:ring-2 focus:ring-[#F1F0EE]/40 placeholder:text-[#56616F]"
              placeholder={t('Nur Sachverhalte, keine Zugangsdaten …','Только сведения по делу, без секретов …')}/>
          </label>
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm font-bold text-[#EEF0F2] mb-1">{t('Unbedingt vor Verlassen exportieren','Обязательно скачать перед завершением')}</p>
            <p className="text-xs text-[#B8BCC1] mb-3">{t('Notizen werden ausschließlich in diesem Browser gespeichert. Für die Sitzung Protokoll und vollständiges Backup herunterladen.','Заметки хранятся только в этом браузере. Скачайте протокол и полную резервную копию.')}</p>
            <div className="flex flex-wrap gap-2.5">
              <button onClick={()=>void exportFile('md')} className="px-4 py-2.5 bg-[#F1F0EE] hover:bg-white text-[#10141A] rounded-xl text-xs font-semibold flex items-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-white/60 transition-all"><FileText className="w-4 h-4"/>{t('Protokoll (.md)','Протокол (.md)')}</button>
              <button onClick={()=>void exportFile('all')} className="px-4 py-2.5 bg-[#232830] hover:bg-[#2c333e] border border-white/15 text-[#EEF0F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"><CloudDownload className="w-4 h-4"/>{t('Vollständiges JSON-Backup','Полная копия JSON')}</button>
              <button onClick={()=>void exportFile('json')} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-[#EEF0F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"><FileJson className="w-4 h-4"/>{t('Nur Onboarding-JSON','Только JSON онбординга')}</button>
            </div>
            {downloadError&&<p role="alert" className="text-xs text-rose-400 mt-3">{downloadError}</p>}
          </div>
        </section>}

        <nav className="flex items-center justify-between gap-3 pb-3" aria-label={t('Station wechseln','Сменить этап')}>
          <button onClick={()=>next(-1)} disabled={stationIndex===0} className="border border-white/15 disabled:opacity-30 rounded-2xl bg-[#1D232B]/70 backdrop-blur-md hover:bg-white/10 px-5 py-3 text-sm text-[#EEF0F2] flex items-center gap-2 transition-all"><ArrowLeft className="w-4 h-4"/>{t('Zurück','Назад')}</button>
          <span className="text-xs text-[#B8BCC1] font-medium">{station.id==='finish'?t('Abschluss','Итоги'):(stationIndex+1)+' / '+ONBOARDING_WORK_STATION_COUNT}</span>
          {stationIndex<ONBOARDING_STATIONS.length-1?<button onClick={()=>next(1)} className="rounded-2xl bg-[#F1F0EE] hover:bg-white text-[#10141A] px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/60 transition-all">
            {t('Nächste Station','Следующий этап')}<ArrowRight className="w-4 h-4"/>
          </button>:
            <button onClick={()=>void exportFile('md')} className="rounded-2xl bg-[#F1F0EE] hover:bg-white text-[#10141A] px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/60 transition-all">
              <Download className="w-4 h-4"/>{t('Protokoll sichern','Скачать протокол')}
            </button>}
        </nav>
      </main>
    </div>
</div>;
};
