import type { ChatFormData } from './types';

let draft: ChatFormData | null = null;

export function setChatbotDraft(data: ChatFormData) {
  draft = data;
}

export function consumeChatbotDraft(): ChatFormData | null {
  const data = draft;
  draft = null;
  return data;
}
