import { Component } from '@angular/core';
import { ScrollToTopComponent } from '../../shared/scroll-to-top/scroll-to-top.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ChatbotComponent } from "../chatbot/chatbot.component";


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ScrollToTopComponent, FooterComponent, ChatbotComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
