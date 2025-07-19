import { Component , ElementRef , ViewChild , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbootService } from '../../services/chatbot/chatboot.service';


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('typingIndicator') typingIndicator!: ElementRef;
  @ViewChild('suggestedQuestions') suggestedQuestions!: ElementRef;

  userInput = '';
  isOpen = false;

  messages: { sender: 'user' | 'bot'; text: string; time: string }[] = [
    {
      sender: 'bot',
      text: "Hello! I'm here to help you discover amazing books. What genre are you interested in?",
      time: this.getCurrentTime()
    }
  ];
   constructor(private chatbotService:ChatbootService){}

   ngOnInit(){
    const savedMessages =localStorage.getItem('chatMessages');
    if(savedMessages){
      this.messages = JSON.parse(savedMessages);
    }else {
      this.messages =[
        {
          sender:'bot',
          text:"Hello! I'm here to help you discover amazing books. What genre are you interested in?",
          time: this.getCurrentTime(),
        },
      ];
    }
   }

   toggleChat() {
    this.isOpen = !this.isOpen;
  }

  onSendClick() {
    const msg = this.userInput.trim();
    if (!msg) return;

    if (msg === 'stop') {
    this.stopResponse();
    this.userInput = '';
    return;
  }

  this.sendMessage(msg);
  this.userInput = '';
  }

  setSuggested(text: string) {
    this.userInput = text;
    this.onSendClick();
  }

  isLoading = false;
  cancelled = false;

  sendMessage(message: string) {
  this.addMessage(message, 'user');
  this.typingIndicator.nativeElement.style.display = 'flex';
  this.isLoading = true;
  this.cancelled = false;


  this.chatbotService.getAIResponse(message).subscribe(
    (response) => {
      this.isLoading = false;
      this.typingIndicator.nativeElement.style.display = 'none';

      if (!this.cancelled) {
        this.typeMessage(response.reply, 'bot');
      }
    },
    (error) => {
      this.isLoading = false;
      this.typingIndicator.nativeElement.style.display = 'none';
      if (!this.cancelled) {
        this.addMessage('❌ There was an error, please try again later.', 'bot');
      }
    }
  );
}


stopResponse() {
  if (this.isLoading) {
    this.cancelled = true;
    this.typingIndicator.nativeElement.style.display = 'none';
    this.isLoading = false;
    this.addMessage('❌ Stopped response.', 'bot');
  }
}

onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    const msg = this.userInput.trim().toLowerCase();

    if (!msg) return;

    if (msg === 'stop') {
      this.stopResponse();
      this.userInput = '';
    } else {
      if (this.isLoading) {
        this.stopResponse();
      }
      this.onSendClick();
    }
  }
}


  addMessage(text: string, sender: 'user' | 'bot') {
    this.messages.push({ sender, text, time: this.getCurrentTime() });
    const updatedMessages = [...this.messages];
    localStorage.setItem('chatMessages',JSON.stringify(updatedMessages));
    setTimeout(() => this.scrollToBottom(), 100);
  }

typeMessage(message: string, sender: 'user' | 'bot') {
  const msgObj = { sender, text: '', time: this.getCurrentTime() };
  this.messages.push(msgObj);
  this.scrollToBottom();

  this.typingIndicator.nativeElement.style.display = 'none';

  let i = 0;
  const typingInterval = setInterval(() => {
    msgObj.text += message.charAt(i);
    i++;
    this.scrollToBottom();

    if (i >= message.length) {
      clearInterval(typingInterval);
    }
  }, 50);
}

  getCurrentTime(): string {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${ampm}`;
  }

  scrollToBottom() {
    const el = this.chatMessages.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  logout(){
    localStorage.removeItem('chatMessages');
  }

}
