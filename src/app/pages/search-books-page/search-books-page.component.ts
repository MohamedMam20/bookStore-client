import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { ToggleFilterMenuComponent } from '../../components/toggle-filter-menu/toggle-filter-menu.component';
import { Book } from '../../models/book.model';
import { SearchServiceService } from '../../services/search/search-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-books-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FilterComponent,
    ToggleFilterMenuComponent,
  ],
  templateUrl: './search-books-page.component.html',
  styleUrl: './search-books-page.component.css',
})
export class SearchBooksPageComponent implements OnInit {
  products: Book[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';

  constructor(
    private searchService: SearchServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const term = params['q'] || '';
      const page = parseInt(params['page'], 10) || 1;

      this.searchTerm = term;
      this.currentPage = page;

      if (term) {
        this.loadSearchResults(term, page);
      } else {
        this.products = [];
        this.isLoading = false;
      }
    });
  }

  loadSearchResults(term: string, page: number = 1): void {
    this.isLoading = true;
    this.searchService.searchBooks(term, page).subscribe({
      next: (res) => {
        this.products = res.books;
        this.totalPages = res.totalPages;
        this.currentPage = page;
        this.searchService.setResults(res.books);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load search results', err);
        this.products = [];
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], {
        queryParams: { q: this.searchTerm, page },
        queryParamsHandling: 'merge',
      });
    }
  }
}
