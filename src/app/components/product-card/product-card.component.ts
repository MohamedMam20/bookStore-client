import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-product-card',
  standalone: true, // ⬅️ add this
  imports: [CommonModule], // ⬅️ needed for currency pipe, ngIf, ngFor
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Book;
}
