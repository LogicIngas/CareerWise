import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface ChatConversation {
  id: string;
  companyId: string;
  companyName: string;
  companyInitials: string;
  role: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly STORAGE_KEY = 'careerwise_chats';

  private conversationsSignal =
    signal<ChatConversation[]>(this.loadChats());

  conversations =
    this.conversationsSignal.asReadonly();

  activateCompanyChat(
    companyId: string,
    companyName: string,
    jobTitle: string
  ): ChatConversation {

    const existing =
      this.conversationsSignal().find(
        chat => chat.companyId === companyId
      );

    if (existing) {
      return existing;
    }

    const initials =
      companyName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const conversation: ChatConversation = {
      id: `company-${companyId}`,
      companyId,
      companyName,
      companyInitials: initials || 'CO',
      role: jobTitle,
      unread: 0,
      lastMessage: 'Start a conversation',
      lastTime: '',
      messages: []
    };

    this.conversationsSignal.update(chats => {

      const updated = [
        conversation,
        ...chats
      ];

      this.saveChats(updated);

      return updated;
    });

    return conversation;
  }

  sendMessage(
    conversationId: string,
    text: string
  ): void {

    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    const time =
      new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );

    const message: ChatMessage = {
      id: Date.now(),
      sender: 'me',
      text: cleanText,
      time
    };

    this.conversationsSignal.update(chats => {

      const updated =
        chats.map(chat =>

          chat.id === conversationId
            ? {
              ...chat,
              lastMessage: cleanText,
              lastTime: time,
              messages: [
                ...chat.messages,
                message
              ]
            }
            : chat
        );

      this.saveChats(updated);

      return updated;
    });
  }

  markAsRead(
    conversationId: string
  ): void {

    this.conversationsSignal.update(chats => {

      const updated =
        chats.map(chat =>

          chat.id === conversationId
            ? {
              ...chat,
              unread: 0
            }
            : chat
        );

      this.saveChats(updated);

      return updated;
    });
  }

  private loadChats(): ChatConversation[] {

    try {

      const stored =
        localStorage.getItem(
          this.STORAGE_KEY
        );

      if (!stored) {
        return [];
      }

      return JSON.parse(stored);

    } catch {

      return [];
    }
  }

  private saveChats(
    chats: ChatConversation[]
  ): void {

    try {

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(chats)
      );

    } catch {

      console.error(
        'Unable to save chat conversations.'
      );
    }
  }
}
