import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true, // ⬅️ add this
  imports: [CommonModule,RouterModule], // ⬅️ needed for currency pipe, ngIf, ngFor
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Book;
  onBoltClick(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  // TODO: Add functionality for bolt
}

onCartClick(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  // TODO: Add to cart logic here
}

onHeartClick(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  // TODO: Add to wishlist logic here
}

}
