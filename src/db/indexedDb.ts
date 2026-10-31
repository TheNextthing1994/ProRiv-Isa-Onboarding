import type { WorkshopNotes } from '../types';
import { emptyOnboarding, parseOnboarding } from '../utils/customerOnboarding';
import type { CustomerOnboardingState } from '../utils/customerOnboarding';

const KEY = 'proriv_isa_onboarding_public_v1';

export async function initializeDatabase(): Promise<void> {
  // Do not use the original internal Eventstorming database in the public app.
  // Accessing localStorage may throw when the browser blocks it.
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('Browser storage is unavailable');
  }
}

export async function loadCustomerOnboarding(): Promise<CustomerOnboardingState> {
  const saved = window.localStorage.getItem(KEY);
  return saved ? parseOnboarding(JSON.parse(saved)) : emptyOnboarding();
}

export async function saveCustomerOnboarding(value: CustomerOnboardingState): Promise<void> {
  window.localStorage.setItem(KEY, JSON.stringify(parseOnboarding(value)));
}

export async function loadWorkshopNotes(): Promise<WorkshopNotes> {
  return {};
}

export async function exportStateAsJson(): Promise<string> {
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    customerOnboarding: await loadCustomerOnboarding(),
    origin: 'ProRiv-Isa-Onboarding',
    note: 'Only locally entered onboarding notes are included, never internal Eventstorming data'
  }, null, 2);
}
