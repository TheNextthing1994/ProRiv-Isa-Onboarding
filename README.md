# ProRiv – Isa Onboarding

Eigenständige, öffentlich lesbare Präsentation für das Kunden-Onboarding mit Isa vom 31. Oktober 2026.

**Vortragsseite (veröffentlicht):** https://thenextthing1994.github.io/ProRiv-Isa-Onboarding/

**Quellcode:** https://github.com/TheNextthing1994/ProRiv-Isa-Onboarding

## Umfang

- Vier navigierbare Bereiche: Arbeitsweise, ProRiv Hub und Zusammenarbeit, Konten und Zuständigkeiten, Ergebnisse und Abschluss.
- Umschaltung Deutsch / Russisch / Deutsch + Russisch.
- Anklickbarer Entwicklungs- und Testablauf, Gesprächsfragen und Kontenübersicht.
- Browserlokale Speicherung mit Markdown- und JSON-Export.
- Separat vom ursprünglichen Eventstorming-Projekt. Es werden keine internen Rechercheunterlagen oder bestehenden Gesprächsnotizen veröffentlicht.

## Lokaler Start

Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

Im Browser `http://127.0.0.1:3000/presentation.html` öffnen.

Build: `npm run build` (Ausgabe: `dist/presentation.html`). Die GitHub-Pages-Aktion legt zusätzlich `dist/index.html` an.

## Datenschutz und Grenzen

Dieses Repository und die GitHub-Pages-Präsentation sind **öffentlich**. Alle eingegebenen Antworten und Notizen werden ausschließlich im Browser gespeichert, nicht im GitHub-Repository und nicht in einer Online-Datenbank. Nicht zwischen Geräten synchronisiert. Keine Passwörter, API-Keys oder Recovery-Codes eingeben. Vor Verlassen Markdown-Protokoll und vollständiges JSON-Backup herunterladen. Die öffentliche Präsentation gewährt niemandem Zugriff auf den eigentlichen ProRiv Hub oder AWS.

Medien: Original-Hintergrund und ein Originalporträt wurden aus dem autorisierten Ursprungsrepository übernommen. Ein zweites, über 1 MB großes Originalporträt war nicht direkt abrufbar; dafür wird der Ausschnitt aus einem kleineren, bereits vorhandenen Teamfoto der Quelle gezeigt. Das öffentliche Repository enthält damit Teamabbildungen. Keine personenbezogenen Gesprächsnotizen wurden übertragen.

## Herkunft

**Synchronisiert am 31.10.2026 gegen den aktuellen Quell-Commit `fa307008c53b2f14e24062673a904e03cf361828`** aus dem privaten `TheNextthing1994/Eventstorming-ProRiv`.

Übernommen: aktuelle `CustomerOnboarding`-Komponente, `ProRivHubCenter`, `ProRivProjectRoadmapPremium`, neuer `TelegramProjectChannel`, Datenmodell, beide Präsentations-Stylesheets und relevante Bilder. Enthalten sind damit auch die einklappbare Sidebar und neue Kontoangaben einschließlich Domain und Tripletex.

Bewusste Anpassungen in der unabhängigen Version: Die Links zu internen Workshop-Routen sind ausgeblendet; historische Workshop-Notizen werden nicht geladen. Gesprächseingaben werden ausschließlich unter dem eigenen Browser-Speicherschlüssel `proriv_isa_onboarding_public_v1` gespeichert. Exporte bleiben möglich; die Ursprungsdatenbank ist nicht eingebunden.

**Prüfung:** `npm run build` sowie `npm run test:e2e` (Playwright/Chromium). Die übrige Workshop-Anwendung, ihre Forschungsdaten und ihre privaten gespeicherten Gesprächsinhalte sind nicht Teil dieses Repositories.

