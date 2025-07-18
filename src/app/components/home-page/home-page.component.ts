import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTopComponent } from '../../shared/scroll-to-top/scroll-to-top.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books/books.service';
import { ProductCardComponent } from '../product-card/product-card.component';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ScrollToTopComponent,
    FooterComponent,
    ChatbotComponent,
    CommonModule,
    ProductCardComponent,
  ],

  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  bestSellers: Book[] = [];
  loading = true;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.booksService.getBestSellers().subscribe({
      next: (books) => {
        this.bestSellers = books;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bestsellers:', err);
        this.loading = false;
      },
    });
  }
}
