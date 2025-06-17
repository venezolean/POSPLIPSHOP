import { SaleDraft } from "./types";


const DRAFT_KEY = 'plipshop_venta_borradores';

export function getDrafts(): SaleDraft[] {
  const raw = localStorage.getItem(DRAFT_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveDraft(draft: SaleDraft) {
  const drafts = getDrafts();
  const updated = [draft, ...drafts.filter(d => d.id !== draft.id)].slice(0, 3);
  localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
}

export function deleteDraft(id: string) {
  const drafts = getDrafts().filter(d => d.id !== id);
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}
