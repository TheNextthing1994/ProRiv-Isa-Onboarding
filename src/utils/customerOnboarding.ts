import { ONBOARDING_STATIONS, ACCOUNT_TYPES, LEGACY_ONBOARDING_QUESTIONS } from '../data/customerOnboarding';
export type DecisionStatus = 'open' | 'proposed' | 'confirmed';
export type AccountExists = 'unknown' | 'yes' | 'no';

export interface OnboardingAnswer {
  answer: string;
  status: DecisionStatus;
  owner: string;
  nextStep: string;
  dueDate: string;
  updatedAt: string;
}
export interface OnboardingAccount {
  exists: AccountExists;
  owner: string;
  setupBy: string;
  access: string;
  followUp: string;
  dueDate: string;
}
export interface CustomerOnboardingState {
  version: 1;
  meetingDate: string;
  answers: Record<string, OnboardingAnswer>;
  accounts: Record<string, OnboardingAccount>;
  meetingNotes: string;
}
export const emptyOnboarding = (): CustomerOnboardingState => ({
  version: 1, meetingDate:'2026-10-31', answers:{}, accounts:{}, meetingNotes:''
});
export const emptyAnswer = (): OnboardingAnswer => ({
  answer:'',status:'open',owner:'',nextStep:'',dueDate:'',updatedAt:''
});
export const emptyAccount = (): OnboardingAccount => ({
  exists:'unknown',owner:'',setupBy:'',access:'',followUp:'',dueDate:''
});
const readString = (v:unknown):string => typeof v === 'string' ? v.slice(0,10000) : '';
export function parseOnboarding(input:unknown):CustomerOnboardingState {
  const raw = input && typeof input === 'object' ? input as Record<string,unknown> : {};
  const answers:CustomerOnboardingState['answers'] = {};
  const inputAnswers = raw.answers && typeof raw.answers === 'object' ? raw.answers as Record<string,unknown> : {};
  const valid = new Set([...ONBOARDING_STATIONS.flatMap(s=>s.questions.map(q=>q.id)),...LEGACY_ONBOARDING_QUESTIONS.map(q=>q.id)]);
  for (const [id, item] of Object.entries(inputAnswers)) {
    if (!valid.has(id) || !item || typeof item !== 'object') continue;
    const value = item as Record<string,unknown>;
    const answer = readString(value.answer);
    // Confirmation must be tied to a recorded answer. A prefilled proposal is never confirmed.
    const status = value.status === 'confirmed' && answer.trim() ? 'confirmed' :
      value.status === 'proposed' ? 'proposed' : 'open';
    answers[id] = { answer,status,owner:readString(value.owner),nextStep:readString(value.nextStep),
      dueDate:readString(value.dueDate),updatedAt:readString(value.updatedAt) };
  }
  const accounts:CustomerOnboardingState['accounts'] = {};
  const inputAccounts = raw.accounts && typeof raw.accounts === 'object' ? raw.accounts as Record<string,unknown> : {};
  for (const a of ACCOUNT_TYPES) {
    const item = inputAccounts[a.id];
    if (!item || typeof item !== 'object') continue;
    const value = item as Record<string,unknown>;
    accounts[a.id] = { exists:value.exists === 'yes' || value.exists === 'no' ? value.exists : 'unknown',
      owner:readString(value.owner),setupBy:readString(value.setupBy),
      access:readString(value.access),followUp:readString(value.followUp),
      dueDate:readString(value.dueDate) };
  }
  return { version:1,meetingDate:'2026-10-31',answers,accounts,meetingNotes:readString(raw.meetingNotes) };
}

export function onboardingMarkdown(state:CustomerOnboardingState, language:'de'|'ru'='de'):string {
  const t=(de:string,ru:string)=>language==='ru'?ru:de;
  const text=(v:string)=>v.trim() || '—';
  const label = (s:DecisionStatus) => s==='confirmed' ? t('Von Isa bestätigt','Подтверждено Исой') :
    s==='proposed' ? t('Interner Vorschlag','Внутреннее предложение') : t('Offen','Открыто');
  let md = '# ProRiv (Isa’s Projekt) – '+t('Kunden-Onboarding','Онбординг заказчика')+'\n\n';
  md += t('**Termin:**','**Дата:**')+' 31.10.2026\n\n';
  md += '> '+t('Gesprächsprotokoll; ältere Workshop-Antworten sind nicht automatisch Isa-Bestätigungen. Keine Passwörter oder API-Schlüssel dokumentieren.',
    'Протокол встречи; прежние заметки не считаются автоматическим подтверждением Исы. Не хранить пароли и API-ключи.')+'\n\n';
  ONBOARDING_STATIONS.forEach((station,index)=>{
    md += '## '+(station.id==='finish'?'':(index+1)+'. ')+station.title[language]+'\n\n';
    md += '**'+t('Gesprächsgrundlage','Материал для обсуждения')+'**\n\n';
    for (const item of station.points) {
      const kind=item.evidence==='canon' ? t('Kanonische Projektgrundlage','Подтверждённая проектная основа') :
        item.evidence==='team' ? t('Teamplan – nicht von Isa bestätigt','План команды – не подтверждён Исой') :
        t('Offen','Открыто');
      md += '- **'+kind+':** '+item.text[language]+' ('+item.source+')\n';
    }
    md += '\n';
    for (const q of station.questions) {
      const a = state.answers[q.id] || emptyAnswer();
      md += '### '+q.prompt[language]+'\n\n';
      // An answer captured during the meeting is not automatically an Isa-approved decision.
      if (a.status !== 'open' && a.answer.trim()) md += '- '+t('Historische Kennzeichnung','Прежняя отметка')+': '+label(a.status)+'\n';
      md += '- '+t('Antwort','Ответ')+': '+text(a.answer)+'\n';
      if (a.owner.trim()) md += '- '+t('Verantwortlich','Ответственный')+': '+text(a.owner)+'\n';
      // Legacy follow-up data stays exportable even though the presentation no longer asks for it.
      if (a.nextStep.trim()) md += '- '+t('Nächste Aufgabe','Следующий шаг')+': '+text(a.nextStep)+'\n';
      if (a.dueDate.trim()) md += '- '+t('Termin','Срок')+': '+text(a.dueDate)+'\n';
      md += '\n';
    }
    if (station.id==='accounts') {
      md += '### '+t('Kontenmatrix','Матрица аккаунтов')+'\n\n';
      for (const account of ACCOUNT_TYPES) {
        const a = state.accounts[account.id] || emptyAccount();
        md += '**'+account.name+'**\n\n';
        md += '- '+t('Vorhanden','Существует')+': '+(a.exists==='yes'?t('Ja','Да'):a.exists==='no'?t('Nein','Нет'):t('Ungeklärt','Неизвестно'))+'\n';
        md += '- '+t('Eigentümer','Владелец')+': '+text(a.owner)+'\n';
        md += '- '+t('Einrichtung','Настраивает')+': '+text(a.setupBy)+'\n';
        md += '- '+t('Zugriff','Доступ')+': '+text(a.access)+'\n';
        md += '- '+t('Folgeaufgabe','Следующее действие')+': '+text(a.followUp)+'\n';
        md += '- '+t('Frist','Срок')+': '+text(a.dueDate)+'\n\n';
      }
    }
  });
  const historic = LEGACY_ONBOARDING_QUESTIONS.filter(q=>state.answers[q.id] && (
    state.answers[q.id].answer.trim() || state.answers[q.id].owner.trim() ||
    state.answers[q.id].nextStep.trim() || state.answers[q.id].dueDate.trim()
  ));
  if (historic.length) {
    md += '## '+t('Frühere Antworten (archiviert)','Прежние ответы (архив)')+'\n\n';
    for (const q of historic) {
      const a=state.answers[q.id];
      md += '### '+q.label[language]+'\n\n';
      if (a.status !== 'open' && a.answer.trim()) md += '- '+t('Historische Kennzeichnung','Прежняя отметка')+': '+label(a.status)+'\n';
      md += '- '+t('Antwort','Ответ')+': '+text(a.answer)+'\n';
      if(a.owner.trim()) md += '- '+t('Verantwortlich','Ответственный')+': '+text(a.owner)+'\n';
      if(a.nextStep.trim()) md += '- '+t('Nächste Aufgabe','Следующий шаг')+': '+text(a.nextStep)+'\n';
      if(a.dueDate.trim()) md += '- '+t('Termin','Срок')+': '+text(a.dueDate)+'\n';
      md += '\n';
    }
  }
  md += '## '+t('Weitere Besprechungsnotizen','Дополнительные заметки')+'\n\n'+text(state.meetingNotes)+'\n';
  return md;
}

export function onboardingActionItems(state:CustomerOnboardingState) {
  const items = ONBOARDING_STATIONS.flatMap(st=>st.questions.map(q=>({
    id:q.id, title:q.prompt, answer:state.answers[q.id]||emptyAnswer()
  })));
  const previous = LEGACY_ONBOARDING_QUESTIONS.map(q=>({id:q.id,title:q.label,answer:state.answers[q.id]||emptyAnswer()}));
  const accounts = ACCOUNT_TYPES.map(account => {
    const value = state.accounts[account.id] || emptyAccount();
    return {
      id: 'account:' + account.id,
      title: { de: account.name + ' – Konto und Zuständigkeit', ru: account.name + ' – аккаунт и ответственные' },
      answer: { ...emptyAnswer(), nextStep: value.followUp, owner: value.setupBy || value.owner, dueDate: value.dueDate }
    };
  });
  return [...items, ...previous, ...accounts].filter(i=>i.answer.nextStep.trim() || i.answer.owner.trim() || i.answer.dueDate.trim());
}
