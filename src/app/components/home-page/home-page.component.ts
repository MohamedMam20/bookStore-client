import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ScrollToTopComponent } from '../../shared/scroll-to-top/scroll-to-top.component';
import { ChatbotComponent } from "../chatbot/chatbot.component";
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books/books.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ScrollToTopComponent, ChatbotComponent ,CommonModule,
    ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit , AfterViewInit {
  currentImageIndex: number = 0;
  images!: NodeListOf<HTMLImageElement>;

fullText: string = 'Book Shelf';
displayText: string = '';
index: number = 0;
isTyping: boolean = true;

//books
 bestSellers: Book[] = [];
  loading = true;


// books
constructor(private booksService: BooksService) {}

// ngOnInit() {
//     this.typeEffect();
// }
ngOnInit(): void {

  this.typeEffect();

  //books
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

typeEffect() {
    if (this.isTyping) {
      if (this.index < this.fullText.length) {
        this.displayText = this.fullText.slice(0, this.index + 1);
        this.index++;
        setTimeout(() => this.typeEffect(), 150);
      } else {
        this.isTyping = false;
        setTimeout(() => this.typeEffect(), 2000);
      }
    } else {
      if (this.index > 0) {
        this.displayText = this.fullText.slice(0, this.index - 1);
        this.index--;
        setTimeout(() => this.typeEffect(), 100);
      } else {
        this.isTyping = true;
        setTimeout(() => this.typeEffect(), 500);
      }
    }
  }

   ngAfterViewInit(): void {
    this.images = document.querySelectorAll('.slider-image');
    setInterval(() => this.showNextImage(), 4000);
  }

  showNextImage() {
    if (!this.images.length) return;

    this.images[this.currentImageIndex].classList.remove('active');
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.images[this.currentImageIndex].classList.add('active');
  }

// export class HomePageComponent implements OnInit {
  // bestSellers: Book[] = [];
  // loading = true;

  // constructor(private booksService: BooksService) {}


}
