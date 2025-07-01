import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';

import { BooksService } from '../../services/books/books.service';
import { Book } from '../../models/book.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FilterComponent,RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  products: Book[] = [];
  isLoading = true;

  constructor(private productService: BooksService) {}

  ngOnInit(): void {
    this.productService.getBooks().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to fetch products', error);
        this.isLoading = false;
      },
    });
  }
}
