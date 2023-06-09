import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Conversation } from '../../interfaces/conversation.interfaces';
import { ConversationService } from './conversation.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.css'],
})
export class ConvosComponent implements OnInit {
  @Input() user: any;
  @Output() conversationSelected = new EventEmitter<any>();
  public conversations: any[] = [];
  public isLoading: boolean = false;

  constructor(
    private conversationService: ConversationService,
  ) { }

  /** LIFECYCLE HOOKS */
  async ngOnInit(): Promise<any> {
    // LOAD CONVERSATIONS BY USERID
    try {
      this.isLoading = true;
      this.conversations = await this.conversationService.loadConversationsByUserId() // INPUT: this.user.user_id
        .then((response: any) => {
          this.isLoading = false;
          return response;
        });
    } catch (error) {
      console.error('Error loading conversations:', error);
      }
    }

    // TODO: AFTER THE CONVERSATIONS LOAD, BUT BEFORE THEY'RE ADDED TO THE DOM, ITERATE THROUGH AND CALL THE SP ON EACH CONVERSATION USING THE APPROPRIATE SERVICE THAT CALLS IT (CONVERSATION SERVICE?). AND RENDERING EACH TRAIT.

  /** PUBLIC METHODS */
  public onSelectConversation(conversation: Conversation): void {
    // EMIT SELECTED CONVERSATION
    this.conversationSelected.emit(conversation);
  }

  public checkConvoVisibility(conversation: Conversation): boolean {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: string = this.convertToConvoKey(conversation.name);

    // INDICATE IF CONVERSATION KEY IS CACHED IN LOCALSTORAGE; DISPLAY ACCORDINGLY
    return (localStorage.getItem(conversationKey) ?? 'enabled') === 'enabled';
  }

  public removeConvo(conversation: Conversation): void {
    // IDENTIFY CONVERSATION ACCORDING TO LOCALSTORAGE KEY
    const conversationKey: string = this.convertToConvoKey(conversation.name);

    // SET SELECTED CONVERSATION TO "DISABLED" IN LOCALSTORAGE CACHE
    localStorage.setItem(conversationKey, 'disabled');
  }

  /** UTILITY FUNCTIONS */
  public convertIsoString(isoString: string): string {
    return dayjs(isoString).format('MM/DD/YYYY');
  }

  private convertToConvoKey(conversationName: string): string {
    return `${conversationName}_vis`;
  }

  public truncateSentence(sentence: string, maxLength: number): string {
    return sentence.length > maxLength ? sentence.slice(0, maxLength - 3) + '...' : sentence;
  }

}
