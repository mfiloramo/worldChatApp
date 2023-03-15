import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { TranslationService } from "../../services/translation.service";
import { WebSocketService } from '../../services/web-socket.service';
import mockData from './mockData';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent {
  @Input() userId: any;
  @Input() scrollDown: any;
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;
  public mockConvo = mockData;
  public message: string = '';

  constructor(
    private translationService: TranslationService,
    private webSocketService: WebSocketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.webSocketService.connect();
    this.webSocketService.onMessage()
      .subscribe((event: any) => {
        const reader = new FileReader();
        reader.onload = async () => {
          let message = JSON.parse(reader.result as string);
          message.text = await this.translateText(message.text);
          this.mockConvo.push(message);
        };
        reader.readAsText(event.data);
      });

    // TODO: LOAD THE CONVERSATION FROM LOCAL STORAGE IF IT EXISTS
    // const savedConversation = localStorage.getItem('conversation');
    // if (savedConversation) {
    //   this.mockConvo = JSON.parse(savedConversation);
    // }
  }

  public async translateText(text: string): Promise<any> {
    return await this.translationService
      .post('translate', { inputText: text }).toPromise();
  }

}
