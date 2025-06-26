import { Component } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common'; // <-- Import CommonModule
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FilterComponent], // <-- Add CommonModule here
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  products = {
    book1: {
      name: 'Book 1',
      price: 122,
      image: 'assets/book1.webp', // your local image
      author: 'Author A',
    },
    book2: {
      name: 'Book 2',
      price: 339,
      image: 'assets/book2.webp',
      author: 'Author B',
    },
    book3: {
      name: 'Book 3',
      price: 4499,
      image: 'assets/book3.webp',
      author: 'Author C',
    },
    book4: {
      name: 'Book 4',
      price: 1444,
      image: 'assets/book4.webp',
      author: 'Author D',
    },
  };
}
