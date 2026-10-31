import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Check, ClipboardCheck, Code2, MessageCircle, Pencil, ShieldCheck, UsersRound, Clock3 } from 'lucide-react';
import type { Language } from '../types';

type StageId = 'development' | 'review' | 'preview' | 'feedback';
type FieldId = 'releaseOwner' | 'testWindow' | 'testProcess';
const stages = [
  {
    id:'development' as StageId, de:'Development intern', ru:'Внутренняя разработка',
    icon:Code2, roleDe:'Nur Entwicklerteam', roleRu:'Только разработчики',
    titleDe:'Hier entwickeln wir die Funktionen', titleRu:'Здесь мы разрабатываем функции',
    detailDe:'Hasin, Ismail und Amruddy arbeiten in einer privaten Development-Umgebung. Isa und sein Team erhalten darauf keinen Zugriff.',
    detailRu:'Хьасин, Исмаил и Амрудди работают в закрытой среде Development. У Исы и его команды нет доступа к ней.'
  },
  {
    id:'review' as StageId, de:'Interne Prüfung', ru:'Внутренняя проверка',
    icon:ShieldCheck, roleDe:'Nur Entwicklerteam', roleRu:'Только разработчики',
    titleDe:'Erst prüfen, dann freigeben', titleRu:'Сначала проверка, затем допуск',
    detailDe:'Wir testen Änderungen intern und beheben gefundene Fehler. Erst nach ausdrücklicher Freigabe übernehmen wir eine Funktion in die Testumgebung.',
    detailRu:'Мы проверяем изменения внутри команды и исправляем ошибки. Только после явного допуска функция попадает в тестовую среду.'
  },
  {
    id:'preview' as StageId, de:'Release Preview / Test', ru:'Release Preview / Тест',
    icon:ClipboardCheck, roleDe:'Isa & Kundenteam', roleRu:'Иса и команда заказчика',
    titleDe:'Hier probiert Isa die freigegebenen Funktionen aus', titleRu:'Здесь Иса проверяет допущенные функции',
    detailDe:'Isa erhält Zugang zur separaten Release-Preview-Umgebung und konkrete Testaufgaben. Eine erste App-Testversion wird erst gezeigt, sobald sie tatsächlich bereitgestellt und freigegeben wurde.',
    detailRu:'Иса получает доступ к отдельной среде Release Preview и конкретные тестовые задания. Первую тестовую версию приложения покажем только после реальной публикации и допуска.'
  },
  {
    id:'feedback' as StageId, de:'Feedback & Nachbesserung', ru:'Отзыв и доработка',
    icon:MessageCircle, roleDe:'Isa + Entwicklerteam', roleRu:'Иса и разработчики',
    titleDe:'Rückmeldungen kommen an die richtige Stelle', titleRu:'Отзывы попадают к нужной задаче',
    detailDe:'Isa meldet Beobachtungen im ProRiv Hub direkt zur Testaufgabe. Wir prüfen das Feedback und bearbeiten nötige Änderungen wieder in Development.',
    detailRu:'Иса оставляет замечания в ProRiv Hub прямо в тестовом задании. Мы проверяем отзыв и дорабатываем функцию в Development.'
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
          <p className="pr-eyebrow">{label('SO ARBEITEN WIR','КАК МЫ РАБОТАЕМ')}</p>
          <h3>{label('Von der Entwicklung zum Kundentest','От разработки к тестированию')}</h3>
          <p>{label('Zwei getrennte Umgebungen: Development nur für uns, Release Preview / Test für Isa und sein Team.','Две отдельные среды: Development только для нас, Release Preview / Test для Исы и его команды.')}</p>
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
              <span className="pr-process-step-copy"><strong>{label(item.de,item.ru)}</strong><small>{label(item.roleDe,item.roleRu)}</small></span>
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
      <p className="pr-process-note">{label('Die eigentliche ProRiv-App hat zurzeit keine Produktionsumgebung. Die Release Preview ist ein separater, nur nach Freigabe zugänglicher Testbereich.','У основного приложения ProRiv пока нет продуктивной среды. Release Preview — отдельная тестовая среда, доступная только после допуска.')}</p>
    </div>

    <div className="pr-process-agreements" data-testid="roadmap-commitments">
      <div className="pr-process-agreements-heading">
        <div>
          <p className="pr-eyebrow">{label('GEMEINSAM VEREINBAREN','ДОГОВОРИМСЯ ВМЕСТЕ')}</p>
          <h3>{label('Drei Fragen an Isa','Три вопроса к Исе')}</h3>
          <p>{label('Diese drei Punkte klären wir im Gespräch. Auf eine Karte klicken, um eine Antwort festzuhalten.','Эти три вопроса решим на встрече. Нажмите карточку, чтобы записать ответ.')}</p>
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
      <p className="pr-focus-footnote">{label('Notizen werden im Browser gespeichert. Kalendereinladungen oder Freigaben werden hier nicht automatisch ausgelöst.','Заметки сохраняются в браузере. Приглашения и допуски не отправляются автоматически.')}</p>
    </div>
  </section>;
}
