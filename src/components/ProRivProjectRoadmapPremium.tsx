import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Check, ClipboardCheck, Code2, MessageCircle, Pencil, ShieldCheck, UsersRound, Clock3 } from 'lucide-react';
import type { Language } from '../types';

type StageId = 'development' | 'review' | 'preview' | 'feedback';
type FieldId = 'releaseOwner' | 'testWindow' | 'testProcess';
const stages = [
  {
    id:'development' as StageId, de:'Development intern', ru:'Внутренняя разработка',
    icon:Code2,
    envBadge: { de:'Umgebung 1', ru:'Среда 1' },
    roleDe:'Umgebung: Für uns', roleRu:'Среда: Для нас',
    titleDe:'Hier entwickeln wir die Funktionen', titleRu:'Здесь мы разрабатываем функции',
    detailDe:'Hasin, Ismail und Amruddy arbeiten in einer privaten Development-Umgebung. Isa und sein Team erhalten darauf keinen Zugriff.',
    detailRu:'Хьасин, Исмаил и Амрудди работают в закрытой среде Development. У Исы и его команды нет доступа к ней.'
  },
  {
    id:'review' as StageId, de:'Interne Prüfung', ru:'Внутренняя проверка',
    icon:ShieldCheck,
    roleDe:'Vorab-Prüfung intern', roleRu:'Внутренняя проверка',
    titleDe:'Erst prüfen, dann freigeben', titleRu:'Сначала проверка, затем допуск',
    detailDe:'Wir testen Änderungen intern und beheben gefundene Fehler. Erst nach ausdrücklicher Freigabe übernehmen wir eine Funktion in die Testumgebung.',
    detailRu:'Мы проверяем изменения внутри команды и исправляем ошибки. Только после явного допуска функция попадает в тестовую среду.'
  },
  {
    id:'preview' as StageId, de:'Release Preview / Test', ru:'Release Preview / Тест',
    icon:ClipboardCheck,
    envBadge: { de:'Umgebung 2', ru:'Среда 2' },
    roleDe:'Umgebung: Für Isa & Team', roleRu:'Среда: Для Исы и команды',
    titleDe:'Hier probiert Isa die freigegebenen Funktionen aus', titleRu:'Здесь Иса проверяет допущенные функции',
    detailDe:'Isa erhält Zugang zur separaten Release-Preview-Umgebung und konkrete Testaufgaben. Eine erste App-Testversion wird erst gezeigt, sobald sie tatsächlich bereitgestellt und freigegeben wurde.',
    detailRu:'Иса получает доступ к отдельной среде Release Preview и конкретные тестовые задания. Первую тестовую версию приложения покажем только после реальной публикации и допуска.'
  },
  {
    id:'feedback' as StageId, de:'Feedback & Nachbesserung', ru:'Отзыв и доработка',
    icon:MessageCircle,
    roleDe:'Gemeinsamer Abgleich', roleRu:'Совместное обсуждение',
    titleDe:'Rückmeldungen kommen an die richtige Stelle', titleRu:'Отзывы попадают к нужной задаче',
    detailDe:'Isa meldet Beobachtungen in Telegram direkt zur Testaufgabe. Wir prüfen das Feedback und bearbeiten nötige Änderungen wieder in Development.',
    detailRu:'Иса оставляет замечания в Telegram прямо в тестовом задании. Мы проверяем отзыв и дорабатываем функцию в Development.'
  }
];
const agreements = [
  {
    id:'releaseOwner' as FieldId, icon:UsersRound,
    de:'Wer koordiniert die Kundentests?',ru:'Кто координирует тесты заказчика?',
    subDe:'Eine Ansprechperson auf Isas Seite.',subRu:'Контактное лицо со стороны Исы.',
    placeholderDe:'Name und Zuständigkeit …',placeholderRu:'Имя и обязанности …'
  },
  {
    id:'testWindow' as FieldId, icon:CalendarDays,
    de:'Welche Testfenster gelten?',ru:'Когда проводим тесты?',
    subDe:'Wann hat das Kundenteam Zeit zum Testen?',subRu:'Когда команда заказчика сможет тестировать?',
    placeholderDe:'Testzeitraum und Verfügbarkeit …',placeholderRu:'Период тестирования и доступность …'
  },
  {
    id:'testProcess' as FieldId, icon:Clock3,
    de:'Welche Antwortfristen vereinbaren wir?',ru:'Какие сроки ответа согласуем?',
    subDe:'Bis wann erhalten wir Rückmeldungen?',subRu:'Когда мы получим обратную связь?',
    placeholderDe:'Antwort- und Feedbackfristen …',placeholderRu:'Сроки ответов и отзывов …'
  }
];

export function ProRivProjectRoadmapPremium({language,answers,onAnswerChange,disabled=false}:{
  language:Language;
  answers:Record<string,string>;
  onAnswerChange:(id:FieldId,answer:string)=>void;
  disabled?:boolean;
}){
  const [stage,setStage]=useState<StageId>('development');
  const [editing,setEditing]=useState<FieldId|null>(null);
  const ru=language==='ru',bilingual=language==='bilingual';
  const label=(de:string,russian:string)=><>{ru?russian:de}{bilingual&&<span className="block text-[0.82em] font-normal opacity-80 mt-1">{russian}</span>}</>;
  const chosen=stages.find(item=>item.id===stage)!;
  const ChosenIcon=chosen.icon;

  return <section className="pr-process-onboarding" data-testid="onboarding-process">
    <div className="pr-process-main">
      <div className="pr-process-heading">
        <div>
          <h3>{label('Von der Entwicklung zum Kundentest','От разработки к тестированию')}</h3>
        </div>
      </div>
      <div className="pr-process-steps" role="group" aria-label={ru?'Шаги разработки и тестирования':'Entwicklungs- und Testablauf'}>
        {stages.map((item,i)=>{
          const Icon=item.icon;
          return <React.Fragment key={item.id}>
            <button type="button" data-testid={'process-step-'+item.id} aria-pressed={stage===item.id}
              className={'pr-process-step '+(stage===item.id?'pr-process-step--active':'')}
              onClick={()=>setStage(item.id)}>
              <span className="pr-process-step-icon"><Icon size={21} strokeWidth={1.65}/></span>
              <span className="pr-process-step-copy">
                {'envBadge' in item && item.envBadge && (
                  <span className={'inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mb-1 ' +
                    (item.id==='development' ? 'text-sky-300 bg-sky-950/60 border border-sky-400/30' : 'text-emerald-300 bg-emerald-950/60 border border-emerald-400/30')}>
                    {label(item.envBadge.de, item.envBadge.ru)}
                  </span>
                )}
                <strong>{label(item.de,item.ru)}</strong>
                <small>{label(item.roleDe,item.roleRu)}</small>
              </span>
              <span className="pr-process-step-number" aria-hidden="true">{i+1}</span>
            </button>
            {i<stages.length-1&&<ArrowRight size={18} className="pr-process-arrow" aria-hidden="true"/>}
          </React.Fragment>;
        })}
      </div>
      <div className="pr-process-detail" data-testid="process-detail" aria-live="polite" aria-atomic="true">
        <span className="pr-process-detail-icon"><ChosenIcon size={24}/></span>
        <div>
          <p className="pr-process-role">{label(chosen.roleDe,chosen.roleRu)}</p>
          <h4>{label(chosen.titleDe,chosen.titleRu)}</h4>
          <p>{label(chosen.detailDe,chosen.detailRu)}</p>
        </div>
      </div>
    </div>

    <div className="pr-process-agreements" data-testid="roadmap-commitments">
      <div className="pr-process-agreements-heading">
        <div>
          <h3>{label('Drei Fragen an Isa','Три вопроса к Исе')}</h3>
        </div>
      </div>
      <div className="pr-agreements">
        {agreements.map(field=>{
          const Icon=field.icon,expanded=editing===field.id,filled=Boolean(answers[field.id]?.trim());
          const panelId='pr-agreement-'+field.id;
          return <div key={field.id} className={'pr-agreement '+(expanded?'pr-agreement--editing':'')}>
            <button type="button" className="pr-agreement-trigger" aria-expanded={expanded} aria-controls={panelId}
              onClick={()=>setEditing(expanded?null:field.id)}>
              <span className="pr-agreement-icon"><Icon size={21}/></span>
              <span className="min-w-0 flex-1 text-left"><strong>{label(field.de,field.ru)}</strong><small>{label(field.subDe,field.subRu)}</small></span>
              <Pencil size={15} className="pr-agreement-pencil"/>
            </button>
            <div id={panelId}>
              {!expanded&&<p className={'pr-agreement-status '+(filled?'pr-agreement-status--filled':'')}>
                <span className="pr-status-dot"/>{filled?label('Notiz erfasst','Заметка записана'):label('Noch offen · zum Eintragen anklicken','Не решено · нажмите для записи')}
              </p>}
              {filled&&!expanded&&<p className="pr-agreement-answer">{answers[field.id]}</p>}
              {expanded&&<div className="pr-agreement-editor">
                <textarea autoFocus value={answers[field.id]||''} onChange={e=>onAnswerChange(field.id,e.target.value)}
                  disabled={disabled} rows={3} maxLength={10000}
                  data-testid={field.id==='releaseOwner'?'onboarding-test-owner':field.id==='testWindow'?'onboarding-test-window':'onboarding-test-deadlines'}
                  placeholder={ru?field.placeholderRu:field.placeholderDe} aria-label={ru?field.ru:field.de}/>
                <button type="button" className="pr-done" onClick={()=>setEditing(null)}><Check size={15}/>{label('Fertig','Готово')}</button>
              </div>}
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
