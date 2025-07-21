import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../models/category.model';

declare var bootstrap: any; // Declare Bootstrap to use it without TypeScript errors

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Modal related properties
  private deleteModal: any;
  categoryToDelete: Category | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // Initialize the modal after view is ready
    setTimeout(() => {
      this.initializeModal();
    }, 0);
  }

  private initializeModal(): void {
    const modalElement = document.getElementById('deleteCategoryModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      // Dispose of any existing modal instance to prevent memory leaks
      if (this.deleteModal) {
        this.deleteModal.dispose();
      }

      this.deleteModal = new bootstrap.Modal(modalElement, {
        backdrop: false, // Disable the backdrop to prevent interaction issues
        keyboard: true   // Allow ESC key to close the modal
      });
    }
  }

  openDeleteModal(category: Category): void {
    this.categoryToDelete = category;
    if (!this.deleteModal) {
      this.initializeModal();
    }
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
      this.categoryToDelete = null;
    }
  }

  loadCategories(): void {
    this.loading = true;
    this.adminService.getAllCategories(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.categories = response.data;
          this.filteredCategories = [...this.categories];

          // Set pagination data if available
          if (response.page) this.currentPage = response.page;
          if (response.totalPages) this.totalPages = response.totalPages;
          if (response.totalItems) this.totalItems = response.totalItems;
        } else {
          // console.error('Unexpected response format:', response);
          this.error = 'Unexpected data format from server';
          this.categories = [];
          this.filteredCategories = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories. Please try again.';
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  onSearch(): void {
    this.filterCategories();
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(category => {
      return (
        category.name.toLowerCase().includes(searchTerm) ||
        (category.description && category.description.toLowerCase().includes(searchTerm))
      );
    });
  }

  confirmDeleteCategory(): void {
    if (!this.categoryToDelete) return;

    const idOrSlug = this.categoryToDelete.slug || this.categoryToDelete._id || '';

    this.adminService.deleteCategory(idOrSlug).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category._id !== this.categoryToDelete?._id);
        this.filterCategories();
        this.toastr.success('Category deleted successfully');
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        this.toastr.error(err.error?.message || 'Failed to delete category. Please try again.');
        this.closeDeleteModal();
      }
    });
  }

  // Replace the existing deleteCategory method with this one that opens the modal
  deleteCategory(idOrSlug: string): void {
    const category = this.categories.find(cat => cat._id === idOrSlug || cat.slug === idOrSlug);
    if (category) {
      this.openDeleteModal(category);
    }
  }

  changePage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage) {
      return;
    }
    this.currentPage = pageNumber;
    this.loadCategories();
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
