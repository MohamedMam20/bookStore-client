import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { Book } from '../../../../models/book.model';
import { ToastrService } from 'ngx-toastr'; // Add this import
import { forkJoin } from 'rxjs'; // Add this import at the top

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  categories: string[] = [];
  selectedCategory: string = '';
  selectedBooks = new Set<string>(); // Make sure this is defined
  sortColumn: string = 'title'; // Add this property
  sortDirection: 'asc' | 'desc' = 'asc'; // Add this property

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService // Add ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.adminService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = [...this.books];
        this.extractCategories();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please try again.';
        this.loading = false;
        console.error('Error loading books:', err);
      }
    });
  }

  extractCategories(): void {
    const uniqueCategories = new Set<string>();
    this.books.forEach(book => {
      if (book.category) {
        uniqueCategories.add(book.category);
      }
    });
    this.categories = Array.from(uniqueCategories);
  }

  filterBooks(): void {
    this.filteredBooks = this.books.filter(book => {
      const matchesSearch = !this.searchTerm ||
        book.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = !this.selectedCategory ||
        book.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearch(): void {
    this.filterBooks();
  }

  onCategoryChange(): void {
    this.filterBooks();
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.adminService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book._id !== id);
          this.filterBooks();
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Failed to delete book. Please try again.');
        }
      });
    }
  }

  // Add these methods
  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showError(message: string): void {
    this.toastr.error(message);
  }

  sortBooks(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredBooks.sort((a, b) => {
      // Use type-safe property access instead of indexing
      let aValue: any = '';
      let bValue: any = '';

      // Safely access properties based on column name
      switch(column) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'author':
          aValue = a.author || '';
          bValue = b.author || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        // Add other properties as needed
        default:
          aValue = '';
          bValue = '';
      }

      if (typeof aValue === 'string') {
        return this.sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return this.sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });
  }

  deleteSelectedBooks(): void {
    if (this.selectedBooks.size === 0) return;

    if (confirm(`Are you sure you want to delete ${this.selectedBooks.size} books?`)) {
      const deleteObservables = Array.from(this.selectedBooks).map(id =>
        this.adminService.deleteBook(id)
      );

      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.books = this.books.filter(book => !this.selectedBooks.has(book._id));
          this.filterBooks();
          this.selectedBooks.clear();
          this.showSuccess('Selected books deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting books:', error);
          this.showError('Failed to delete some books. Please try again.');
        }
      });
    }
  }
}
