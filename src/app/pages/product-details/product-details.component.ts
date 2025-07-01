import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BooksService } from '../../services/books/books.service';
import { BookReviewsComponent } from '../book-reviews/book-reviews.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, FormsModule, BookReviewsComponent]
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private booksService = inject(BooksService);
  Math = Math;
  Number = Number;
  averageRating = 0;
  reviewsCount = 0;
  selectedLanguage: 'ar' | 'en' | 'fr' = 'en';
  slug: string = '';
  quantity = 1;
  viewsCount = 0;
  showDescription = false;
  showReviewsSection = false;
  showSection: 'review' | 'description' | '' = '';
  bookLoading = false;
  bookError: string | null = null;

  product: any = {};
  @ViewChild('reviewSection') reviewSection!: ElementRef;

  ngOnInit() {
    this.viewsCount = Math.floor(Math.random() * 200) + 50;

    this.route.paramMap.subscribe((params) => {
  const id = params.get('id');
  if (id) {
    this.slug = id;
    this.fetchProduct(id);
  }
});

  }

  onRatingStatsChange(data: { average: number; count: number }) {
    this.averageRating = data.average;
    this.reviewsCount = data.count;
  }

  getLanguageName(code: string): string {
    const names: any = {
      en: 'English',
      ar: 'Arabic',
      fr: 'French'
    };
    return names[code] || code;
  }

fetchProduct(id: string) {
  this.bookLoading = true;
  this.bookError = null;

  this.booksService.getBookById(id).subscribe({
    next: (res: any) => {
      this.product = res.data || res;


      this.slug = this.product.slug;


      this.averageRating = this.product.averageRating || 0;
      this.reviewsCount = this.product.reviewsCount || 0;


      this.product.languages = (Object.entries(this.product.stock || {}) as [string, number][])
        .filter(([_, quantity]) => quantity > 0)
        .map(([code]) => ({
          name: this.getLanguageName(code),
          code,
          selected: code === 'en'
        }));


      this.selectedLanguage = this.product.languages.find((l: any) => l.selected)?.code || 'en';

      this.bookLoading = false;
    },
    error: (err: any) => {
      this.bookError = err?.error?.message || 'Error fetching book details.';
      this.toastr.error(this.bookError || 'Error fetching book details.');
      this.bookLoading = false;
    }
  });
}




  increment() {
    const maxStock = this.getStockForSelectedLang();
    if (this.quantity < maxStock) this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  selectLanguage(lang: any) {
    this.product.languages?.forEach((l: any) => (l.selected = false));
    lang.selected = true;
    this.selectedLanguage = lang.code;
  }

  getStockForSelectedLang(): number {
    return this.product.stock?.[this.selectedLanguage] || 0;
  }

  toggleSection(section: 'review' | 'description') {
    this.showSection = section;
    this.showReviewsSection = section === 'review';
    this.showDescription = section === 'description';
  }

  scrollToReview() {
    this.showSection = 'review';
    this.showReviewsSection = true;
    setTimeout(() => {
      this.reviewSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 0);
  }
}
