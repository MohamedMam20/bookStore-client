import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { Book } from '../../../../models/book.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

declare var bootstrap: any; // Declare Bootstrap to use it without TypeScript errors

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  books: Book[] = [];
  loading: boolean = false;
  error: string | null = null;
  isLoadingMore: boolean = false;
  hasMoreBooks: boolean = true;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  // Modal related properties
  private deleteModal: any;
  bookToDelete: Book | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

  categories: any[] = [];
  selectedCategory: string = '';

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.adminService.getAllCategories(1, 100).subscribe({
      next: (res) => {
        this.categories = res.data || [];
      },
      error: (err) => {
        this.categories = [];
      }
    });
    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.currentPage = 1;
      this.loadBooks();
    });

    // Initialize the modal after view is ready
    setTimeout(() => {
      const modalElement = document.getElementById('deleteBookModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.deleteModal = new bootstrap.Modal(modalElement, {
          backdrop: false, // Disable the backdrop
          keyboard: true   // Allow ESC key to close the modal
        });
      }
    }, 0);
  }

  loadBooks(): void {
    this.loading = true;
    this.adminService.getAllBooks(this.currentPage, this.itemsPerPage, this.searchQuery, this.selectedCategory, 'createdAt').subscribe({
      next: (response) => {
        if (response && response.data) {
          this.books = response.data;
          this.totalItems = response.totalItems || 0;
          this.totalPages = response.totalPages || 1;
          this.hasMoreBooks = this.currentPage < this.totalPages;
        } else if (Array.isArray(response)) {
          this.books = response;
        }
        this.loading = false;
        this.isLoadingMore = false;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please try again.';
        this.loading = false;
        this.isLoadingMore = false;
        console.error('Error loading books:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.isLoadingMore = true;
    this.loadBooks();
  }

  refreshBooks(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  // Instead of calling searchBooks directly, call this on input change
  onSearchQueryChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  // Open delete modal with the book to delete
  openDeleteModal(book: Book): void {
    this.bookToDelete = book;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      // If modal wasn't initialized, try again
      const modalElement = document.getElementById('deleteBookModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.deleteModal = new bootstrap.Modal(modalElement, {
          backdrop: false, // Disable the backdrop
          keyboard: true   // Allow ESC key to close the modal
        });
        this.deleteModal.show();
      }
    }
  }

  // Confirm book deletion from the modal
  confirmDeleteBook(): void {
    if (!this.bookToDelete) return;

    const bookId = this.bookToDelete.slug || this.bookToDelete._id;

    this.adminService.deleteBook(bookId).subscribe({
      next: () => {
        this.books = this.books.filter(book => book._id !== this.bookToDelete?._id);
        this.toastr.success('Book deleted successfully');
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting book:', err);
        this.toastr.error('Failed to delete book. Please try again.');
      }
    });
  }

  // Close the delete modal
  closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
      this.bookToDelete = null;
    }
  }

  /**
   * Calculate total stock across all languages
   */
  getTotalStock(book: Book): number {
    if (!book.stock) return 0;

    return (book.stock.en || 0) +
           (book.stock.ar || 0) +
           (book.stock.fr || 0);
  }
}
