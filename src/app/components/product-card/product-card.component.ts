import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Book;
  @Output() wishlistChanged = new EventEmitter<void>();

  wishlistItems: string[] = [];
  private subscription: any;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscription = this.wishlistService.wishlistIds$.subscribe((ids) => {
      this.wishlistItems = ids;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isInWishlist(): boolean {
    return this.wishlistItems.includes(this.product._id);
  }

  toggleWishlist(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const bookId = this.product._id;

    if (this.isInWishlist()) {
      this.wishlistService.deleteItem(bookId).subscribe({
        next: () => {
          this.toastr.info('Removed from wishlist');
          this.wishlistChanged.emit();
        },
        error: (err) => {
          this.toastr.error(
            err.error.message || 'Error removing from wishlist'
          );
        },
      });
    } else {
      this.wishlistService.addToWishlist({ bookId, language: 'en' }).subscribe({
        next: () => {
          this.toastr.success('Added to wishlist');
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Error adding to wishlist');
        },
      });
    }
  }

  addToCart(bookId: string, language: string = 'en', event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart({ bookId, quantity: 1, language }).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
      },
      error: (err) =>
        this.toastr.error(err.error.message || 'Error adding to cart'),
    });
  }

  onBoltClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
