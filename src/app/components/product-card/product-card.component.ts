import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';

import { BooksService } from '../../services/books/books.service';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgFor, FilterComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  products: Book[] = [];
  isLoading = true;

  constructor(
    private productService: BooksService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

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

  addToCart(bookId: string, language: string = 'en') {
    this.cartService.addToCart({ bookId, quantity: 1, language }).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Error adding to cart');
        console.error(err);
      },
    });
  }
}
