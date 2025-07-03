import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { Book } from '../../models/book.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  products: Book[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  wishlistItemIdMap: { [bookId: string]: string } = {};

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.viewWishlist().subscribe({
      next: (res) => {
        const data = res.data || [];
        this.products = data.map((item: any) => ({
          _id: item.bookId,
          title: item.title,
          price: item.price,
          image: item.image,
          author: item.author,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading wishlist', err);
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadWishlist();
    }
  }

  continueShopping() {
    this.router.navigateByUrl('/');
  }
}
