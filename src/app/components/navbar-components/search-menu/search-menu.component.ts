import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchServiceService } from '../../../services/search/search-service.service';
import { Router } from '@angular/router';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-search-menu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-menu.component.html',
  styleUrl: './search-menu.component.css',
})
export class SearchMenuComponent {
  constructor(
    private searchService: SearchServiceService,
    private router: Router
  ) {}

  @Input() isSearchVisible = false;
  @Output() searchClosed = new EventEmitter<void>();

  searchTerm: string = '';
  page: number = 1;
  limit: number = 6;

  closeSearch() {
    this.searchClosed.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const keyword = this.searchTerm.trim();
      if (!keyword) return;

      this.searchService.searchBooks(keyword, this.page, this.limit).subscribe({
        next: (res) => {
          this.searchService.setResults(res.books);
          this.searchTerm = '';
          this.closeSearch();
          this.router.navigate(['/search'], {
            queryParams: { q: keyword, page: this.page },
          });
        },
        error: (err) => {
          console.error('Search failed:', err);
        },
      });
    }
  }
}
