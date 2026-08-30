
import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


interface Message {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
}


interface Conversation {
  id: string;
  name: string;
  role: string;
  initials: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
}


@Component({
  selector: 'app-messages',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  template: `

<div class="h-screen flex bg-[#f5f4f1]">


  <!-- ================= CONVERSATION SIDEBAR ================= -->

<div
  class="w-80
bg-white
border-r
border-stone-100
flex
flex-col">


<!-- Header -->

<div
  class="p-6
border-b
border-stone-100">

<h1
class="text-2xl
font-bold
text-stone-900">

Messages

</h1>

<p
class="text-sm
text-stone-500
mt-1">

Communicate with applicants

</p>

</div>


<!-- Search -->

<div
  class="p-4
border-b
border-stone-100">

<div class="relative">

<svg
  xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
class="absolute
left-3
top-1/2
-translate-y-1/2
text-stone-400">

<circle
cx="11"
cy="11"
r="8"/>

<path
  d="m21 21-4.3-4.3"/>

</svg>


<input
  [(ngModel)]="searchTerm"
type="text"
placeholder="Search conversations..."
class="w-full
pl-10
pr-4
py-2.5
bg-stone-50
border
border-stone-100
rounded-xl
text-sm
outline-none
focus:ring-2
focus:ring-brand-100
focus:border-brand-300">

</div>

</div>


<!-- Conversations -->

<div
class="flex-1
overflow-y-auto">


<button
*ngFor="let conversation of filteredConversations()"
(click)="selectConversation(conversation)"
class="w-full
text-left
p-4
flex
items-center
gap-3
border-b
border-stone-50
transition-colors"
  [class.bg-brand-50]="
selectedConversation()?.id === conversation.id
"
  [class.hover:bg-stone-50]="
selectedConversation()?.id !== conversation.id
">


<!-- Avatar -->

<div
  class="w-11
h-11
rounded-xl
bg-brand-600
text-white
flex
items-center
justify-center
font-bold
text-sm
flex-shrink-0">

{{ conversation.initials }}

</div>


<!-- Information -->

<div
class="flex-1
min-w-0">


<div
class="flex
justify-between
items-center">

<h3
class="font-semibold
text-sm
text-stone-900
truncate">

{{ conversation.name }}

</h3>

<span
class="text-xs
text-stone-400
flex-shrink-0
ml-2">

{{ conversation.lastTime }}

</span>

</div>


<div
class="flex
justify-between
items-center
mt-1">

<p
class="text-xs
text-stone-500
truncate
pr-2">

{{ conversation.lastMessage }}

</p>


<!-- Unread -->

<span
*ngIf="conversation.unread > 0"
class="min-w-5
h-5
px-1.5
rounded-full
bg-red-500
text-white
text-[10px]
font-bold
flex
items-center
justify-center">

{{ conversation.unread }}

</span>

</div>

</div>

</button>


<!-- No conversations -->

<div
*ngIf="filteredConversations().length === 0"
class="p-8
text-center">

<div
class="w-12
h-12
rounded-xl
bg-stone-50
text-stone-400
flex
items-center
justify-center
mx-auto
mb-3">

<svg
xmlns="http://www.w3.org/2000/svg"
width="22"
height="22"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
a4 4 0 0 1 4-4h10
a4 4 0 0 1 4 4z"/>

</svg>

</div>


<p
class="text-sm
font-semibold
text-stone-700">

No conversations

</p>

<p
class="text-xs
text-stone-400
mt-1">

Conversations with applicants will appear here.

</p>

</div>

</div>

</div>


<!-- ================= CHAT AREA ================= -->

<div
class="flex-1
flex
flex-col
min-w-0">


<!-- Nothing selected -->

<div
*ngIf="!selectedConversation()"
class="flex-1
flex
items-center
justify-center">

<div class="text-center">

<div
  class="w-16
h-16
mx-auto
rounded-2xl
bg-brand-50
text-brand-600
flex
items-center
justify-center
mb-4">

<svg
xmlns="http://www.w3.org/2000/svg"
width="30"
height="30"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
a4 4 0 0 1 4-4h10
a4 4 0 0 1 4 4z"/>

</svg>

</div>


<h2
class="text-lg
font-bold
text-stone-900">

Your messages

</h2>


<p
class="text-sm
text-stone-500
mt-1">

Select an applicant conversation to start messaging.

</p>

</div>

</div>


<!-- ================= ACTIVE CHAT ================= -->

<ng-container
*ngIf="selectedConversation() as conversation">


  <!-- Chat Header -->

<div
  class="h-20
bg-white
border-b
border-stone-100
px-6
flex
items-center
gap-3">


<div
class="w-11
h-11
rounded-xl
bg-brand-600
text-white
flex
items-center
justify-center
font-bold
text-sm">

{{ conversation.initials }}

</div>


<div>

<h2
  class="font-bold
text-stone-900">

{{ conversation.name }}

</h2>


<p
class="text-xs
text-stone-500">

{{ conversation.role }}

</p>

</div>

</div>


<!-- Messages -->

<div
class="flex-1
overflow-y-auto
p-6
space-y-4">


<div
*ngFor="let message of conversation.messages"
class="flex"
  [class.justify-end]="message.sender === 'me'"
  [class.justify-start]="message.sender === 'them'">


<div
  class="max-w-[70%]">


<div
  class="px-4
py-3
rounded-2xl
text-sm
leading-relaxed"
  [class.bg-brand-600]="message.sender === 'me'"
  [class.text-white]="message.sender === 'me'"
  [class.rounded-br-md]="message.sender === 'me'"
  [class.bg-white]="message.sender === 'them'"
  [class.text-stone-700]="message.sender === 'them'"
  [class.border]="message.sender === 'them'"
  [class.border-stone-100]="message.sender === 'them'"
  [class.rounded-bl-md]="message.sender === 'them'">

  {{ message.text }}

</div>


<p
class="text-[10px]
text-stone-400
mt-1"
  [class.text-right]="message.sender === 'me'">

  {{ message.time }}

</p>

</div>

</div>


<!-- Empty -->

<div
*ngIf="conversation.messages.length === 0"
class="h-full
flex
items-center
justify-center">

<div class="text-center">

<div
  class="w-12
h-12
rounded-xl
bg-brand-50
text-brand-600
flex
items-center
justify-center
mx-auto
mb-3">

<svg
xmlns="http://www.w3.org/2000/svg"
width="22"
height="22"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="m22 2-7 20-4-9-9-4Z"/>

<path
  d="M22 2 11 13"/>

  </svg>

  </div>


  <p
class="text-sm
font-semibold
text-stone-700">

No messages yet

</p>

<p
class="text-xs
text-stone-400
mt-1">

Start the conversation below.

</p>

</div>

</div>

</div>


<!-- Message Input -->

<div
class="bg-white
border-t
border-stone-100
p-4">

<form
(ngSubmit)="sendMessage()"
class="flex
items-end
gap-3">


<textarea
  [(ngModel)]="messageText"
name="message"
rows="1"
placeholder="Type your message..."
(keydown.enter)="handleEnter($event)"
class="flex-1
resize-none
bg-stone-50
border
border-stone-100
rounded-xl
px-4
py-3
text-sm
outline-none
focus:ring-2
focus:ring-brand-100
focus:border-brand-300">
</textarea>


<button
type="submit"
  [disabled]="!messageText.trim()"
class="w-11
h-11
rounded-xl
bg-brand-600
text-white
flex
items-center
justify-center
hover:bg-brand-700
disabled:opacity-40
disabled:cursor-not-allowed
transition-all">

<svg
xmlns="http://www.w3.org/2000/svg"
width="18"
height="18"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">

<path
  d="m22 2-7 20-4-9-9-4Z"/>

<path
  d="M22 2 11 13"/>

  </svg>

  </button>

  </form>


  <p
class="text-[10px]
text-stone-400
mt-2
ml-1">

Press Enter to send

</p>

</div>

</ng-container>

</div>

</div>
  `
})
export class MessagesComponent implements OnInit {

  private route = inject(ActivatedRoute);


  searchTerm = '';

  messageText = '';


  /*
   * IMPORTANT:
   *
   * There are NO hard-coded conversations anymore.
   *
   * Conversations are created only when the Messages page
   * receives applicant information through query parameters.
   *
   * Example:
   *
   * /messages?userId=123&name=John%20Doe&role=Software%20Developer
   */
  conversations = signal<Conversation[]>([]);


  selectedConversation =
    signal<Conversation | null>(null);


  /*
   * Search conversations.
   */
  filteredConversations = computed(() => {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();


    if (!search) {

      return this.conversations();

    }


    return this.conversations().filter(
      conversation =>
        conversation.name
          .toLowerCase()
          .includes(search)
    );

  });


  ngOnInit(): void {

    /*
     * Read applicant information from the URL.
     *
     * Example:
     *
     * /messages?userId=123&name=John%20Doe&role=Software%20Developer
     */

    this.route.queryParams.subscribe(params => {

      const userId =
        params['userId'];


      /*
       * If no applicant/user ID was provided,
       * do NOT create a fake conversation.
       */

      if (!userId) {

        return;

      }


      const name =
        params['name'] || 'Applicant';


      const role =
        params['role'] || 'Applicant';


      /*
       * Check if this applicant already has a conversation
       * during the current frontend session.
       */

      const existing =
        this.conversations().find(
          conversation =>
            conversation.id === userId
        );


      if (existing) {

        this.selectConversation(existing);

        return;

      }


      /*
       * Generate initials.
       */

      const initials =
        name
          .split(' ')
          .filter(Boolean)
          .map(
            (part: string) =>
              part.charAt(0)
          )
          .join('')
          .slice(0, 2)
          .toUpperCase();


      /*
       * Create a NEW conversation for this applicant.
       *
       * No backend is used.
       */

      const newConversation: Conversation = {

        id: userId,

        name,

        role,

        initials:
          initials || 'AP',

        unread: 0,

        lastMessage:
          'Start a conversation',

        lastTime: '',

        messages: []

      };


      /*
       * Add the applicant to the conversation list.
       */

      this.conversations.update(
        list => [
          newConversation,
          ...list
        ]
      );


      /*
       * Automatically open the applicant's chat.
       */

      this.selectedConversation
        .set(newConversation);

    });

  }


  /*
   * Select a conversation.
   */

  selectConversation(
    conversation: Conversation
  ): void {

    this.selectedConversation
      .set(conversation);


    /*
     * Clear unread count.
     */

    this.conversations.update(list =>

      list.map(item =>

        item.id === conversation.id

          ? {
              ...item,
              unread: 0
            }

          : item

      )

    );

  }


  /*
   * Send a message.
   *
   * IMPORTANT:
   *
   * This is still frontend-only.
   *
   * The message exists while the application is running,
   * but it is NOT saved to the backend/database.
   */

  sendMessage(): void {

    const text =
      this.messageText.trim();


    const conversation =
      this.selectedConversation();


    if (!text || !conversation) {

      return;

    }


    const newMessage: Message = {

      id: Date.now(),

      sender: 'me',

      text,

      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit'
          }
        )

    };


    /*
     * Update the conversation list.
     */

    this.conversations.update(list =>

      list.map(item =>

        item.id === conversation.id

          ? {

              ...item,

              lastMessage: text,

              lastTime: newMessage.time,

              messages: [
                ...item.messages,
                newMessage
              ]

            }

          : item

      )

    );


    /*
     * Update the currently open conversation.
     */

    this.selectedConversation.update(
      current =>

        current

          ? {

              ...current,

              lastMessage: text,

              lastTime: newMessage.time,

              messages: [
                ...current.messages,
                newMessage
              ]

            }

          : current
    );


    /*
     * Clear input.
     */

    this.messageText = '';

  }


  /*
   * Enter = send.
   *
   * Shift + Enter = new line.
   */

  handleEnter(event: Event): void {

    const keyboardEvent =
      event as KeyboardEvent;


    if (keyboardEvent.shiftKey) {

      return;

    }


    keyboardEvent.preventDefault();

    this.sendMessage();

  }

}
