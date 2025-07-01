import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
<<<<<<< HEAD
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FilterComponent,RouterModule],
=======
import { CartService } from '../../services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  standalone: true, // ⬅️ add this
  imports: [CommonModule], // ⬅️ needed for currency pipe, ngIf, ngFor
>>>>>>> f81e3c34affb691b19b319be946277375aafdbe9
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Book;

}
