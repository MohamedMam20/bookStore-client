import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { Book } from '../../../../models/book.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

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

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 1;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;

    this.adminService.getAllBooks(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.books = response.data;
          this.totalItems = response.totalItems || 0;
          this.totalPages = response.totalPages || 1;
          
          // Update hasMoreBooks based on pagination info
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

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.adminService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book._id !== id);
          this.toastr.success('Book deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          this.toastr.error('Failed to delete book. Please try again.');
        }
      });
    }
  }
}
