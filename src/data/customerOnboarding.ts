/**
 * Facilitator-led customer onboarding, 31 October 2026.
 * Canon: docs/PRORIV_CANON_ROLES_PROCESSES_2026-10-16.md.
 * The two currently authorized product environments supersede the canon's
 * generic eventual production phase for this meeting.
 * Internal plans must never be presented as Isa-confirmed approvals.
 */
export interface Translated { de: string; ru: string }
export type EvidenceLevel = 'canon' | 'team' | 'open';
export interface TalkingPoint {
  id: string;
  text: Translated;
  evidence: EvidenceLevel;
  source: string;
}
export interface OnboardingQuestion {
  id: string;
  prompt: Translated;
  hint?: Translated;
}
export interface OnboardingStation {
  id: string;
  title: Translated;
  purpose: Translated;
  points: TalkingPoint[];
  questions: OnboardingQuestion[];
}
const tr = (de: string, ru: string): Translated => ({ de, ru });
const fact = (id:string,de:string,ru:string):TalkingPoint => ({id,text:tr(de,ru),evidence:'canon',source:'PRORIV_CANON_ROLES_PROCESSES_2026-10-16.md'});
const plan = (id:string,de:string,ru:string):TalkingPoint => ({id,text:tr(de,ru),evidence:'team',source:'Interne Teamentscheidung für Onboarding 31.10.2026'});
const unknown = (id:string,de:string,ru:string):TalkingPoint => ({id,text:tr(de,ru),evidence:'open',source:'Im Kundengespräch zu klären'});
const ask = (id:string,de:string,ru:string,hint?:Translated):OnboardingQuestion => ({id,prompt:tr(de,ru),hint});

export const ACCOUNT_TYPES = [
  {id:'github',name:'GitHub',reason:tr('Code, Zugriffsrechte und Repository-Zuständigkeit','Код, права доступа и ответственность за репозиторий')},
  {id:'aws',name:'AWS',reason:tr('Cloud-Betrieb und Kostenverantwortung','Облачная инфраструктура и ответственность за расходы')},
  {id:'domain',name:'Domain & E-Mail',reason:tr('Domain-Inhaberschaft, DNS-Verwaltung, SPF/DKIM und E-Mail-Postfächer für System-, Einladungs- und Rapport-Nachrichten','Владение доменом, DNS-записи, SPF/DKIM и почтовые ящики для системных писем, приглашений и рапортов')},
  {id:'tripletex',name:'Tripletex',reason:tr('ERP-, Zeiterfassungs- und Buchhaltungszugang für Kunden-, Projekt- und Stundenabgleich sowie spätere Rechnungsübergabe','Доступ к ERP и бухгалтерии для синхронизации клиентов, проектов, часов и последующей передачи счетов')},
  {id:'apple',name:'Apple Developer',reason:tr('iOS-Signierung, TestFlight und spätere Veröffentlichung','Подпись iOS, TestFlight и будущая публикация')},
  {id:'google',name:'Google Play Console',reason:tr('Android-Testverteilung und spätere Veröffentlichung','Тестирование Android и будущая публикация')},
  {id:'ai',name:'OpenAI',reason:tr('Spätere JEV/Luna-E-Mail-Auswertung: Rapportantwort eindeutig zuordnen und Zustimmung, Ablehnung oder Unklarheit erkennen – keine automatische Freigabe bei Zweifeln','Будущий анализ почты JEV/Luna: связать ответ с рапортом и определить согласие, отказ или неопределённость; при сомнении не считать одобрением')}
] as const;
export type AccountId = typeof ACCOUNT_TYPES[number]['id'];

// IDs from earlier onboarding versions remain readable and exportable even though the questions are no longer shown.
export const LEGACY_ONBOARDING_QUESTIONS = [
  {id:'firstScope',label:tr('Frühere Frage zum ersten Testumfang','Прежний вопрос о первом объёме тестирования')},
  {id:'acceptance',label:tr('Frühere Frage zu Abnahmekriterien','Прежний вопрос о критериях приёмки')},
  {id:'nextPreview',label:tr('Frühere Frage zur nächsten Testphase','Прежний вопрос о следующей тестовой версии')},
  {id:'cadence',label:tr('Frühere Frage zu Regelterminen','Прежний вопрос о регулярных встречах')},
  {id:'hubContacts',label:tr('Frühere Hub-Zugangsfrage','Прежний вопрос о доступе к Hub')},
  {id:'accountDecision',label:tr('Frühere Gesamtverantwortung der Konten','Прежний вопрос об ответственности за аккаунты')},
  {id:'owner',label:tr('Frühere Frage zur Protokollfreigabe','Прежний вопрос о подтверждении протокола')},
  {id:'followup',label:tr('Frühere Frage zum Folgetermin','Прежний вопрос о следующей встрече')}
] as const;

export const ONBOARDING_STATIONS: OnboardingStation[] = [
  {
    id:'project',title:tr('So arbeiten wir','Как мы работаем'),
    purpose:tr('Vom internen Development zum freigegebenen Kundentest – und welche drei Absprachen wir dafür mit Isa treffen.','От внутренней разработки к тестированию заказчиком — и три вопроса, которые нужно согласовать с Исой.'),
    points:[
      plan('dev','Development: ausschließlich Entwicklerteam; Isa erhält keinen Zugriff.','Development: доступ только у разработчиков; Иса не имеет доступа.'),
      plan('review','Jede Funktion wird zuerst intern geprüft und erst danach ausdrücklich für die Testumgebung freigegeben.','Каждую функцию сначала проверяем внутри команды и только после этого допускаем к тестированию.'),
      plan('preview','Release Preview / Test ist eine zweite, separate Umgebung für Isa und sein Team. Dort testen sie ausschließlich freigegebene Funktionen.','Release Preview / Test — вторая, отдельная среда для Исы и его команды. Там проверяют только допущенные функции.'),
      plan('feedback','Isa gibt Feedback zu konkreten Testaufgaben im ProRiv Hub; Änderungen bearbeiten wir anschließend intern.','Иса оставляет отзывы к конкретным заданиям в ProRiv Hub; изменения затем вносим внутри команды.'),
      plan('noProd','Eine Produktionsumgebung der eigentlichen ProRiv-App gibt es derzeit nicht.','Сейчас у основного приложения ProRiv нет продуктивной среды.')
    ],
    questions:[
      ask('releaseOwner','Wer koordiniert die fachlichen Tests auf Kundenseite?','Кто со стороны заказчика координирует функциональное тестирование?'),
      ask('testWindow','Welche Testfenster legen wir gemeinsam fest?','Какие сроки тестирования согласуем?'),
      ask('testProcess','Welche Antwortfristen für Rückfragen und Feedback vereinbaren wir?','Какие сроки ответа на вопросы и отзывы согласуем?')
    ]
  },
  {
    id:'hub',title:tr('Kommunikation & Zusammenarbeit','Коммуникация и сотрудничество'),
    purpose:tr('Telegram als erster Kanal für den schnellen Austausch; ProRiv Hub für erweiterte Rollen, Aufgaben und Web-Zugang','Telegram как основной канал для быстрой связи; ProRiv Hub для ролей, задач и веб-доступа'),
    points:[
      plan('telegramPrimary','Telegram ist unser erster und direkter Kanal für schnelle Abstimmungen, Fragen, Sprachnachrichten und Status-Updates.','Telegram — наш основной и прямой канал для оперативных согласований, вопросов, голосовых сообщений и обновлений.'),
      plan('communication','Der Hub bietet Projektübersicht, gemeinsamen Chat, Testaufgaben mit zugeordnetem Feedback und Entscheidungen. Das Entwicklerteam arbeitet zusätzlich in einem geschützten internen Bereich.','В Hub есть обзор проекта, общий чат, тестовые задачи с отзывами и решения. Для разработчиков имеется отдельная защищённая внутренняя область.'),
      plan('button','„App testen“ im Hub soll zur separaten, freigegebenen Release-Preview-Umgebung führen.','Кнопка «Тестировать приложение» в Hub должна открывать отдельную разрешённую среду Release Preview.'),
      plan('security','Die interne Zeiterfassung der Entwickler bleibt ein geschützter, für Isa nicht zugänglicher Bereich.','Внутренний учёт рабочего времени разработчиков остаётся закрытым для Исы.'),
      plan('prepared','Der Hub wurde unter https://gen-lang-client-0888260919.web.app/ veröffentlicht und der Admin-Login live bestätigt. Echte Kundeneinladungen und Rollenrechte müssen vor der Nutzung mit Isa noch separat geprüft werden.','Hub опубликован по адресу https://gen-lang-client-0888260919.web.app/, вход администратора проверен. Настоящее приглашение заказчика и его права необходимо дополнительно проверить.'),
      plan('noTelegram','Telegram kann weiterhin für schnelle Nachrichten dienen. Hub-Nachrichten und Aufgaben sind vorhanden; eine Telegram-Bot-Synchronisierung ist nicht implementiert.','Telegram можно продолжать использовать для быстрых сообщений. Сообщения и задачи в Hub уже есть; синхронизация с Telegram-ботом не реализована.'),
      plan('team','Entwicklerteam: Hasin, Ismail, Amruddy. Isa und seine ausgewählten Personen nutzen den gemeinsamen Projektbereich.','Разработчики: Хьасин, Исмаил, Амрудди. Иса и назначенные им участники используют общую проектную область.')
    ],
    questions:[
      ask('contacts','Wen laden wir in den Hub ein und wer trifft auf Kundenseite verbindliche fachliche Entscheidungen?','Кого приглашаем в Hub и кто со стороны заказчика принимает обязательные решения?'),
      ask('feedback','Wie kennzeichnen wir kritische Fehler gegenüber normalen Verbesserungswünschen?','Как отличать критические ошибки от обычных предложений по улучшению?')
    ]
  },
  {
    id:'accounts',title:tr('Konten und Verantwortung','Аккаунты и ответственность'),
    purpose:tr('Eigentümer, Einrichtung, Zugang und Folgeaufgaben je Dienst dokumentieren','Зафиксировать владельца, настройку, доступы и следующие действия по каждому сервису'),
    points:[
      plan('separate','Kundenrelevante Plattformkonten und Kostenverantwortung werden je Anbieter ausdrücklich zugeordnet.','Владельцев платформенных аккаунтов и расходы назначаем для каждого провайдера отдельно.'),
      fact('jev','Beim späteren E-Mail-Prozess muss die Kundenantwort zum richtigen Rapport gehören; uneindeutige KI-Klassifikation erfordert menschliche Prüfung, keine automatische Freigabe.','В будущем анализе писем ответ должен быть связан с правильным рапортом; неоднозначный вывод ИИ проверяется человеком, а не считается одобрением.'),
      unknown('services','Vorhandene Verträge, Konten, Bezahlung, Rechte und Anbieterfreigaben sind beim Termin zu klären.','Существующие договоры, аккаунты, оплата, права и доступы уточняются на встрече.')
    ],
    questions:[]
  },
  {
    id:'finish',title:tr('Ergebnisse & Abschluss','Результаты и завершение'),
    purpose:tr('Nur tatsächlich bestätigte Beschlüsse zusammenfassen und sicher exportieren','Подвести итоги только по реально подтверждённым решениям и сохранить протокол'),
    points:[
      plan('recap','Entscheidungen, noch offene Punkte, verantwortliche Personen, benötigte Unterlagen und Termine gemeinsam vorlesen und bestätigen.','Вместе сверить решения, открытые вопросы, ответственных, документы и сроки.'),
      plan('backup','Vor dem Verlassen des Browsers Markdown-Protokoll UND JSON-Sicherung herunterladen und außerhalb des Browsers sichern.','Перед закрытием браузера скачать протокол Markdown И резервную копию JSON и сохранить их отдельно.'),
      unknown('assets','Echte Links, Zugangsdatenverantwortung, nächster Termin und Preview-Freigabe werden nur eingetragen, wenn sie beim Termin verifiziert wurden.','Ссылки, ответственных за доступы, следующую встречу и статус Preview указываем только после проверки.')
    ],
    questions:[]
  }
];
export const ONBOARDING_WORK_STATION_COUNT = ONBOARDING_STATIONS.length - 1;
