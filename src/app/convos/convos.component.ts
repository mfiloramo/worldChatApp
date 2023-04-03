import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConversationService } from "./conversation.service";

@Component({
  selector: 'app-convos',
  templateUrl: './convos.component.html',
  styleUrls: ['./convos.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('300ms ease-in')),
    ]),
    trigger('fadeOut', [
      state('void', style({ opacity: 0 })),
      transition(':leave', animate('300ms ease-out')),
    ]),
  ]
})
export class ConvosComponent implements OnInit {
  @Input() user: any;
  @Output() conversationSelected = new EventEmitter<any>();
  public conversations: any[] = [];

  constructor(private conversationService: ConversationService) { }

  ngOnInit() {
    // POPULATE MOCKDATA WITH CONVERSATIONS MATCHING USERID
    this.conversationService.loadConversationsByUserId(14).subscribe((response: any) => {
      this.conversations = response;
    })
  }

  public onSelectConversation(conversation: any) {
    this.conversationSelected.emit(conversation);
  }
}
