export type Language = 'de' | 'ru' | 'bilingual';
export interface WorkshopNote { answer?: string; isaConfirmed?: boolean }
export type WorkshopNotes = Record<string, WorkshopNote>;